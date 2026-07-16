import { useEffect, useState } from 'react';
import { roomApi } from '../../api';
import { Plus, Edit, Trash2, X, BedDouble } from 'lucide-react';

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ room_number: '', room_type_id: '', floor: 1, price_per_night: '', capacity: 2, area: '', description: '', thumbnail: '', status: 'available' });

  const fetch = async () => {
    setLoading(true);
    try {
      const [{ data: roomData }, { data: typeData }] = await Promise.all([roomApi.list({ limit: 100 }), roomApi.getTypes()]);
      setRooms(roomData.rooms);
      setTypes(typeData.room_types);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await roomApi.update(editing, form);
      else await roomApi.create(form);
      setShowForm(false); setEditing(null);
      setForm({ room_number: '', room_type_id: '', floor: 1, price_per_night: '', capacity: 2, area: '', description: '', thumbnail: '', status: 'available' });
      fetch();
    } catch (err) { alert(err.response?.data?.message || 'Thất bại'); }
  };

  const handleEdit = (room) => {
    setEditing(room.id);
    setForm({ room_number: room.room_number, room_type_id: room.room_type_id, floor: room.floor, price_per_night: room.price_per_night, capacity: room.capacity, area: room.area, description: room.description, thumbnail: room.thumbnail, status: room.status });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa phòng này?')) return;
    try { await roomApi.delete(id); fetch(); } catch (err) { alert(err.response?.data?.message || 'Xóa thất bại'); }
  };

  const statusMap = { available: 'badge-success', booked: 'badge-warning', occupied: 'badge-info', maintenance: 'badge-error' };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Quản lý phòng</h2>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); setForm({ room_number: '', room_type_id: '', floor: 1, price_per_night: '', capacity: 2, area: '', description: '', thumbnail: '', status: 'available' }); }}>
          <Plus size={16} /> Thêm phòng
        </button>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Mã</th><th>Số phòng</th><th>Loại</th><th>Tầng</th><th>Giá/đêm</th><th>Sức chứa</th><th>Diện tích</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.room_number}</td>
                  <td>{r.room_type_name}</td>
                  <td>{r.floor}</td>
                  <td>{Number(r.price_per_night).toLocaleString('vi-VN')}₫</td>
                  <td>{r.capacity}</td>
                  <td>{r.area}m²</td>
                  <td><span className={`badge ${statusMap[r.status]}`}>{r.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(r)}><Edit size={14} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rooms.length === 0 && <div className="empty-state"><BedDouble size={40} /><h3>Chưa có phòng</h3></div>}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h3>{editing ? 'Sửa phòng' : 'Thêm phòng mới'}</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="label">Số phòng</label>
                    <input className="input" value={form.room_number} onChange={(e) => setForm({ ...form, room_number: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="label">Loại phòng</label>
                    <select className="select" value={form.room_type_id} onChange={(e) => setForm({ ...form, room_type_id: e.target.value })} required>
                      <option value="">Chọn loại</option>
                      {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Tầng</label>
                    <input className="input" type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: parseInt(e.target.value) })} />
                  </div>
                  <div className="form-group">
                    <label className="label">Giá/đêm (VNĐ)</label>
                    <input className="input" type="number" value={form.price_per_night} onChange={(e) => setForm({ ...form, price_per_night: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="label">Sức chứa</label>
                    <input className="input" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) })} />
                  </div>
                  <div className="form-group">
                    <label className="label">Diện tích (m²)</label>
                    <input className="input" type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="label">Trạng thái</label>
                    <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="available">Còn phòng</option>
                      <option value="booked">Đã đặt</option>
                      <option value="occupied">Đang ở</option>
                      <option value="maintenance">Bảo trì</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="label">Ảnh (URL)</label>
                    <input className="input" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://..." />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="label">Mô tả</label>
                    <textarea className="textarea" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
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
