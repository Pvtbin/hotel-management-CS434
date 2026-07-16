import { query } from '../config/database.js';

export const processPayment = async (req, res) => {
  const { booking_id, method } = req.body;
  if (!booking_id) return res.status(400).json({ message: 'Vui lòng nhập mã đặt phòng' });
  const bookings = await query('SELECT * FROM bookings WHERE id = ? AND user_id = ?', [booking_id, req.user.id]);
  if (bookings.length === 0) return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
  const payments = await query('SELECT * FROM payments WHERE booking_id = ?', [booking_id]);
  if (payments.length > 0 && payments[0].status === 'paid') {
    return res.status(400).json({ message: 'Đơn đã được thanh toán' });
  }
  if (payments.length > 0) {
    await query('UPDATE payments SET status = ?, method = ?, paid_at = NOW() WHERE id = ?', ['paid', method || 'online', payments[0].id]);
  } else {
    await query('INSERT INTO payments (booking_id, amount, method, status, paid_at) VALUES (?, ?, ?, ?, NOW())', [booking_id, bookings[0].total_price, method || 'online', 'paid']);
  }
  await query('UPDATE bookings SET status = ? WHERE id = ?', ['confirmed', booking_id]);
  res.json({ message: 'Thanh toán thành công' });
};

export const getPayment = async (req, res) => {
  const payments = await query(
    `SELECT p.*, b.total_price, b.check_in, b.check_out, r.room_number FROM payments p
     JOIN bookings b ON p.booking_id = b.id JOIN rooms r ON b.room_id = r.id
     WHERE p.booking_id = ?`,
    [req.params.bookingId]
  );
  if (payments.length === 0) return res.status(404).json({ message: 'Không tìm thấy thanh toán' });
  res.json({ payment: payments[0] });
};

export const getAllPayments = async (req, res) => {
  const payments = await query(
    `SELECT p.*, b.user_id, u.full_name as customer_name, r.room_number FROM payments p
     JOIN bookings b ON p.booking_id = b.id JOIN users u ON b.user_id = u.id
     JOIN rooms r ON b.room_id = r.id ORDER BY p.created_at DESC`
  );
  res.json({ payments });
};

export const refundPayment = async (req, res) => {
  const payments = await query('SELECT * FROM payments WHERE id = ?', [req.params.id]);
  if (payments.length === 0) return res.status(404).json({ message: 'Không tìm thấy thanh toán' });
  await query('UPDATE payments SET status = ? WHERE id = ?', ['refunded', req.params.id]);
  res.json({ message: 'Hoàn tiền thành công' });
};
