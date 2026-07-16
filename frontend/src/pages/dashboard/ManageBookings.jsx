import { useEffect, useState } from 'react';
import { bookingApi } from '../../api';
import { Search, LogIn, LogOut, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', search: '' });

  const fetch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.search) params.search = filter.search;
      const { data } = await bookingApi.all(params);
      setBookings(data.bookings);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === 'confirm') await bookingApi.updateStatus(id, { status: 'confirmed' });
      else if (action === 'checkin') await bookingApi.checkIn(id);
      else if (action === 'checkout') await bookingApi.checkOut(id);
      else if (action === 'cancel') await bookingApi.updateStatus(id, { status: 'cancelled' });
      fetch();
    } catch (err) { alert(err.response?.data?.message || 'Thất bại'); }
  };

  const statusMap = {
    pending: { label: 'Chờ xác nhận', class: 'badge-warning' },
    confirmed: { label: 'Đã xác nhận', class: 'badge-info' },
    checked_in: { label: 'Đang lưu trú', class: 'badge-success' },
    checked_out: { label: 'Đã trả phòng', class: 'badge-neutral' },
    cancelled: { label: 'Đã hủy', class: 'badge-error' },
  };

  return (
    <div className="fade-in">
      <h2 className="mb-6">Quản lý đặt phòng</h2>
      <div className="filter-bar">
        <input className="input" placeholder="Tìm theo phòng/khách..." value={filter.search} onChange={(e) => setFilter({ ...filter, search: e.target.value })} style={{ flex: 2 }} />
        <select className="select" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="checked_in">Đang lưu trú</option>
          <option value="checked_out">Đã trả phòng</option>
          <option value="cancelled">Đã hủy</option>
        </select>
        <button className="btn btn-primary" onClick={fetch}><Search size={16} /> Tìm</button>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Mã</th><th>Phòng</th><th>Khách</th><th>SDT</th><th>Nhận</th><th>Trả</th><th>Tổng</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
            <tbody>
              {bookings.map((b) => {
                const st = statusMap[b.status] || statusMap.pending;
                return (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td>{b.room_number}</td>
                    <td>{b.customer_name}</td>
                    <td>{b.customer_phone}</td>
                    <td>{new Date(b.check_in).toLocaleDateString('vi-VN')}</td>
                    <td>{new Date(b.check_out).toLocaleDateString('vi-VN')}</td>
                    <td>{Number(b.total_price).toLocaleString('vi-VN')}₫</td>
                    <td><span className={`badge ${st.class}`}>{st.label}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {b.status === 'pending' && <button className="btn btn-success btn-sm" onClick={() => handleAction(b.id, 'confirm')} title="Xác nhận"><CheckCircle size={14} /></button>}
                        {b.status === 'confirmed' && <button className="btn btn-primary btn-sm" onClick={() => handleAction(b.id, 'checkin')} title="Check-in"><LogIn size={14} /></button>}
                        {b.status === 'checked_in' && <button className="btn btn-secondary btn-sm" onClick={() => handleAction(b.id, 'checkout')} title="Check-out"><LogOut size={14} /></button>}
                        {(b.status === 'pending' || b.status === 'confirmed') && <button className="btn btn-danger btn-sm" onClick={() => handleAction(b.id, 'cancel')} title="Hủy"><XCircle size={14} /></button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {bookings.length === 0 && <div className="empty-state"><h3>Không có đơn nào</h3></div>}
        </div>
      )}
    </div>
  );
}
