import { useEffect, useState } from 'react';
import { bookingApi } from '../../api';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

export default function RevenueStats() {
  const [stats, setStats] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start_date: '', end_date: '' });

  const fetch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateRange.start_date) params.start_date = dateRange.start_date;
      if (dateRange.end_date) params.end_date = dateRange.end_date;
      const { data } = await bookingApi.revenue(params);
      setStats(data.stats);
      setSummary(data.summary);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const maxRevenue = Math.max(...stats.map((s) => Number(s.revenue || 0)), 1);

  return (
    <div className="fade-in">
      <h2 className="mb-6">Thống kê doanh thu</h2>

      {summary && (
        <div className="grid grid-4 mb-6">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--accent-100)', color: 'var(--success-500)' }}><DollarSign size={22} /></div>
            <div className="stat-label">Tổng doanh thu</div>
            <div className="stat-value">{Number(summary.total_revenue || 0).toLocaleString('vi-VN')}₫</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-100)', color: 'var(--primary-600)' }}><Calendar size={22} /></div>
            <div className="stat-label">Tổng đơn</div>
            <div className="stat-value">{summary.total_bookings || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--secondary-100)', color: 'var(--secondary-600)' }}><TrendingUp size={22} /></div>
            <div className="stat-label">Đang lưu trú</div>
            <div className="stat-value">{summary.active_checkins || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--neutral-100)', color: 'var(--neutral-600)' }}><Calendar size={22} /></div>
            <div className="stat-label">Chờ xác nhận</div>
            <div className="stat-value">{summary.pending_count || 0}</div>
          </div>
        </div>
      )}

      <div className="filter-bar">
        <div className="filter-field"><label className="label">Từ ngày</label><input className="input" type="date" value={dateRange.start_date} onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })} /></div>
        <div className="filter-field"><label className="label">Đến ngày</label><input className="input" type="date" value={dateRange.end_date} onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })} /></div>
        <button className="btn btn-primary" onClick={fetch}>Lọc</button>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="card" style={{ padding: 24 }}>
          <h3 className="mb-4">Doanh thu theo ngày</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stats.slice(0, 20).map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ width: 100, fontSize: 13, color: 'var(--neutral-500)' }}>{new Date(s.date).toLocaleDateString('vi-VN')}</span>
                <div style={{ flex: 1, height: 24, background: 'var(--neutral-100)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <div style={{ width: `${(Number(s.revenue || 0) / maxRevenue) * 100}%`, height: '100%', background: 'var(--primary-600)', borderRadius: 'var(--radius-sm)', transition: 'width 0.5s' }} />
                </div>
                <span style={{ width: 120, textAlign: 'right', fontSize: 13, fontWeight: 600 }}>{Number(s.revenue || 0).toLocaleString('vi-VN')}₫</span>
                <span style={{ width: 60, fontSize: 12, color: 'var(--neutral-500)' }}>{s.bookings} đơn</span>
              </div>
            ))}
          </div>
          {stats.length === 0 && <div className="empty-state"><h3>Không có dữ liệu</h3></div>}
        </div>
      )}
    </div>
  );
}
