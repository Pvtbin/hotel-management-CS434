import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  const { full_name, email, phone, password } = req.body;
  if (!full_name || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu' });
  }
  const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    return res.status(409).json({ message: 'Email đã được sử dụng' });
  }
  const hashed = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || 10));
  const result = await query(
    'INSERT INTO users (full_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
    [full_name, email, phone, hashed, 'customer']
  );
  const user = await query('SELECT id, full_name, email, phone, role FROM users WHERE id = ?', [result.insertId]);
  const token = generateToken(user[0]);
  res.status(201).json({ message: 'Đăng ký thành công', token, user: user[0] });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
  }
  const users = await query('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }
  const user = users[0];
  if (!user.is_active) {
    return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }
  const token = generateToken(user);
  res.json({
    message: 'Đăng nhập thành công',
    token,
    user: { id: user.id, full_name: user.full_name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar },
  });
};

export const getMe = async (req, res) => {
  const users = await query(
    'SELECT id, full_name, email, phone, role, avatar, address, id_card, created_at FROM users WHERE id = ?',
    [req.user.id]
  );
  if (users.length === 0) {
    return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  }
  res.json({ user: users[0] });
};

export const updateMe = async (req, res) => {
  const { full_name, phone, avatar, address, id_card } = req.body;
  await query(
    'UPDATE users SET full_name = ?, phone = ?, avatar = ?, address = ?, id_card = ? WHERE id = ?',
    [full_name, phone, avatar, address, id_card, req.user.id]
  );
  const users = await query('SELECT id, full_name, email, phone, role, avatar, address, id_card FROM users WHERE id = ?', [req.user.id]);
  res.json({ message: 'Cập nhật thành công', user: users[0] });
};

export const changePassword = async (req, res) => {
  const { old_password, new_password } = req.body;
  if (!old_password || !new_password) {
    return res.status(400).json({ message: 'Vui lòng nhập mật khẩu cũ và mới' });
  }
  const users = await query('SELECT password FROM users WHERE id = ?', [req.user.id]);
  const match = await bcrypt.compare(old_password, users[0].password);
  if (!match) {
    return res.status(401).json({ message: 'Mật khẩu cũ không đúng' });
  }
  const hashed = await bcrypt.hash(new_password, parseInt(process.env.BCRYPT_ROUNDS || 10));
  await query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
  res.json({ message: 'Đổi mật khẩu thành công' });
};
