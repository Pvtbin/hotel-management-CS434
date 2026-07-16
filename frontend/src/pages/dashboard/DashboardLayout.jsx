import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, CalendarCheck, Users, BedDouble, ConciergeBell, LifeBuoy, BarChart3, UserCog, ShieldCheck, Receipt, Star } from 'lucide-react';

export default function DashboardLayout() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';

  const staffLinks = [
    { to: '/dashboard', end: true, icon: LayoutDashboard, label: 'Tổng quan' },
    { to: '/dashboard/bookings', icon: CalendarCheck, label: 'Quản lý đặt phòng' },
    { to: '/dashboard/rooms', icon: BedDouble, label: 'Quản lý phòng' },
    { to: '/dashboard/services', icon: ConciergeBell, label: 'Quản lý dịch vụ' },
    { to: '/dashboard/customers', icon: Users, label: 'Quản lý khách hàng' },
    { to: '/dashboard/support', icon: LifeBuoy, label: 'Hỗ trợ khách hàng' },
    { to: '/dashboard/revenue', icon: BarChart3, label: 'Thống kê doanh thu' },
    { to: '/dashboard/payments', icon: Receipt, label: 'Thanh toán' },
    { to: '/dashboard/reviews', icon: Star, label: 'Đánh giá' },
  ];

  const adminLinks = [
    { to: '/dashboard/accounts', icon: UserCog, label: 'Quản lý tài khoản' },
    { to: '/dashboard/staff', icon: ShieldCheck, label: 'Quản lý nhân viên' },
    { to: '/dashboard/reports', icon: BarChart3, label: 'Báo cáo thống kê' },
  ];

  const links = isStaff ? staffLinks : isAdmin ? [...staffLinks, ...adminLinks] : [];

  return (
    <div className="container dashboard-layout">
      <aside className="dashboard-sidebar">
        <h3>{isAdmin ? 'Quản trị' : 'Nhân viên'}</h3>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => isActive ? 'active' : ''}>
            <link.icon size={18} /> {link.label}
          </NavLink>
        ))}
      </aside>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
