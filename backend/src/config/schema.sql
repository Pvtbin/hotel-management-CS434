CREATE DATABASE IF NOT EXISTS hotel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hotel_db;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('guest', 'customer', 'staff', 'admin') DEFAULT 'customer',
  avatar VARCHAR(255),
  address TEXT,
  id_card VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS room_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  room_number VARCHAR(20) NOT NULL UNIQUE,
  room_type_id INT,
  floor INT,
  price_per_night DECIMAL(12,2) NOT NULL,
  capacity INT DEFAULT 2,
  area FLOAT,
  description TEXT,
  amenities JSON,
  thumbnail VARCHAR(255),
  images JSON,
  status ENUM('available', 'booked', 'occupied', 'maintenance') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  unit VARCHAR(50),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  adults INT DEFAULT 1,
  children INT DEFAULT 0,
  total_nights INT NOT NULL,
  room_price DECIMAL(12,2) NOT NULL,
  services_price DECIMAL(12,2) DEFAULT 0,
  total_price DECIMAL(12,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled') DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking_services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  service_id INT NOT NULL,
  quantity INT DEFAULT 1,
  price DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL UNIQUE,
  amount DECIMAL(12,2) NOT NULL,
  method ENUM('cash', 'card', 'transfer', 'online') DEFAULT 'cash',
  status ENUM('pending', 'paid', 'refunded', 'failed') DEFAULT 'pending',
  transaction_id VARCHAR(255),
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  booking_id INT NOT NULL,
  room_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  cleanliness INT CHECK (cleanliness BETWEEN 1 AND 5),
  service INT CHECK (service BETWEEN 1 AND 5),
  location INT CHECK (location BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  assigned_to INT,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- Seed room types
INSERT IGNORE INTO room_types (id, name, description) VALUES
(1, 'Standard', 'Phòng tiêu chuẩn tiện nghi'),
(2, 'Deluxe', 'Phòng cao cấp với view đẹp'),
(3, 'Suite', 'Phòng suite sang trọng'),
(4, 'Family', 'Phòng gia đình rộng rãi'),
(5, 'VIP', 'Phòng VIP đẳng cấp nhất');

-- Seed admin user (password: Admin@123)
INSERT IGNORE INTO users (id, full_name, email, phone, password, role) VALUES
(1, 'Quản Trị Viên', 'admin@hotel.com', '0900000001', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Seed staff user (password: Staff@123)
INSERT IGNORE INTO users (id, full_name, email, phone, password, role) VALUES
(2, 'Nhân Viên Demo', 'staff@hotel.com', '0900000002', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff');

-- Seed services
INSERT IGNORE INTO services (id, name, description, price, unit, category) VALUES
(1, 'Ăn sáng', 'Buffet sáng tại nhà hàng', 150000, 'người', 'Ẩm thực'),
(2, 'Spa & Massage', 'Dịch vụ spa thư giãn', 500000, 'lần', 'Sức khỏe'),
(3, 'Thuê xe', 'Xe đưa đón sân bay', 300000, 'chuyến', 'Vận chuyển'),
(4, 'Giặt ủi', 'Dịch vụ giặt ủi quần áo', 50000, 'kg', 'Tiện ích'),
(5, 'Minibar', 'Đồ uống trong phòng', 100000, 'lần', 'Ẩm thực');

-- Seed sample rooms
INSERT IGNORE INTO rooms (id, room_number, room_type_id, floor, price_per_night, capacity, area, description, thumbnail, status) VALUES
(1, '101', 1, 1, 500000, 2, 25, 'Phòng Standard thoáng mát, view sân vườn', 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', 'available'),
(2, '102', 1, 1, 500000, 2, 25, 'Phòng Standard thoáng mát, view sân vườn', 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg', 'available'),
(3, '201', 2, 2, 900000, 2, 35, 'Phòng Deluxe sang trọng, view biển', 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg', 'available'),
(4, '202', 2, 2, 900000, 2, 35, 'Phòng Deluxe sang trọng, view thành phố', 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg', 'available'),
(5, '301', 3, 3, 2000000, 3, 60, 'Suite cao cấp với phòng khách riêng', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg', 'available'),
(6, '401', 4, 4, 1500000, 4, 55, 'Phòng Family rộng rãi cho gia đình', 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg', 'available'),
(7, '501', 5, 5, 5000000, 2, 100, 'Phòng VIP penthouse đỉnh cao', 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg', 'available');
