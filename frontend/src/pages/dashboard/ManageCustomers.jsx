import { useEffect, useState } from 'react';
import { userApi } from '../../api';
import { Search, UserCheck, UserX, Eye } from 'lucide-react';

export default function ManageCustomers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await userApi.list({ role: 'customer', search });
      setUsers(data.users);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div className="fade-in">
      <h2 className="mb-6">Quản lý khách hàng</h2>
      <div className="filter-bar">
        <input className="input" placeholder="Tìm theo tên/email..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 2 }} />
        <button className="btn btn-primary" onClick={fetch}><Search size={16} /> Tìm</button>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Họ tên</th><th>Email</th><th>Điện thoại</th><th>Ngày đăng ký</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.full_name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || '-'}</td>
                  <td>{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                  <td><span className={`badge ${u.is_active ? 'badge-success' : 'badge-error'}`}>{u.is_active ? 'Hoạt động' : 'Khóa'}</span></td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={async () => { await userApi.toggleActive(u.id); fetch(); }}>
                      {u.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                      {u.is_active ? ' Khóa' : ' Mở'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div className="empty-state"><h3>Không có khách hàng</h3></div>}
        </div>
      )}
    </div>
  );
}
