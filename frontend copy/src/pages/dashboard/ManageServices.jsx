import { useEffect, useState } from 'react';
import { serviceApi } from '../../api';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', unit: '', category: '', is_active: true });

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await serviceApi.list();
      setServices(data.services);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await serviceApi.update(editing, form);
      else await serviceApi.create(form);
      setShowForm(false); setEditing(null);
      setForm({ name: '', description: '', price: '', unit: '', category: '', is_active: true });
      fetch();
    } catch (err) { alert(err.response?.data?.message || 'Thất bại'); }
  };

  const handleEdit = (svc) => {
    setEditing(svc.id);
    setForm({ name: svc.name, description: svc.description, price: svc.price, unit: svc.unit, category: svc.category, is_active: svc.is_active });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa dịch vụ này?')) return;
    try { await serviceApi.delete(id); fetch(); } catch (err) { alert('Xóa thất bại'); }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Quản lý dịch vụ</h2>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); setForm({ name: '', description: '', price: '', unit: '', category: '', is_active: true }); }}>
          <Plus size={16} /> Thêm dịch vụ
        </button>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Tên</th><th>Mô tả</th><th>Giá</th><th>Đơn vị</th><th>Danh mục</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.description?.slice(0, 50)}</td>
                  <td>{Number(s.price).toLocaleString('vi-VN')}₫</td>
                  <td>{s.unit}</td>
                  <td>{s.category}</td>
                  <td><span className={`badge ${s.is_active ? 'badge-success' : 'badge-error'}`}>{s.is_active ? 'Hoạt động' : 'Tắt'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(s)}><Edit size={14} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group"><label className="label">Tên dịch vụ</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="form-group"><label className="label">Mô tả</label><textarea className="textarea" rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="grid grid-2">
                  <div className="form-group"><label className="label">Giá (VNĐ)</label><input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Đơn vị</label><input className="input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="lần, người, kg..." /></div>
                  <div className="form-group"><label className="label">Danh mục</label><input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
                  <div className="form-group"><label className="label">Trạng thái</label><select className="select" value={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.value === 'true' })}><option value="true">Hoạt động</option><option value="false">Tắt</option></select></div>
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
