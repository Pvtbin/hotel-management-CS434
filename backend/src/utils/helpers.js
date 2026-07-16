import { query } from '../config/database.js';

export const checkRoomAvailability = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
  let sql = `
    SELECT id FROM bookings
    WHERE room_id = ? AND status NOT IN ('cancelled')
    AND check_in < ? AND check_out > ?
  `;
  const params = [roomId, checkOut, checkIn];
  if (excludeBookingId) {
    sql += ' AND id != ?';
    params.push(excludeBookingId);
  }
  const conflicts = await query(sql, params);
  return conflicts.length === 0;
};

export const calculateNights = (checkIn, checkOut) => {
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const calculateTotalPrice = (roomPrice, nights, services = []) => {
  const servicesPrice = services.reduce((sum, s) => sum + s.price * s.quantity, 0);
  return {
    roomTotal: roomPrice * nights,
    servicesTotal: servicesPrice,
    total: roomPrice * nights + servicesPrice,
  };
};
