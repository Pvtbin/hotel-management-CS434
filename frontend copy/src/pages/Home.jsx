import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, Star, Wifi, Car, Coffee, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ check_in: '', check_out: '', guests: 1 });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.check_in) params.append('check_in', search.check_in);
    if (search.check_out) params.append('check_out', search.check_out);
    if (search.guests) params.append('capacity', search.guests);
    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <div>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content fade-in">
          <h1>Trải nghiệm kỳ nghỉ đẳng cấp 5 sao</h1>
          <p>Đặt phòng trực tuyến nhanh chóng, dễ dàng với Grand Hotel - Hệ thống quản lý và đặt phòng khách sạn trực tuyến</p>
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-field">
              <label>Ngày nhận phòng</label>
              <input type="date" value={search.check_in} onChange={(e) => setSearch({ ...search, check_in: e.target.value })} />
            </div>
            <div className="hero-search-field">
              <label>Ngày trả phòng</label>
              <input type="date" value={search.check_out} onChange={(e) => setSearch({ ...search, check_out: e.target.value })} />
            </div>
            <div className="hero-search-field">
              <label>Số khách</label>
              <input type="number" min="1" value={search.guests} onChange={(e) => setSearch({ ...search, guests: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">
              <Search size={18} /> Tìm phòng
            </button>
          </form>
        </div>
      </section>

      <section className="section container">
        <div className="section-header">
          <h2>Tại sao chọn Grand Hotel?</h2>
          <p>Chúng tôi mang đến trải nghiệm lưu trú tuyệt vời nhất</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Wifi size={24} /></div>
            <h3>Wifi miễn phí</h3>
            <p>Internet tốc độ cao trong toàn bộ khách sạn</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Car size={24} /></div>
            <h3>Đỗ xe miễn phí</h3>
            <p>Bãi đỗ xe rộng rãi, an toàn 24/7</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Coffee size={24} /></div>
            <h3>Nhà hàng 5 sao</h3>
            <p>Buffet sáng và thực đơn đa dạng</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Dumbbell size={24} /></div>
            <h3>Phòng gym</h3>
            <p>Trang thiết bị hiện đại, miễn phí</p>
          </div>
        </div>
      </section>

      <section className="section container" style={{ background: 'var(--neutral-50)' }}>
        <div className="section-header">
          <h2>Phòng nổi bật</h2>
          <p>Khám phá các hạng phòng cao cấp của chúng tôi</p>
        </div>
        <div className="grid grid-3">
          {[
            { name: 'Standard', price: '500.000', img: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', desc: 'Tiện nghi, thoải mái' },
            { name: 'Deluxe', price: '900.000', img: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg', desc: 'View biển tuyệt đẹp' },
            { name: 'Suite', price: '2.000.000', img: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg', desc: 'Sang trọng, rộng rãi' },
          ].map((room) => (
            <div key={room.name} className="room-card">
              <Link to="/rooms" className="room-card-image">
                <img src={room.img} alt={room.name} />
              </Link>
              <div className="room-card-body">
                <div className="room-card-header">
                  <h3>{room.name}</h3>
                </div>
                <p className="room-desc">{room.desc}</p>
                <div className="room-card-footer">
                  <div className="room-price">
                    <span className="price">{room.price}₫</span>
                    <span className="price-unit">/ đêm</span>
                  </div>
                  <Link to="/rooms" className="btn btn-outline btn-sm">Xem</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-header">
          <h2>Đánh giá khách hàng</h2>
          <p>Những phản hồi chân thực từ khách hàng của chúng tôi</p>
        </div>
        <div className="grid grid-3">
          {[
            { name: 'Nguyễn Văn An', rating: 5, text: 'Dịch vụ tuyệt vời, phòng sạch sẽ. Sẽ quay lại!' },
            { name: 'Trần Thị Bình', rating: 5, text: 'View biển đẹp, nhân viên nhiệt tình. Rất hài lòng.' },
            { name: 'Lê Hoàng Cường', rating: 4, text: 'Phòng rộng, tiện nghi. Buffet ngon nhưng hơi đông.' },
          ].map((review) => (
            <div key={review.name} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="var(--secondary-500)" color="var(--secondary-500)" />
                ))}
              </div>
              <p style={{ color: 'var(--neutral-600)', marginBottom: 16, fontStyle: 'italic' }}>"{review.text}"</p>
              <strong>{review.name}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
