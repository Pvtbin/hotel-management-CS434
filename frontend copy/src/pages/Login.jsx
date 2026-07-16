import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      login(data.token, data.user);
      if (data.user.role === 'staff' || data.user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <h1>Đăng nhập</h1>
        <p className="subtitle">Chào mừng bạn quay lại Grand Hotel</p>
        {error && <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="email@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="label">Mật khẩu</label>
            <input className="input" type="password" placeholder="••••••••"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
        <p className="auth-switch">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
        <div style={{ marginTop: 16, padding: 12, background: 'var(--primary-50)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--neutral-600)' }}>
          <strong>Tài khoản demo:</strong><br />
          Admin: admin@hotel.com / Admin@123<br />
          Staff: staff@hotel.com / Staff@123
        </div>
      </div>
    </div>
  );
}
