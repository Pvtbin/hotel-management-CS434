import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { roomApi, bookingApi, serviceApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { Users, Maximize, MapPin, Star, CheckCircle2, Plus, Minus } from 'lucide-react';

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    check_in: '', check_out: '', adults: 1, children: 0, special_requests: '', selectedServices: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: roomData }, { data: reviewData }, { data: svcData }] = await Promise.all([
          roomApi.get(id),
          roomApi.getReviews(id),
          serviceApi.list({ active: 'true' }),
        ]);
        setRoom(roomData.room);
        setReviews(reviewData.reviews);
        setServices(svcData.services);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const toggleService = (svc) => {
    const existing = booking.selectedServices.find((s) => s.service_id === svc.id);
    if (existing) {
      setBooking({ ...booking, selectedServices: booking.selectedServices.filter((s) => s.service_id !== svc.id) });
    } else {
      setBooking({ ...booking, selectedServices: [...booking.selectedServices, { service_id: svc.id, quantity: 1, price: svc.price }] });
    }
  };

  const updateServiceQty = (serviceId, delta) => {
    setBooking({
      ...booking,
      selectedServices: booking.selectedServices.map((s) =>
        s.service_id === serviceId ? { ...s, quantity: Math.max(1, s.quantity + delta) } : s
      ),
    });
  };

  const nights = booking.check_in && booking.check_out
    ? Math.ceil((new Date(booking.check_out) - new Date(booking.check_in)) / 86400000) : 0;
  const roomTotal = room ? Number(room.price_per_night) * nights : 0;
  const servicesTotal = booking.selectedServices.reduce((sum, s) => sum + s.price * s.quantity, 0);
  const grandTotal = roomTotal + servicesTotal;

  const handleBooking = async () => {
    setError(''); setSuccess('');
    if (!user) { navigate('/login'); return; }
    if (!booking.check_in || !booking.check_out) { setError('Vui lòng chọn ngày check-in và check-out'); return; }
    if (nights <= 0) { setError('Ngày check-out phải sau check-in'); return; }
    try {
      const { data } = await bookingApi.create({
        room_id: parseInt(id),
        check_in: booking.check_in,
        check_out: booking.check_out,
        adults: booking.adults,
        children: booking.children,
        services: booking.selectedServices.map((s) => ({ service_id: s.service_id, quantity: s.quantity })),
        special_requests: booking.special_requests,
      });
      setSuccess('Đặt phòng thành công! Đang chuyển đến trang thanh toán...');
      setTimeout(() => navigate(`/payment/${data.booking.id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Đặt phòng thất bại');
    }
  };

  if (loading) return <div className="spinner" />;
  if (!room) return <div className="empty-state"><h3>Không tìm thấy phòng</h3></div>;

  return (
    <div className="container page">
      <div className="room-detail">
        <div>
          <div className="room-detail-image">
            <img src={room.thumbnail || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'} alt={`Phòng ${room.room_number}`} />
          </div>
          <div className="mt-6">
            <h1>Phòng {room.room_number} - {room.room_type_name}</h1>
            <div className="room-detail-meta">
              <span><Users size={16} /> {room.capacity} người</span>
              <span><Maximize size={16} /> {room.area}m²</span>
              <span><MapPin size={16} /> Tầng {room.floor}</span>
              {room.avg_rating && (
                <span><Star size={16} fill="var(--secondary-500)" color="var(--secondary-500)" /> {Number(room.avg_rating).toFixed(1)} ({room.review_count} đánh giá)</span>
              )}
            </div>
            <p style={{ color: 'var(--neutral-600)', lineHeight: 1.6 }}>{room.description}</p>

            <h3 className="mt-6 mb-4">Tiện ích</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Wifi', 'TV', 'Điều hòa', 'Minibar', 'Tủ đồ', 'Phòng tắm riêng'].map((a) => (
                <span key={a} className="badge badge-neutral"><CheckCircle2 size={14} /> {a}</span>
              ))}
            </div>

            {services.length > 0 && (
              <>
                <h3 className="mt-6 mb-4">Dịch vụ thêm</h3>
                <div className="grid grid-2">
                  {services.map((svc) => {
                    const selected = booking.selectedServices.find((s) => s.service_id === svc.id);
                    return (
                      <div key={svc.id} className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{svc.name}</strong>
                          <p style={{ fontSize: 13, color: 'var(--neutral-500)' }}>{Number(svc.price).toLocaleString('vi-VN')}₫ / {svc.unit}</p>
                        </div>
                        {selected ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => updateServiceQty(svc.id, -1)}><Minus size={14} /></button>
                            <span>{selected.quantity}</span>
                            <button className="btn btn-secondary btn-sm" onClick={() => updateServiceQty(svc.id, 1)}><Plus size={14} /></button>
                          </div>
                        ) : (
                          <button className="btn btn-outline btn-sm" onClick={() => toggleService(svc)}>Thêm</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <h3 className="mt-6 mb-4">Đánh giá ({reviews.length})</h3>
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--neutral-500)' }}>Chưa có đánh giá</p>
            ) : (
              <div className="grid grid-2">
                {reviews.map((rv) => (
                  <div key={rv.id} className="card" style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <strong>{rv.full_name}</strong>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {Array.from({ length: rv.rating }).map((_, i) => (
                          <Star key={i} size={14} fill="var(--secondary-500)" color="var(--secondary-500)" />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--neutral-600)' }}>{rv.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="booking-sidebar">
          <h3>Đặt phòng</h3>
          <div className="booking-price">
            {Number(room.price_per_night).toLocaleString('vi-VN')}₫ <span style={{ fontSize: 14, color: 'var(--neutral-500)', fontWeight: 400 }}>/ đêm</span>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <div className="form-group">
            <label className="label">Ngày nhận phòng</label>
            <input className="input" type="date" value={booking.check_in} onChange={(e) => setBooking({ ...booking, check_in: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Ngày trả phòng</label>
            <input className="input" type="date" value={booking.check_out} onChange={(e) => setBooking({ ...booking, check_out: e.target.value })} />
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="label">Người lớn</label>
              <input className="input" type="number" min="1" value={booking.adults} onChange={(e) => setBooking({ ...booking, adults: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="label">Trẻ em</label>
              <input className="input" type="number" min="0" value={booking.children} onChange={(e) => setBooking({ ...booking, children: parseInt(e.target.value) })} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Yêu cầu đặc biệt</label>
            <textarea className="textarea" rows="2" value={booking.special_requests} onChange={(e) => setBooking({ ...booking, special_requests: e.target.value })} />
          </div>
          {nights > 0 && (
            <div style={{ borderTop: '1px solid var(--neutral-200)', paddingTop: 12, marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
                <span>{nights} đêm × {Number(room.price_per_night).toLocaleString('vi-VN')}₫</span>
                <span>{roomTotal.toLocaleString('vi-VN')}₫</span>
              </div>
              {servicesTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
                  <span>Dịch vụ</span><span>{servicesTotal.toLocaleString('vi-VN')}₫</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginTop: 8 }}>
                <span>Tổng</span><span style={{ color: 'var(--primary-600)' }}>{grandTotal.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
          )}
          <button className="btn btn-primary btn-lg mt-4" style={{ width: '100%' }} onClick={handleBooking}>
            Đặt phòng ngay
          </button>
        </div>
      </div>
    </div>
  );
}
