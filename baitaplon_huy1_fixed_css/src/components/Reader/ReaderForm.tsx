import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { updateUser } from '../../redux/usersSlice';
import './Reader.css';

interface ReaderFormProps {
  reader?: any;
  onClose: () => void;
}

const ReaderForm: React.FC<ReaderFormProps> = ({ reader, onClose }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    quota: 5,
    penaltyStatus: '',
  });

  useEffect(() => {
    if (reader) {
      setFormData({
        fullName: reader.fullName,
        phone: reader.phone,
        email: reader.email,
        quota: reader.quota,
        penaltyStatus: reader.penaltyStatus,
      });
    }
  }, [reader]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reader) {
      await dispatch(updateUser({ id: reader.id, updates: formData }));
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Sửa Thông Tin Bạn Đọc</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Quota:</label>
            <input
              type="number"
              name="quota"
              value={formData.quota}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Trạng thái phạt:</label>
            <input
              type="text"
              name="penaltyStatus"
              value={formData.penaltyStatus}
              onChange={handleChange}
              placeholder="Để trống nếu không có"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Cập nhật</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReaderForm;
