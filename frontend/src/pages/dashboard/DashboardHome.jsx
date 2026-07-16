import { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { CalendarCheck, DollarSign, BedDouble, Users, TrendingUp, Clock } from 'lucide-react';

export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await adminApi.dashboard();
        setData(data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="spinner" />;
  if (!data) return <div className="empty-state"><h3>Không tải được dữ liệu</h3></div>;

  const stats = [
    { label: 'Tổng doanh thu', value: Number(data.revenueStats.total_revenue || 0).toLocaleString('vi-VN') + '₫', icon: DollarSign, color: 'var(--success-500)', bg: 'var(--accent-100)' },
    { label: 'Doanh thu hôm nay', value: Number(data.revenueStats.today_revenue || 0).toLocaleString('vi-VN') + '₫', icon: TrendingUp, color: 'var(--primary-600)', bg: 'var(--primary-100)' },
    { label: 'Tổng đơn đặt', value: data.bookingStats.total_bookings || 0, icon: CalendarCheck, color: 'var(--secondary-600)', bg: 'var(--secondary-100)' },
    { label: 'Phòng trống', value: `${data.roomStats.available || 0}/${data.roomStats.total_rooms || 0}`, icon: BedDouble, color: 'var(--primary-600)', bg: 'var(--primary-50)' },
    { label: 'Đang lưu trú', value: data.bookingStats.checked_in || 0, icon: Clock, color: 'var(--success-600)', bg: 'var(--accent-100)' },
    { label: 'Tổng khách hàng', value: data.userStats.customers || 0, icon: Users, color: 'var(--neutral-700)', bg: 'var(--neutral-100)' },
  ];

  return (
    <div className="fade-in">
      <h2 className="mb-6">Tổng quan hệ thống</h2>
      <div className="grid grid-3">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}><s.icon size={22} /></div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <h3 className="mt-8 mb-4">Đơn đặt gần đây</h3>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Mã</th><th>Phòng</th><th>Khách</th><th>Ngày nhận</th><th>Ngày trả</th><th>Tổng</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {data.recentBookings.map((b) => (
              <tr key={b.id}>
                <td>#{b.id}</td>
                <td>{b.room_number}</td>
                <td>{b.customer_name}</td>
                <td>{new Date(b.check_in).toLocaleDateString('vi-VN')}</td>
                <td>{new Date(b.check_out).toLocaleDateString('vi-VN')}</td>
                <td>{Number(b.total_price).toLocaleString('vi-VN')}₫</td>
                <td><span className={`badge ${b.status === 'checked_in' ? 'badge-success' : b.status === 'pending' ? 'badge-warning' : b.status === 'cancelled' ? 'badge-error' : 'badge-info'}`}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-8 mb-4">Doanh thu theo tháng</h3>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Tháng</th><th>Doanh thu</th></tr></thead>
          <tbody>
            {data.monthlyRevenue.map((m, i) => (
              <tr key={i}><td>{m.month}</td><td>{Number(m.revenue).toLocaleString('vi-VN')}₫</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
