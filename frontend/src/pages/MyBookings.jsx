import { useState, useEffect } from 'react';
import { bookingApi, reviewApi } from '../api';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, X, CreditCard, Star, MessageSquare } from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', cleanliness: 5, service: 5, location: 5 });
  const [reviewMsg, setReviewMsg] = useState('');

  const fetchBookings = async () => {
    try {
      const { data } = await bookingApi.myBookings();
      setBookings(data.bookings);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Hủy đơn đặt phòng này?')) return;
    try {
      await bookingApi.cancel(id);
      fetchBookings();
    } catch (err) { alert(err.response?.data?.message || 'Hủy thất bại'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    try {
      await reviewApi.create({
        booking_id: showReview.id,
        room_id: showReview.room_id,
        ...reviewForm,
      });
      setReviewMsg('Đánh giá thành công!');
      setTimeout(() => { setShowReview(null); setReviewMsg(''); setReviewForm({ rating: 5, comment: '', cleanliness: 5, service: 5, location: 5 }); }, 1500);
    } catch (err) { setReviewMsg(err.response?.data?.message || 'Đánh giá thất bại'); }
  };

  const statusMap = {
    pending: { label: 'Chờ xác nhận', class: 'badge-warning' },
    confirmed: { label: 'Đã xác nhận', class: 'badge-info' },
    checked_in: { label: 'Đang lưu trú', class: 'badge-success' },
    checked_out: { label: 'Đã trả phòng', class: 'badge-neutral' },
    cancelled: { label: 'Đã hủy', class: 'badge-error' },
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container page">
      <h1 className="page-title">Lịch sử đặt phòng</h1>
      {bookings.length === 0 ? (
        <div className="empty-state">
          <h3>Chưa có đơn đặt phòng</h3>
          <p>Khám phá và đặt phòng ngay hôm nay</p>
          <Link to="/rooms" className="btn btn-primary mt-4">Xem phòng</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {bookings.map((b) => {
            const status = statusMap[b.status] || statusMap.pending;
            return (
              <div key={b.id} className="card fade-in" style={{ display: 'flex', gap: 16, padding: 16 }}>
                <img src={b.thumbnail || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'} alt="" style={{ width: 120, height: 100, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h3 style={{ fontSize: 18 }}>Phòng {b.room_number} - {b.room_type_name}</h3>
                      <div style={{ display: 'flex', gap: 16, marginTop: 4, fontSize: 14, color: 'var(--neutral-500)' }}>
                        <span><Calendar size={14} /> {new Date(b.check_in).toLocaleDateString('vi-VN')} → {new Date(b.check_out).toLocaleDateString('vi-VN')}</span>
                        <span><Clock size={14} /> {b.total_nights} đêm</span>
                        <span><Users size={14} /> {b.adults} người lớn{b.children ? `, ${b.children} trẻ em` : ''}</span>
                      </div>
                    </div>
                    <span className={`badge ${status.class}`}>{status.label}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <div>
                      <strong style={{ fontSize: 18, color: 'var(--primary-600)' }}>{Number(b.total_price).toLocaleString('vi-VN')}₫</strong>
                      <span style={{ fontSize: 13, color: 'var(--neutral-500)' }}> (Phòng: {Number(b.room_price).toLocaleString('vi-VN')}₫ + Dịch vụ: {Number(b.services_price).toLocaleString('vi-VN')}₫)</span>
                      {b.payment_status && (
                        <div className="mt-2">
                          <span className={`badge ${b.payment_status === 'paid' ? 'badge-success' : b.payment_status === 'refunded' ? 'badge-error' : 'badge-warning'}`}>
                            {b.payment_status === 'paid' ? 'Đã thanh toán' : b.payment_status === 'refunded' ? 'Đã hoàn tiền' : 'Chưa thanh toán'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {b.status === 'pending' && (
                        <>
                          <Link to={`/payment/${b.id}`} className="btn btn-primary btn-sm"><CreditCard size={14} /> Thanh toán</Link>
                          <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}><X size={14} /> Hủy</button>
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}><X size={14} /> Hủy</button>
                      )}
                      {b.status === 'checked_out' && (
                        <button className="btn btn-outline btn-sm" onClick={() => setShowReview(b)}><Star size={14} /> Đánh giá</button>
                      )}
                      <Link to={`/bookings/${b.id}`} className="btn btn-secondary btn-sm">Chi tiết</Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showReview && (
        <div className="modal-overlay" onClick={() => setShowReview(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Đánh giá phòng {showReview.room_number}</h3>
              <button onClick={() => setShowReview(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleReview}>
              <div className="modal-body">
                {reviewMsg && <div className="alert alert-success">{reviewMsg}</div>}
                <div className="form-group">
                  <label className="label">Đánh giá tổng thể</label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: n })}>
                        <Star size={28} fill={n <= reviewForm.rating ? 'var(--secondary-500)' : 'none'} color="var(--secondary-500)" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-3 mt-4">
                  <div className="form-group">
                    <label className="label">Vệ sinh</label>
                    <input className="input" type="number" min="1" max="5" value={reviewForm.cleanliness} onChange={(e) => setReviewForm({ ...reviewForm, cleanliness: parseInt(e.target.value) })} />
                  </div>
                  <div className="form-group">
                    <label className="label">Dịch vụ</label>
                    <input className="input" type="number" min="1" max="5" value={reviewForm.service} onChange={(e) => setReviewForm({ ...reviewForm, service: parseInt(e.target.value) })} />
                  </div>
                  <div className="form-group">
                    <label className="label">Vị trí</label>
                    <input className="input" type="number" min="1" max="5" value={reviewForm.location} onChange={(e) => setReviewForm({ ...reviewForm, location: parseInt(e.target.value) })} />
                  </div>
                </div>
                <div className="form-group mt-4">
                  <label className="label">Bình luận</label>
                  <textarea className="textarea" rows="4" value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Chia sẻ trải nghiệm của bạn..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReview(null)}>Hủy</button>
                <button type="submit" className="btn btn-primary"><MessageSquare size={16} /> Gửi đánh giá</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
