import { useEffect, useState } from 'react';
import { supportApi } from '../../api';
import { UserCheck, MessageSquare } from 'lucide-react';

export default function ManageSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const { data } = await supportApi.all(params);
      setTickets(data.tickets);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleUpdate = async (id, status) => {
    await supportApi.update(id, { status });
    fetch();
  };

  const handleAssign = async (id) => {
    await supportApi.assign(id);
    fetch();
  };

  const statusMap = { open: 'badge-warning', in_progress: 'badge-info', resolved: 'badge-success', closed: 'badge-neutral' };
  const priorityMap = { low: 'badge-neutral', medium: 'badge-info', high: 'badge-error' };

  return (
    <div className="fade-in">
      <h2 className="mb-6">Hỗ trợ khách hàng</h2>
      <div className="filter-bar">
        <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ flex: 1 }}>
          <option value="">Tất cả</option>
          <option value="open">Mở</option>
          <option value="in_progress">Đang xử lý</option>
          <option value="resolved">Đã giải quyết</option>
          <option value="closed">Đã đóng</option>
        </select>
        <button className="btn btn-primary" onClick={fetch}>Lọc</button>
      </div>

      {loading ? <div className="spinner" /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {tickets.map((t) => (
            <div key={t.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ fontSize: 18 }}>#{t.id} - {t.subject}</h3>
                  <p style={{ color: 'var(--neutral-500)', fontSize: 14, marginTop: 4 }}>Từ: {t.customer_name || 'Khách vãng lai'}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className={`badge ${priorityMap[t.priority]}`}>{t.priority}</span>
                  <span className={`badge ${statusMap[t.status]}`}>{t.status}</span>
                </div>
              </div>
              <p style={{ marginTop: 12, color: 'var(--neutral-700)' }}><MessageSquare size={14} /> {t.message}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {!t.assigned_to && <button className="btn btn-primary btn-sm" onClick={() => handleAssign(t.id)}><UserCheck size={14} /> Nhận hỗ trợ</button>}
                {t.status !== 'resolved' && <button className="btn btn-success btn-sm" onClick={() => handleUpdate(t.id, 'resolved')}>Đã giải quyết</button>}
                {t.status !== 'closed' && <button className="btn btn-secondary btn-sm" onClick={() => handleUpdate(t.id, 'closed')}>Đóng</button>}
              </div>
            </div>
          ))}
          {tickets.length === 0 && <div className="empty-state"><h3>Không có yêu cầu</h3></div>}
        </div>
      )}
    </div>
  );
}
