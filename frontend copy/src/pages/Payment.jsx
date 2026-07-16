import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingApi, paymentApi } from '../api';
import { CreditCard, Banknote, Smartphone, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [method, setMethod] = useState('online');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await bookingApi.get(bookingId);
        setBooking(data.booking);
      } catch (err) { setError('Không tải được thông tin đơn'); }
      setLoading(false);
    };
    fetch();
  }, [bookingId]);

  const handlePay = async () => {
    setProcessing(true);
    setError('');
    try {
      await paymentApi.pay({ booking_id: parseInt(bookingId), method });
      setSuccess(true);
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Thanh toán thất bại');
    }
    setProcessing(false);
  };

  if (loading) return <div className="spinner" />;
  if (!booking) return <div className="empty-state"><h3>Không tìm thấy đơn</h3></div>;

  const methods = [
    { id: 'online', label: 'Thanh toán online', icon: Smartphone, desc: 'MoMo, ZaloPay, VNPay' },
    { id: 'card', label: 'Thẻ tín dụng', icon: CreditCard, desc: 'Visa, Mastercard, JCB' },
    { id: 'transfer', label: 'Chuyển khoản', icon: Banknote, desc: 'Banking trong nước' },
    { id: 'cash', label: 'Tiền mặt', icon: Banknote, desc: 'Thanh toán tại khách sạn' },
  ];

  return (
    <div className="container page">
      <button className="btn btn-outline btn-sm mb-4" onClick={() => navigate('/my-bookings')}>
        <ArrowLeft size={16} /> Quay lại
      </button>
      <h1 className="page-title">Thanh toán</h1>

      {success ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <CheckCircle2 size={64} color="var(--success-500)" style={{ margin: '0 auto 16px' }} />
          <h2>Thanh toán thành công!</h2>
          <p style={{ color: 'var(--neutral-500)' }}>Đang chuyển về lịch sử đặt phòng...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
          <div>
            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
              <h3 className="mb-4">Chi tiết đơn</h3>
              <div style={{ display: 'flex', gap: 16 }}>
                <img src={booking.thumbnail || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'} alt="" style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <div>
                  <h4>Phòng {booking.room_number} - {booking.room_type_name}</h4>
                  <p style={{ fontSize: 14, color: 'var(--neutral-500)' }}>
                    {new Date(booking.check_in).toLocaleDateString('vi-VN')} → {new Date(booking.check_out).toLocaleDateString('vi-VN')} ({booking.total_nights} đêm)
                  </p>
                  <p style={{ fontSize: 14, color: 'var(--neutral-500)' }}>{booking.adults} người lớn{booking.children ? `, ${booking.children} trẻ em` : ''}</p>
                </div>
              </div>
              {booking.services?.length > 0 && (
                <div className="mt-4">
                  <h4 style={{ fontSize: 14, marginBottom: 8 }}>Dịch vụ:</h4>
                  {booking.services.map((s) => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '4px 0' }}>
                      <span>{s.service_name} × {s.quantity}</span>
                      <span>{Number(s.price * s.quantity).toLocaleString('vi-VN')}₫</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 className="mb-4">Phương thức thanh toán</h3>
              <div className="grid grid-2">
                {methods.map((m) => (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    style={{
                      padding: 16, borderRadius: 'var(--radius-md)', border: method === m.id ? '2px solid var(--primary-600)' : '2px solid var(--neutral-200)',
                      background: method === m.id ? 'var(--primary-50)' : 'white', textAlign: 'left', transition: 'all 0.2s',
                    }}>
                    <m.icon size={24} color={method === m.id ? 'var(--primary-600)' : 'var(--neutral-400)'} />
                    <div style={{ fontWeight: 600, marginTop: 8, fontSize: 14 }}>{m.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--neutral-500)' }}>{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 24, height: 'fit-content', position: 'sticky', top: 90 }}>
            <h3 className="mb-4">Tổng thanh toán</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
              <span>Tiền phòng ({booking.total_nights} đêm)</span>
              <span>{Number(booking.room_price * booking.total_nights).toLocaleString('vi-VN')}₫</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
              <span>Dịch vụ</span>
              <span>{Number(booking.services_price).toLocaleString('vi-VN')}₫</span>
            </div>
            <div style={{ borderTop: '1px solid var(--neutral-200)', marginTop: 12, paddingTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 20 }}>
                <span>Tổng</span>
                <span style={{ color: 'var(--primary-600)' }}>{Number(booking.total_price).toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
            {error && <div className="alert alert-error mt-4">{error}</div>}
            <button className="btn btn-primary btn-lg mt-4" style={{ width: '100%' }} onClick={handlePay} disabled={processing}>
              {processing ? 'Đang xử lý...' : `Thanh toán ${Number(booking.total_price).toLocaleString('vi-VN')}₫`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
