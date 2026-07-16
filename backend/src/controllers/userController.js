import bcrypt from 'bcrypt';
import { query } from '../config/database.js';

export const getUsers = async (req, res) => {
  const { role, search } = req.query;
  let sql = 'SELECT id, full_name, email, phone, role, avatar, address, is_active, created_at FROM users WHERE 1=1';
  const params = [];
  if (role) { sql += ' AND role = ?'; params.push(role); }
  if (search) { sql += ' AND (full_name LIKE ? OR email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  sql += ' ORDER BY created_at DESC';
  const users = await query(sql, params);
  res.json({ users });
};

export const getUserById = async (req, res) => {
  const users = await query('SELECT id, full_name, email, phone, role, avatar, address, id_card, is_active, created_at FROM users WHERE id = ?', [req.params.id]);
  if (users.length === 0) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  res.json({ user: users[0] });
};

export const createUser = async (req, res) => {
  const { full_name, email, phone, password, role } = req.body;
  if (!full_name || !email || !password) return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin' });
  const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) return res.status(409).json({ message: 'Email đã được sử dụng' });
  const hashed = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || 10));
  const result = await query(
    'INSERT INTO users (full_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
    [full_name, email, phone, hashed, role || 'customer']
  );
  res.status(201).json({ message: 'Tạo người dùng thành công', id: result.insertId });
};

export const updateUser = async (req, res) => {
  const { full_name, email, phone, role, avatar, address, id_card, is_active, password } = req.body;
  if (password) {
    const hashed = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || 10));
    await query(
      'UPDATE users SET full_name=?, email=?, phone=?, role=?, avatar=?, address=?, id_card=?, is_active=?, password=? WHERE id=?',
      [full_name, email, phone, role, avatar, address, id_card, is_active !== undefined ? is_active : true, hashed, req.params.id]
    );
  } else {
    await query(
      'UPDATE users SET full_name=?, email=?, phone=?, role=?, avatar=?, address=?, id_card=?, is_active=? WHERE id=?',
      [full_name, email, phone, role, avatar, address, id_card, is_active !== undefined ? is_active : true, req.params.id]
    );
  }
  res.json({ message: 'Cập nhật người dùng thành công' });
};

export const deleteUser = async (req, res) => {
  await query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ message: 'Xóa người dùng thành công' });
};

export const toggleUserActive = async (req, res) => {
  const users = await query('SELECT is_active FROM users WHERE id = ?', [req.params.id]);
  if (users.length === 0) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  await query('UPDATE users SET is_active = ? WHERE id = ?', [!users[0].is_active, req.params.id]);
  res.json({ message: 'Cập nhật trạng thái thành công' });
};
