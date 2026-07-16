import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Hotel, Menu, X, User, LogOut, LayoutDashboard, ClipboardList, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/rooms', label: 'Phòng' },
    { to: '/about', label: 'Giới thiệu' },
    { to: '/contact', label: 'Liên hệ' },
  ];

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <Hotel size={28} color="var(--primary-600)" />
          <span>Grand Hotel</span>
        </Link>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          {user ? (
            <div className="user-menu-wrapper">
              <button className="user-btn" onClick={() => setUserMenu(!userMenu)}>
                <div className="user-avatar">
                  {user.avatar ? <img src={user.avatar} alt="avatar" /> : user.full_name?.[0]?.toUpperCase()}
                </div>
                <span className="user-name">{user.full_name?.split(' ').slice(-1)[0]}</span>
              </button>
              {userMenu && (
                <>
                  <div className="dropdown-overlay" onClick={() => setUserMenu(false)} />
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <strong>{user.full_name}</strong>
                      <small>{user.email}</small>
                    </div>
                    {user.role === 'customer' && (
                      <Link to="/profile" onClick={() => setUserMenu(false)}><User size={16} /> Hồ sơ cá nhân</Link>
                    )}
                    {user.role === 'customer' && (
                      <Link to="/my-bookings" onClick={() => setUserMenu(false)}><ClipboardList size={16} /> Lịch sử đặt phòng</Link>
                    )}
                    {(user.role === 'staff' || user.role === 'admin') && (
                      <Link to="/dashboard" onClick={() => setUserMenu(false)}>
                        {user.role === 'admin' ? <Shield size={16} /> : <LayoutDashboard size={16} />}
                        Bảng điều khiển
                      </Link>
                    )}
                    <button onClick={handleLogout} className="dropdown-logout">
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
            </>
          )}
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
