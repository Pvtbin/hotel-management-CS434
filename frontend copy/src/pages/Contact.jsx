import { useState } from 'react';
import { supportApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ subject: '', message: '', priority: 'medium' });
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      await supportApi.create(form);
      setMsg('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm.');
      setForm({ subject: '', message: '', priority: 'medium' });
    } catch (err) { setMsg(err.response?.data?.message || 'Gửi thất bại'); }
  };

  return (
    <div className="container page">
      <h1 className="page-title">Liên hệ</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="mb-4">Thông tin liên hệ</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="feature-icon" style={{ margin: 0 }}><MapPin size={20} /></div>
              <div><strong>Địa chỉ</strong><p style={{ color: 'var(--neutral-500)', fontSize: 14 }}>123 Nguyễn Huệ, Q.1, TP.HCM</p></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="feature-icon" style={{ margin: 0 }}><Phone size={20} /></div>
              <div><strong>Điện thoại</strong><p style={{ color: 'var(--neutral-500)', fontSize: 14 }}>1900 1234</p></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="feature-icon" style={{ margin: 0 }}><Mail size={20} /></div>
              <div><strong>Email</strong><p style={{ color: 'var(--neutral-500)', fontSize: 14 }}>info@grandhotel.vn</p></div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 className="mb-4">Gửi yêu cầu hỗ trợ</h3>
          {msg && <div className="alert alert-success">{msg}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Tiêu đề</label>
              <input className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="label">Mức độ ưu tiên</label>
              <select className="select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">Nội dung</label>
              <textarea className="textarea" rows="5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <button className="btn btn-primary" type="submit"><Send size={16} /> Gửi yêu cầu</button>
          </form>
        </div>
      </div>
    </div>
  );
}
