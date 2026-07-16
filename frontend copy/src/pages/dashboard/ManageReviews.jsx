import { useEffect, useState } from 'react';
import { reviewApi } from '../../api';
import { Star, Trash2 } from 'lucide-react';

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await reviewApi.all();
      setReviews(data.reviews);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Xóa đánh giá này?')) return;
    try { await reviewApi.delete(id); fetch(); } catch (err) { alert('Xóa thất bại'); }
  };

  return (
    <div className="fade-in">
      <h2 className="mb-6">Quản lý đánh giá</h2>
      {loading ? <div className="spinner" /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reviews.map((rv) => (
            <div key={rv.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <strong>{rv.full_name}</strong>
                    <span style={{ fontSize: 13, color: 'var(--neutral-500)' }}>Phòng {rv.room_number}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                    {Array.from({ length: rv.rating }).map((_, i) => <Star key={i} size={16} fill="var(--secondary-500)" color="var(--secondary-500)" />)}
                  </div>
                  <p style={{ color: 'var(--neutral-600)' }}>{rv.comment}</p>
                  <p style={{ fontSize: 12, color: 'var(--neutral-400)', marginTop: 8 }}>{new Date(rv.created_at).toLocaleString('vi-VN')}</p>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(rv.id)}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && <div className="empty-state"><Star size={40} /><h3>Chưa có đánh giá</h3></div>}
        </div>
      )}
    </div>
  );
}
