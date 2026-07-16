import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import BookingDetail from './pages/BookingDetail';
import Payment from './pages/Payment';

import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ManageBookings from './pages/dashboard/ManageBookings';
import ManageRooms from './pages/dashboard/ManageRooms';
import ManageServices from './pages/dashboard/ManageServices';
import ManageCustomers from './pages/dashboard/ManageCustomers';
import ManageSupport from './pages/dashboard/ManageSupport';
import RevenueStats from './pages/dashboard/RevenueStats';
import ManagePayments from './pages/dashboard/ManagePayments';
import ManageReviews from './pages/dashboard/ManageReviews';
import ManageAccounts from './pages/dashboard/ManageAccounts';
import ManageStaff from './pages/dashboard/ManageStaff';
import Reports from './pages/dashboard/Reports';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={
          <ProtectedRoute roles={['customer', 'staff', 'admin']}><Profile /></ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute roles={['customer']}><MyBookings /></ProtectedRoute>
        } />
        <Route path="/bookings/:id" element={
          <ProtectedRoute roles={['customer', 'staff', 'admin']}><BookingDetail /></ProtectedRoute>
        } />
        <Route path="/payment/:bookingId" element={
          <ProtectedRoute roles={['customer', 'staff', 'admin']}><Payment /></ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute roles={['staff', 'admin']}><DashboardLayout /></ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="rooms" element={<ManageRooms />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="customers" element={<ManageCustomers />} />
          <Route path="support" element={<ManageSupport />} />
          <Route path="revenue" element={<RevenueStats />} />
          <Route path="payments" element={<ManagePayments />} />
          <Route path="reviews" element={<ManageReviews />} />
          <Route path="accounts" element={<ProtectedRoute roles={['admin']}><ManageAccounts /></ProtectedRoute>} />
          <Route path="staff" element={<ProtectedRoute roles={['admin']}><ManageStaff /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute roles={['admin']}><Reports /></ProtectedRoute>} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}
