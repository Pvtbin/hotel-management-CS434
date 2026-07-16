import { Link } from 'react-router-dom';
export default function RoomCard({ room, onBook }) {
  const statusMap = {
    available: { label: 'Còn phòng', class: 'badge-success' },
    booked: { label: 'Đã đặt', class: 'badge-warning' },
    occupied: { label: 'Đang ở', class: 'badge-info' },
    maintenance: { label: 'Bảo trì', class: 'badge-error' },
  };
  const status = statusMap[room.status] || statusMap.available;

  return (
    <div className="room-card fade-in">
      <Link to={`/rooms/${room.id}`} className="room-card-image">
        <img src={room.thumbnail || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'} alt={`Phòng ${room.room_number}`} />
        <span className={`badge ${status.class} room-status-badge`}>{status.label}</span>
      </Link>
      <div className="room-card-body">
        <div className="room-card-header">
          <h3>Phòng {room.room_number}</h3>
          <span className="room-type-tag">{room.room_type_name}</span>
        </div>
        <p className="room-desc">{room.description?.slice(0, 80)}...</p>
        <div className="room-features">
          <span>👥 {room.capacity} người</span>
          <span>📐 {room.area}m²</span>
          <span>🏢 Tầng {room.floor}</span>
        </div>
        <div className="room-card-footer">
          <div className="room-price">
            <span className="price">{Number(room.price_per_night).toLocaleString('vi-VN')}₫</span>
            <span className="price-unit">/ đêm</span>
          </div>
          {onBook ? (
            <button className="btn btn-primary btn-sm" onClick={() => onBook(room)}>Đặt ngay</button>
          ) : (
            <Link to={`/rooms/${room.id}`} className="btn btn-outline btn-sm">Xem chi tiết</Link>
          )}
        </div>
      </div>
    </div>
  );
}
