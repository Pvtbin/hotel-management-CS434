import { query } from '../config/database.js';

export const getServices = async (req, res) => {
  const { category, active } = req.query;
  let sql = 'SELECT * FROM services WHERE 1=1';
  const params = [];
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (active !== undefined) { sql += ' AND is_active = ?'; params.push(active === 'true'); }
  sql += ' ORDER BY created_at DESC';
  const services = await query(sql, params);
  res.json({ services });
};

export const createService = async (req, res) => {
  const { name, description, price, unit, category } = req.body;
  if (!name || !price) return res.status(400).json({ message: 'Vui lòng nhập tên và giá dịch vụ' });
  const result = await query(
    'INSERT INTO services (name, description, price, unit, category) VALUES (?, ?, ?, ?, ?)',
    [name, description, price, unit, category]
  );
  res.status(201).json({ message: 'Tạo dịch vụ thành công', id: result.insertId });
};

export const updateService = async (req, res) => {
  const { name, description, price, unit, category, is_active } = req.body;
  await query(
    'UPDATE services SET name=?, description=?, price=?, unit=?, category=?, is_active=? WHERE id=?',
    [name, description, price, unit, category, is_active !== undefined ? is_active : true, req.params.id]
  );
  res.json({ message: 'Cập nhật dịch vụ thành công' });
};

export const deleteService = async (req, res) => {
  await query('DELETE FROM services WHERE id = ?', [req.params.id]);
  res.json({ message: 'Xóa dịch vụ thành công' });
};
