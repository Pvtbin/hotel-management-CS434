import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { roomApi } from '../api';
import RoomCard from '../components/RoomCard';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    min_price: '',
    max_price: '',
    capacity: searchParams.get('capacity') || '',
    sort: 'price_asc',
  });
  const navigate = useNavigate();

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
      const { data } = await roomApi.list(params);
      setRooms(data.rooms);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRooms(); }, [filters]);

  return (
    <div className="container page">
      <h1 className="page-title">Danh sách phòng</h1>

      <div className="filter-bar">
        <div className="filter-field">
          <label className="label">Tìm kiếm</label>
          <input className="input" placeholder="Tên phòng..." value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        </div>
        <div className="filter-field">
          <label className="label">Giá tối thiểu</label>
          <input className="input" type="number" placeholder="0" value={filters.min_price}
            onChange={(e) => setFilters({ ...filters, min_price: e.target.value })} />
        </div>
        <div className="filter-field">
          <label className="label">Giá tối đa</label>
          <input className="input" type="number" placeholder="10.000.000" value={filters.max_price}
            onChange={(e) => setFilters({ ...filters, max_price: e.target.value })} />
        </div>
        <div className="filter-field">
          <label className="label">Sắp xếp</label>
          <select className="select" value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
            <option value="price_asc">Giá thấp → cao</option>
            <option value="price_desc">Giá cao → thấp</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={fetchRooms}>
          <Search size={16} /> Tìm
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : rooms.length === 0 ? (
        <div className="empty-state">
          <h3>Không tìm thấy phòng</h3>
          <p>Thử thay đổi bộ lọc và tìm lại</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} onBook={(r) => navigate(`/rooms/${r.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
