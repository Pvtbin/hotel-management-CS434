import { query } from '../config/database.js';

export const createTicket = async (req, res) => {
  const { subject, message, priority } = req.body;
  if (!subject || !message) return res.status(400).json({ message: 'Vui lòng nhập tiêu đề và nội dung' });
  const result = await query(
    'INSERT INTO support_tickets (user_id, subject, message, priority) VALUES (?, ?, ?, ?)',
    [req.user.id, subject, message, priority || 'medium']
  );
  res.status(201).json({ message: 'Tạo yêu cầu hỗ trợ thành công', id: result.insertId });
};

export const getMyTickets = async (req, res) => {
  const tickets = await query(
    'SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id]
  );
  res.json({ tickets });
};

export const getAllTickets = async (req, res) => {
  const { status } = req.query;
  let sql = `SELECT st.*, u.full_name as customer_name, a.full_name as assigned_name
             FROM support_tickets st LEFT JOIN users u ON st.user_id = u.id
             LEFT JOIN users a ON st.assigned_to = a.id WHERE 1=1`;
  const params = [];
  if (status) { sql += ' AND st.status = ?'; params.push(status); }
  sql += ' ORDER BY st.created_at DESC';
  const tickets = await query(sql, params);
  res.json({ tickets });
};

export const updateTicket = async (req, res) => {
  const { status, assigned_to, priority } = req.body;
  await query(
    'UPDATE support_tickets SET status=?, assigned_to=?, priority=? WHERE id=?',
    [status, assigned_to, priority, req.params.id]
  );
  res.json({ message: 'Cập nhật yêu cầu thành công' });
};

export const assignTicket = async (req, res) => {
  await query('UPDATE support_tickets SET assigned_to = ?, status = ? WHERE id = ?', [req.user.id, 'in_progress', req.params.id]);
  res.json({ message: 'Đã nhận hỗ trợ' });
};
