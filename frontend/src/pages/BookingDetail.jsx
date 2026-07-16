import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { bookingApi } from '../api';
import { Calendar, Clock, Users, CreditCard, ArrowLeft } from 'lucide-react';

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await bookingApi.get(id);
        setBooking(data.booking);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (!booking) return <div className="empty-state"><h3>Không tìm thấy đơn</h3></div>;

  const statusMap = {
    pending: { label: 'Chờ xác nhận', class: 'badge-warning' },
    confirmed: { label: 'Đã xác nhận', class: 'badge-info' },
    checked_in: { label: 'Đang lưu trú', class: 'badge-success' },
    checked_out: { label: 'Đã trả phòng', class: 'badge-neutral' },
    cancelled: { label: 'Đã hủy', class: 'badge-error' },
  };
  const status = statusMap[booking.status] || statusMap.pending;

  return (
    <div className="container page">
      <button className="btn btn-outline btn-sm mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Quay lại
      </button>
      <h1 className="page-title">Chi tiết đơn đặt phòng #{booking.id}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="mb-4">Thông tin phòng</h3>
          <img src={booking.thumbnail || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'} alt="" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 16 }} />
          <h4>Phòng {booking.room_number} - {booking.room_type_name}</h4>
          <p style={{ color: 'var(--neutral-500)', marginTop: 4 }}>Diện tích: {booking.area}m² | Sức chứa: {booking.capacity} người</p>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 className="mb-4">Thông tin đặt phòng</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Khách hàng</span>
              <strong>{booking.full_name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Số điện thoại</span>
              <span>{booking.phone}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Ngày nhận</span>
              <span><Calendar size={14} /> {new Date(booking.check_in).toLocaleDateString('vi-VN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Ngày trả</span>
              <span><Calendar size={14} /> {new Date(booking.check_out).toLocaleDateString('vi-VN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Số đêm</span>
              <span><Clock size={14} /> {booking.total_nights} đêm</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Số khách</span>
              <span><Users size={14} /> {booking.adults} người lớn{booking.children ? `, ${booking.children} trẻ em` : ''}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Trạng thái</span>
              <span className={`badge ${status.class}`}>{status.label}</span>
            </div>
            {booking.special_requests && (
              <div>
                <span style={{ color: 'var(--neutral-500)' }}>Yêu cầu đặc biệt:</span>
                <p style={{ marginTop: 4 }}>{booking.special_requests}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card mt-6" style={{ padding: 24 }}>
        <h3 className="mb-4">Chi tiết thanh toán</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>Tiền phòng: {Number(booking.room_price).toLocaleString('vi-VN')}₫ × {booking.total_nights} đêm</span>
          <span>{Number(booking.room_price * booking.total_nights).toLocaleString('vi-VN')}₫</span>
        </div>
        {booking.services?.map((s) => (
          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
            <span>{s.service_name} × {s.quantity}</span>
            <span>{Number(s.price * s.quantity).toLocaleString('vi-VN')}₫</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--neutral-200)', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
          <span>Tổng cộng</span>
          <span style={{ color: 'var(--primary-600)' }}>{Number(booking.total_price).toLocaleString('vi-VN')}₫</span>
        </div>
        {booking.payment_status && (
          <div className="mt-4">
            <span className={`badge ${booking.payment_status === 'paid' ? 'badge-success' : booking.payment_status === 'refunded' ? 'badge-error' : 'badge-warning'}`}>
              <CreditCard size={14} /> {booking.payment_status === 'paid' ? 'Đã thanh toán' : booking.payment_status === 'refunded' ? 'Đã hoàn tiền' : 'Chưa thanh toán'}
            </span>
          </div>
        )}
      </div>

      {booking.status === 'pending' && (
        <Link to={`/payment/${booking.id}`} className="btn btn-primary mt-4"><CreditCard size={16} /> Thanh toán ngay</Link>
      )}
    </div>
  );
}
