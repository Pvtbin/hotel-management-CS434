import { useState, useEffect } from 'react';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, CreditCard, Save, Lock } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ full_name: '', phone: '', avatar: '', address: '', id_card: '' });
  const [pwd, setPwd] = useState({ old_password: '', new_password: '', confirm: '' });
  const [msg, setMsg] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) setForm({ full_name: user.full_name || '', phone: user.phone || '', avatar: user.avatar || '', address: user.address || '', id_card: user.id_card || '' });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const { data } = await authApi.updateMe(form);
      updateUser(data.user);
      setMsg('Cập nhật thành công');
    } catch (err) { setMsg(err.response?.data?.message || 'Cập nhật thất bại'); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg('');
    if (pwd.new_password !== pwd.confirm) { setPwdMsg('Mật khẩu xác nhận không khớp'); return; }
    try {
      await authApi.changePassword({ old_password: pwd.old_password, new_password: pwd.new_password });
      setPwd({ old_password: '', new_password: '', confirm: '' });
      setPwdMsg('Đổi mật khẩu thành công');
    } catch (err) { setPwdMsg(err.response?.data?.message || 'Đổi mật khẩu thất bại'); }
  };

  if (!user) return null;

  return (
    <div className="container page">
      <h1 className="page-title">Hồ sơ cá nhân</h1>
      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="profile-avatar">{user.avatar ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : user.full_name?.[0]?.toUpperCase()}</div>
          <h3>{user.full_name}</h3>
          <p style={{ color: 'var(--neutral-500)', fontSize: 14 }}>{user.email}</p>
          <div className="badge badge-info mt-4" style={{ width: 'fit-content', margin: '16px auto 0' }}>
            {user.role === 'customer' ? 'Khách hàng' : user.role === 'staff' ? 'Nhân viên' : 'Quản trị viên'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="profile-form">
            <h3 className="mb-6">Thông tin cá nhân</h3>
            {msg && <div className="alert alert-success">{msg}</div>}
            <form onSubmit={handleSave}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="label">Họ và tên</label>
                  <input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="label">Số điện thoại</label>
                  <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="label">Email (không thể thay đổi)</label>
                  <input className="input" value={user.email} disabled style={{ background: 'var(--neutral-50)' }} />
                </div>
                <div className="form-group">
                  <label className="label">CCCD/CMND</label>
                  <input className="input" value={form.id_card} onChange={(e) => setForm({ ...form, id_card: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Địa chỉ</label>
                  <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label">URL ảnh đại diện</label>
                  <input className="input" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              <button className="btn btn-primary mt-4" type="submit"><Save size={16} /> Lưu thay đổi</button>
            </form>
          </div>

          <div className="profile-form">
            <h3 className="mb-6">Đổi mật khẩu</h3>
            {pwdMsg && <div className="alert alert-info">{pwdMsg}</div>}
            <form onSubmit={handleChangePassword}>
              <div className="grid grid-2">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Mật khẩu hiện tại</label>
                  <input className="input" type="password" value={pwd.old_password} onChange={(e) => setPwd({ ...pwd, old_password: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="label">Mật khẩu mới</label>
                  <input className="input" type="password" value={pwd.new_password} onChange={(e) => setPwd({ ...pwd, new_password: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="label">Xác nhận mật khẩu mới</label>
                  <input className="input" type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} required />
                </div>
              </div>
              <button className="btn btn-outline mt-4" type="submit"><Lock size={16} /> Đổi mật khẩu</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
