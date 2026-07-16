import { useEffect, useState } from 'react';
import { paymentApi } from '../../api';
import { DollarSign, RotateCcw } from 'lucide-react';

export default function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await paymentApi.all();
      setPayments(data.payments);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleRefund = async (id) => {
    if (!confirm('Hoàn tiền cho đơn này?')) return;
    try { await paymentApi.refund(id); fetch(); } catch (err) { alert('Hoàn tiền thất bại'); }
  };

  const statusMap = { pending: 'badge-warning', paid: 'badge-success', refunded: 'badge-error', failed: 'badge-error' };
  const methodMap = { cash: 'Tiền mặt', card: 'Thẻ', transfer: 'Chuyển khoản', online: 'Online' };

  return (
    <div className="fade-in">
      <h2 className="mb-6">Quản lý thanh toán</h2>
      {loading ? <div className="spinner" /> : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Mã đơn</th><th>Phòng</th><th>Khách</th><th>Số tiền</th><th>Phương thức</th><th>Trạng thái</th><th>Ngày</th><th>Hành động</th></tr></thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>#{p.booking_id}</td>
                  <td>{p.room_number}</td>
                  <td>{p.customer_name}</td>
                  <td>{Number(p.amount).toLocaleString('vi-VN')}₫</td>
                  <td>{methodMap[p.method] || p.method}</td>
                  <td><span className={`badge ${statusMap[p.status]}`}>{p.status}</span></td>
                  <td>{new Date(p.paid_at || p.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>{p.status === 'paid' && <button className="btn btn-danger btn-sm" onClick={() => handleRefund(p.id)}><RotateCcw size={14} /> Hoàn tiền</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && <div className="empty-state"><DollarSign size={40} /><h3>Chưa có thanh toán</h3></div>}
        </div>
      )}
    </div>
  );
}
