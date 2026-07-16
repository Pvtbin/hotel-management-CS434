import { query } from '../config/database.js';

export const getDashboard = async (req, res) => {
  const [bookingStats] = await query(`
    SELECT
      COUNT(*) as total_bookings,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
      SUM(CASE WHEN status = 'checked_in' THEN 1 ELSE 0 END) as checked_in,
      SUM(CASE WHEN status = 'checked_out' THEN 1 ELSE 0 END) as checked_out,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
    FROM bookings
  `);
  const [revenueStats] = await query(`
    SELECT COALESCE(SUM(total_price), 0) as total_revenue,
           COALESCE(SUM(CASE WHEN MONTH(created_at) = MONTH(CURRENT_DATE) THEN total_price ELSE 0 END), 0) as month_revenue,
           COALESCE(SUM(CASE WHEN DATE(created_at) = CURDATE() THEN total_price ELSE 0 END), 0) as today_revenue
    FROM bookings WHERE status NOT IN ('cancelled')
  `);
  const [roomStats] = await query(`
    SELECT
      COUNT(*) as total_rooms,
      SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
      SUM(CASE WHEN status = 'booked' THEN 1 ELSE 0 END) as booked,
      SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied,
      SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance
    FROM rooms
  `);
  const [userStats] = await query(`
    SELECT
      COUNT(*) as total_users,
      SUM(CASE WHEN role = 'customer' THEN 1 ELSE 0 END) as customers,
      SUM(CASE WHEN role = 'staff' THEN 1 ELSE 0 END) as staff,
      SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins
    FROM users
  `);
  const recentBookings = await query(`
    SELECT b.id, b.check_in, b.check_out, b.total_price, b.status, r.room_number, u.full_name as customer_name
    FROM bookings b JOIN rooms r ON b.room_id = r.id JOIN users u ON b.user_id = u.id
    ORDER BY b.created_at DESC LIMIT 5
  `);
  const monthlyRevenue = await query(`
    SELECT MONTHNAME(created_at) as month, SUM(total_price) as revenue
    FROM bookings WHERE status NOT IN ('cancelled') AND YEAR(created_at) = YEAR(CURRENT_DATE)
    GROUP BY MONTH(created_at), MONTHNAME(created_at) ORDER BY MONTH(created_at)
  `);
  res.json({ bookingStats, revenueStats, roomStats, userStats, recentBookings, monthlyRevenue });
};

export const getReports = async (req, res) => {
  const { type, start_date, end_date } = req.query;
  let report = {};
  if (!type || type === 'revenue') {
    report.revenue = await query(`
      SELECT DATE(created_at) as date, COUNT(*) as bookings, SUM(total_price) as revenue
      FROM bookings WHERE status NOT IN ('cancelled')
      ${start_date ? 'AND created_at >= ?' : ''} ${end_date ? 'AND created_at <= ?' : ''}
      GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30
    `, [start_date, end_date].filter(Boolean));
  }
  if (!type || type === 'rooms') {
    report.rooms = await query(`
      SELECT r.room_number, rt.name as room_type, COUNT(b.id) as bookings, COALESCE(SUM(b.total_price), 0) as revenue
      FROM rooms r LEFT JOIN room_types rt ON r.room_type_id = rt.id
      LEFT JOIN bookings b ON b.room_id = r.id AND b.status NOT IN ('cancelled')
      GROUP BY r.id ORDER BY bookings DESC
    `);
  }
  if (!type || type === 'customers') {
    report.customers = await query(`
      SELECT u.id, u.full_name, u.email, COUNT(b.id) as bookings, COALESCE(SUM(b.total_price), 0) as total_spent
      FROM users u LEFT JOIN bookings b ON b.user_id = u.id AND b.status NOT IN ('cancelled')
      WHERE u.role = 'customer'
      GROUP BY u.id ORDER BY total_spent DESC LIMIT 20
    `);
  }
  res.json({ report });
};
