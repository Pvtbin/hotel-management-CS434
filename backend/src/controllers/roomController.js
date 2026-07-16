import { query } from '../config/database.js';

export const getRooms = async (req, res) => {
  const { search, type, min_price, max_price, capacity, status, sort, limit, page } = req.query;
  let sql = `
    SELECT r.*, rt.name as room_type_name
    FROM rooms r LEFT JOIN room_types rt ON r.room_type_id = rt.id
    WHERE 1=1
  `;
  const params = [];
  if (search) {
    sql += ' AND (r.room_number LIKE ? OR r.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (type) { sql += ' AND r.room_type_id = ?'; params.push(type); }
  if (min_price) { sql += ' AND r.price_per_night >= ?'; params.push(min_price); }
  if (max_price) { sql += ' AND r.price_per_night <= ?'; params.push(max_price); }
  if (capacity) { sql += ' AND r.capacity >= ?'; params.push(capacity); }
  if (status) { sql += ' AND r.status = ?'; params.push(status); }
  else { sql += " AND r.status != 'maintenance'"; }

  const sortMap = { price_asc: 'r.price_per_night ASC', price_desc: 'r.price_per_night DESC', newest: 'r.created_at DESC' };
  sql += ` ORDER BY ${sortMap[sort] || 'r.id ASC'}`;

  const perPage = parseInt(limit) || 12;
  const pageNum = parseInt(page) || 1;
  const offset = (pageNum - 1) * perPage;
  sql += ` LIMIT ${perPage} OFFSET ${offset}`;

  const rooms = await query(sql, params);
  let countSql = 'SELECT COUNT(*) as total FROM rooms r WHERE 1=1';
  const countParams = [...params].slice(0, params.length);
  // rebuild count params without LIMIT
  let countWhere = '';
  const cp = [];
  if (search) { countWhere += ' AND (r.room_number LIKE ? OR r.description LIKE ?)'; cp.push(`%${search}%`, `%${search}%`); }
  if (type) { countWhere += ' AND r.room_type_id = ?'; cp.push(type); }
  if (min_price) { countWhere += ' AND r.price_per_night >= ?'; cp.push(min_price); }
  if (max_price) { countWhere += ' AND r.price_per_night <= ?'; cp.push(max_price); }
  if (capacity) { countWhere += ' AND r.capacity >= ?'; cp.push(capacity); }
  if (status) { countWhere += ' AND r.status = ?'; cp.push(status); }
  else { countWhere += " AND r.status != 'maintenance'"; }
  countSql += countWhere;
  const [{ total }] = await query(countSql, cp);
  res.json({ rooms, total, page: pageNum, limit: perPage, totalPages: Math.ceil(total / perPage) });
};

export const getRoomById = async (req, res) => {
  const rooms = await query(
    `SELECT r.*, rt.name as room_type_name,
     (SELECT AVG(rating) FROM reviews WHERE room_id = r.id) as avg_rating,
     (SELECT COUNT(*) FROM reviews WHERE room_id = r.id) as review_count
     FROM rooms r LEFT JOIN room_types rt ON r.room_type_id = rt.id
     WHERE r.id = ?`,
    [req.params.id]
  );
  if (rooms.length === 0) {
    return res.status(404).json({ message: 'Không tìm thấy phòng' });
  }
  res.json({ room: rooms[0] });
};

export const getRoomReviews = async (req, res) => {
  const reviews = await query(
    `SELECT rv.*, u.full_name FROM reviews rv JOIN users u ON rv.user_id = u.id WHERE rv.room_id = ? ORDER BY rv.created_at DESC`,
    [req.params.id]
  );
  res.json({ reviews });
};

export const getRoomTypes = async (req, res) => {
  const types = await query('SELECT * FROM room_types ORDER BY id');
  res.json({ room_types: types });
};

export const createRoom = async (req, res) => {
  const { room_number, room_type_id, floor, price_per_night, capacity, area, description, amenities, thumbnail, images, status } = req.body;
  const result = await query(
    `INSERT INTO rooms (room_number, room_type_id, floor, price_per_night, capacity, area, description, amenities, thumbnail, images, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [room_number, room_type_id, floor, price_per_night, capacity, area, description, JSON.stringify(amenities || []), thumbnail, JSON.stringify(images || []), status || 'available']
  );
  res.status(201).json({ message: 'Tạo phòng thành công', id: result.insertId });
};

export const updateRoom = async (req, res) => {
  const { room_number, room_type_id, floor, price_per_night, capacity, area, description, amenities, thumbnail, images, status } = req.body;
  await query(
    `UPDATE rooms SET room_number=?, room_type_id=?, floor=?, price_per_night=?, capacity=?, area=?, description=?, amenities=?, thumbnail=?, images=?, status=? WHERE id=?`,
    [room_number, room_type_id, floor, price_per_night, capacity, area, description, JSON.stringify(amenities || []), thumbnail, JSON.stringify(images || []), status, req.params.id]
  );
  res.json({ message: 'Cập nhật phòng thành công' });
};

export const deleteRoom = async (req, res) => {
  await query('DELETE FROM rooms WHERE id = ?', [req.params.id]);
  res.json({ message: 'Xóa phòng thành công' });
};

export const checkAvailability = async (req, res) => {
  const { check_in, check_out } = req.query;
  if (!check_in || !check_out) {
    return res.status(400).json({ message: 'Vui lòng nhập ngày check-in và check-out' });
  }
  const available = await query(
    `SELECT r.*, rt.name as room_type_name FROM rooms r
     LEFT JOIN room_types rt ON r.room_type_id = rt.id
     WHERE r.status = 'available'
     AND r.id NOT IN (
       SELECT room_id FROM bookings
       WHERE status NOT IN ('cancelled')
       AND check_in < ? AND check_out > ?
     )
     ORDER BY r.price_per_night ASC`,
    [check_out, check_in]
  );
  res.json({ rooms: available });
};
