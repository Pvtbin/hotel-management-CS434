export const notFound = (req, res) => {
  res.status(404).json({ message: 'Không tìm thấy endpoint' });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Lỗi máy chủ nội bộ';
  res.status(status).json({ message });
};
