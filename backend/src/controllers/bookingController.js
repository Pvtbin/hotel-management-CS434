import { query } from '../config/database.js';
import { checkRoomAvailability, calculateNights, calculateTotalPrice } from '../utils/helpers.js';

export const createBooking = async (req, res) => {
  const { room_id, check_in, check_out, adults, children, services, special_requests } = req.body;
  if (!room_id || !check_in || !check_out) {
    return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin đặt phòng' });
  }
  const rooms = await query('SELECT * FROM rooms WHERE id = ?', [room_id]);
  if (rooms.length === 0) return res.status(404).json({ message: 'Không tìm thấy phòng' });

  const nights = calculateNights(check_in, check_out);
  if (nights <= 0) return res.status(400).json({ message: 'Ngày check-out phải sau check-in' });

  const available = await checkRoomAvailability(room_id, check_in, check_out);
  if (!available) return res.status(409).json({ message: 'Phòng đã được đặt trong khoảng thời gian này' });

  let servicesPrice = 0;
  const bookingServices = [];
  if (services && services.length > 0) {
    for (const s of services) {
      const svc = await query('SELECT * FROM services WHERE id = ? AND is_active = TRUE', [s.service_id]);
      if (svc.length > 0) {
        const qty = s.quantity || 1;
        const price = svc[0].price;
        servicesPrice += price * qty;
        bookingServices.push({ service_id: s.service_id, quantity: qty, price });
      }
    }
  }

  const roomTotal = rooms[0].price_per_night * nights;
  const total = roomTotal + servicesPrice;

  const result = await query(
    `INSERT INTO bookings (user_id, room_id, check_in, check_out, adults, children, total_nights, room_price, services_price, total_price, status, special_requests)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    [req.user.id, room_id, check_in, check_out, adults || 1, children || 0, nights, rooms[0].price_per_night, servicesPrice, total, special_requests]
  );

  for (const bs of bookingServices) {
    await query('INSERT INTO booking_services (booking_id, service_id, quantity, price) VALUES (?, ?, ?, ?)', [result.insertId, bs.service_id, bs.quantity, bs.price]);
  }

  await query('UPDATE rooms SET status = ? WHERE id = ?', ['booked', room_id]);

  const booking = await query(
    `SELECT b.*, r.room_number, r.thumbnail, rt.name as room_type_name FROM bookings b
     JOIN rooms r ON b.room_id = r.id LEFT JOIN room_types rt ON r.room_type_id = rt.id
     WHERE b.id = ?`,
    [result.insertId]
  );
  res.status(201).json({ message: 'Đặt phòng thành công', booking: booking[0] });
};

export const getMyBookings = async (req, res) => {
  const bookings = await query(
    `SELECT b.*, r.room_number, r.thumbnail, rt.name as room_type_name,
     p.status as payment_status, p.method as payment_method
     FROM bookings b
     JOIN rooms r ON b.room_id = r.id LEFT JOIN room_types rt ON r.room_type_id = rt.id
     LEFT JOIN payments p ON p.booking_id = b.id
     WHERE b.user_id = ? ORDER BY b.created_at DESC`,
    [req.user.id]
  );
  res.json({ bookings });
};

export const getBookingById = async (req, res) => {
  const bookings = await query(
    `SELECT b.*, r.room_number, r.thumbnail, r.area, r.capacity, rt.name as room_type_name,
     u.full_name, u.email, u.phone, p.status as payment_status, p.method as payment_method
     FROM bookings b
     JOIN rooms r ON b.room_id = r.id LEFT JOIN room_types rt ON r.room_type_id = rt.id
     JOIN users u ON b.user_id = u.id
     LEFT JOIN payments p ON p.booking_id = b.id
     WHERE b.id = ?`,
    [req.params.id]
  );
  if (bookings.length === 0) return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
  const booking = bookings[0];
  const services = await query(
    `SELECT bs.*, s.name as service_name FROM booking_services bs JOIN services s ON bs.service_id = s.id WHERE bs.booking_id = ?`,
    [req.params.id]
  );
  booking.services = services;
  if (req.user.role === 'customer' && booking.user_id !== req.user.id) {
    return res.status(403).json({ message: 'Không có quyền xem đơn này' });
  }
  res.json({ booking });
};

export const cancelBooking = async (req, res) => {
  const bookings = await query('SELECT * FROM bookings WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  if (bookings.length === 0) return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
  if (bookings[0].status === 'checked_in' || bookings[0].status === 'checked_out') {
    return res.status(400).json({ message: 'Không thể hủy đơn đã check-in hoặc check-out' });
  }
  await query('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', req.params.id]);
  await query('UPDATE rooms SET status = ? WHERE id = ?', ['available', bookings[0].room_id]);
  res.json({ message: 'Đã hủy đơn đặt phòng' });
};

export const getAllBookings = async (req, res) => {
  const { status, search } = req.query;
  let sql = `SELECT b.*, r.room_number, u.full_name as customer_name, u.phone as customer_phone
             FROM bookings b JOIN rooms r ON b.room_id = r.id JOIN users u ON b.user_id = u.id WHERE 1=1`;
  const params = [];
  if (status) { sql += ' AND b.status = ?'; params.push(status); }
  if (search) {
    sql += ' AND (r.room_number LIKE ? OR u.full_name LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  sql += ' ORDER BY b.created_at DESC';
  const bookings = await query(sql, params);
  res.json({ bookings });
};

export const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  const bookings = await query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
  if (bookings.length === 0) return res.status(404).json({ message: 'Không tìm thấy đơn' });
  await query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
  if (status === 'checked_in') await query('UPDATE rooms SET status = ? WHERE id = ?', ['occupied', bookings[0].room_id]);
  if (status === 'checked_out' || status === 'cancelled') await query('UPDATE rooms SET status = ? WHERE id = ?', ['available', bookings[0].room_id]);
  res.json({ message: 'Cập nhật trạng thái thành công' });
};

export const checkIn = async (req, res) => {
  const bookings = await query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
  if (bookings.length === 0) return res.status(404).json({ message: 'Không tìm thấy đơn' });
  if (bookings[0].status !== 'confirmed') return res.status(400).json({ message: 'Đơn phải ở trạng thái đã xác nhận' });
  await query('UPDATE bookings SET status = ? WHERE id = ?', ['checked_in', req.params.id]);
  await query('UPDATE rooms SET status = ? WHERE id = ?', ['occupied', bookings[0].room_id]);
  res.json({ message: 'Check-in thành công' });
};

export const checkOut = async (req, res) => {
  const bookings = await query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
  if (bookings.length === 0) return res.status(404).json({ message: 'Không tìm thấy đơn' });
  if (bookings[0].status !== 'checked_in') return res.status(400).json({ message: 'Đơn phải ở trạng thái đang lưu trú' });
  await query('UPDATE bookings SET status = ? WHERE id = ?', ['checked_out', req.params.id]);
  await query('UPDATE rooms SET status = ? WHERE id = ?', ['available', bookings[0].room_id]);
  res.json({ message: 'Check-out thành công' });
};

export const getRevenueStats = async (req, res) => {
  const { start_date, end_date } = req.query;
  let sql = `SELECT DATE(b.created_at) as date, COUNT(*) as bookings, SUM(b.total_price) as revenue
             FROM bookings b WHERE b.status NOT IN ('cancelled')`;
  const params = [];
  if (start_date) { sql += ' AND b.created_at >= ?'; params.push(start_date); }
  if (end_date) { sql += ' AND b.created_at <= ?'; params.push(end_date); }
  sql += ' GROUP BY DATE(b.created_at) ORDER BY date DESC';
  const stats = await query(sql, params);
  const summary = await query(
    `SELECT COUNT(*) as total_bookings, SUM(total_price) as total_revenue,
     (SELECT COUNT(*) FROM bookings WHERE status = 'checked_in') as active_checkins,
     (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_count
     FROM bookings WHERE status NOT IN ('cancelled')`
  );
  res.json({ stats, summary: summary[0] });
};
