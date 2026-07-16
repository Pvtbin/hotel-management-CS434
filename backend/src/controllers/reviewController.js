import { query } from '../config/database.js';

export const createReview = async (req, res) => {
  const { booking_id, room_id, rating, comment, cleanliness, service, location } = req.body;
  if (!booking_id || !room_id || !rating) {
    return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin đánh giá' });
  }
  const bookings = await query('SELECT * FROM bookings WHERE id = ? AND user_id = ?', [booking_id, req.user.id]);
  if (bookings.length === 0) return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
  if (bookings[0].status !== 'checked_out') {
    return res.status(400).json({ message: 'Chỉ đánh giá được sau khi check-out' });
  }
  const existing = await query('SELECT id FROM reviews WHERE booking_id = ?', [booking_id]);
  if (existing.length > 0) return res.status(400).json({ message: 'Bạn đã đánh giá đơn này rồi' });
  const result = await query(
    'INSERT INTO reviews (user_id, booking_id, room_id, rating, comment, cleanliness, service, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, booking_id, room_id, rating, comment, cleanliness || rating, service || rating, location || rating]
  );
  res.status(201).json({ message: 'Đánh giá thành công', id: result.insertId });
};

export const getMyReviews = async (req, res) => {
  const reviews = await query(
    `SELECT rv.*, r.room_number, rt.name as room_type_name FROM reviews rv
     JOIN rooms r ON rv.room_id = r.id LEFT JOIN room_types rt ON r.room_type_id = rt.id
     WHERE rv.user_id = ? ORDER BY rv.created_at DESC`,
    [req.user.id]
  );
  res.json({ reviews });
};

export const getAllReviews = async (req, res) => {
  const reviews = await query(
    `SELECT rv.*, u.full_name, r.room_number FROM reviews rv
     JOIN users u ON rv.user_id = u.id JOIN rooms r ON rv.room_id = r.id
     ORDER BY rv.created_at DESC`
  );
  res.json({ reviews });
};

export const deleteReview = async (req, res) => {
  await query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
  res.json({ message: 'Xóa đánh giá thành công' });
};
