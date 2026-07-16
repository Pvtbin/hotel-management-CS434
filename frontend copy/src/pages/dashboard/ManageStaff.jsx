import { useEffect, useState } from 'react';
import { userApi } from '../../api';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';

export default function ManageStaff() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', role: 'staff', is_active: true });

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await userApi.list({ role: 'staff', search });
      setUsers(data.users);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (editing && !payload.password) delete payload.password;
      if (editing) await userApi.update(editing, payload);
      else await userApi.create(payload);
      setShowForm(false); setEditing(null);
      setForm({ full_name: '', email: '', phone: '', password: '', role: 'staff', is_active: true });
      fetch();
    } catch (err) { alert(err.response?.data?.message || 'Thất bại'); }
  };

  const handleEdit = (u) => {
    setEditing(u.id);
    setForm({ full_name: u.full_name, email: u.email, phone: u.phone || '', password: '', role: u.role, is_active: u.is_active });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa nhân viên này?')) return;
    try { await userApi.delete(id); fetch(); } catch (err) { alert('Xóa thất bại'); }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Quản lý nhân viên</h2>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); setForm({ full_name: '', email: '', phone: '', password: '', role: 'staff', is_active: true }); }}>
          <Plus size={16} /> Thêm nhân viên
        </button>
      </div>

      <div className="filter-bar">
        <input className="input" placeholder="Tìm nhân viên..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 2 }} />
        <button className="btn btn-primary" onClick={fetch}><Search size={16} /> Tìm</button>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Họ tên</th><th>Email</th><th>Điện thoại</th><th>Vai trò</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.full_name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || '-'}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-error' : 'badge-info'}`}>{u.role === 'admin' ? 'Quản trị' : 'Nhân viên'}</span></td>
                  <td><span className={`badge ${u.is_active ? 'badge-success' : 'badge-error'}`}>{u.is_active ? 'Hoạt động' : 'Khóa'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(u)}><Edit size={14} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div className="empty-state"><h3>Chưa có nhân viên</h3></div>}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Sửa nhân viên' : 'Thêm nhân viên'}</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group"><label className="label">Họ tên</label><input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></div>
                <div className="form-group"><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
                <div className="form-group"><label className="label">Điện thoại</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="form-group"><label className="label">{editing ? 'Mật khẩu mới' : 'Mật khẩu'}</label><input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editing} /></div>
                <div className="form-group"><label className="label">Vai trò</label>
                  <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="staff">Nhân viên</option><option value="admin">Quản trị</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Cập nhật' : 'Tạo mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
