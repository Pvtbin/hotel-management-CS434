import { Link } from 'react-router-dom';
import { Hotel, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-logo">
            <Hotel size={24} color="var(--primary-400)" />
            <span>Grand Hotel</span>
          </div>
          <p className="footer-desc">
            Hệ thống quản lý và đặt phòng khách sạn trực tuyến hàng đầu Việt Nam.
            Trải nghiệm dịch vụ đẳng cấp 5 sao.
          </p>
          <div className="footer-social">
            <a href="#"><Facebook size={18} /></a>
            <a href="#"><Instagram size={18} /></a>
            <a href="#"><Youtube size={18} /></a>
          </div>
        </div>
        <div>
          <h4>Liên hệ</h4>
          <p><MapPin size={16} /> 123 Nguyễn Huệ, Q.1, TP.HCM</p>
          <p><Phone size={16} /> 1900 1234</p>
          <p><Mail size={16} /> info@grandhotel.vn</p>
        </div>
        <div>
          <h4>Liên kết</h4>
          <Link to="/rooms">Đặt phòng</Link>
          <Link to="/about">Giới thiệu</Link>
          <Link to="/contact">Liên hệ</Link>
          <Link to="/register">Đăng ký</Link>
        </div>
        <div>
          <h4>Dịch vụ</h4>
          <p>Đặt phòng online</p>
          <p>Spa & Massage</p>
          <p>Nhà hàng 5 sao</p>
          <p>Thuê xe sân bay</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 Grand Hotel. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  );
}
