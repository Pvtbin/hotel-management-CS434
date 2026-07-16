import { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { BarChart3, DollarSign, Users, BedDouble } from 'lucide-react';

export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const params = type ? { type } : {};
      const { data } = await adminApi.reports(params);
      setReport(data.report);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [type]);

  return (
    <div className="fade-in">
      <h2 className="mb-6">Báo cáo thống kê</h2>

      <div className="filter-bar">
        <select className="select" value={type} onChange={(e) => setType(e.target.value)} style={{ flex: 1 }}>
          <option value="">Tất cả báo cáo</option>
          <option value="revenue">Doanh thu</option>
          <option value="rooms">Phòng</option>
          <option value="customers">Khách hàng</option>
        </select>
      </div>

      {loading ? <div className="spinner" /> : report && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {report.revenue && (
            <div>
              <h3 className="mb-4"><DollarSign size={20} /> Báo cáo doanh thu</h3>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Ngày</th><th>Số đơn</th><th>Doanh thu</th></tr></thead>
                  <tbody>
                    {report.revenue.map((r, i) => (
                      <tr key={i}><td>{new Date(r.date).toLocaleDateString('vi-VN')}</td><td>{r.bookings}</td><td>{Number(r.revenue).toLocaleString('vi-VN')}₫</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {report.rooms && (
            <div>
              <h3 className="mb-4"><BedDouble size={20} /> Báo cáo phòng</h3>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Phòng</th><th>Loại</th><th>Số lượt đặt</th><th>Doanh thu</th></tr></thead>
                  <tbody>
                    {report.rooms.map((r, i) => (
                      <tr key={i}><td>{r.room_number}</td><td>{r.room_type}</td><td>{r.bookings}</td><td>{Number(r.revenue).toLocaleString('vi-VN')}₫</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {report.customers && (
            <div>
              <h3 className="mb-4"><Users size={20} /> Báo cáo khách hàng</h3>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Khách hàng</th><th>Email</th><th>Số lượt đặt</th><th>Tổng chi tiêu</th></tr></thead>
                  <tbody>
                    {report.customers.map((c, i) => (
                      <tr key={i}><td>{c.full_name}</td><td>{c.email}</td><td>{c.bookings}</td><td>{Number(c.total_spent).toLocaleString('vi-VN')}₫</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
