import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="container page">
      <h1 className="page-title">Giới thiệu</h1>
      <div className="card" style={{ padding: 32 }}>
        <img src="https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg" alt="Hotel" style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: 24 }} />
        <h2>Grand Hotel - Nơi trải nghiệm sự sang trọng</h2>
        <p style={{ marginTop: 12, color: 'var(--neutral-600)', lineHeight: 1.8 }}>
          Grand Hotel là hệ thống khách sạn 5 sao hàng đầu tại Việt Nam, với hơn 10 năm kinh nghiệm trong ngành dịch vụ lưu trú.
          Chúng tôi tự hào mang đến cho khách hàng những trải nghiệm tuyệt vời nhất với hệ thống phòng đa dạng, dịch vụ chất lượng cao
          và đội ngũ nhân viên chuyên nghiệp.
        </p>
        <h3 className="mt-6 mb-4">Tầm nhìn</h3>
        <p style={{ color: 'var(--neutral-600)', lineHeight: 1.8 }}>
          Trở thành hệ thống khách sạn được yêu thích nhất tại Việt Nam, nơi khách hàng luôn cảm thấy thoải mái và hài lòng.
        </p>
        <h3 className="mt-6 mb-4">Giá trị cốt lõi</h3>
        <ul style={{ listStyle: 'none', color: 'var(--neutral-600)', lineHeight: 2 }}>
          <li>✓ Chất lượng dịch vụ hàng đầu</li>
          <li>✓ Khách hàng là trung tâm</li>
          <li>✓ Đổi mới và sáng tạo không ngừng</li>
          <li>✓ Trách nhiệm với cộng đồng</li>
        </ul>
      </div>
    </div>
  );
}
