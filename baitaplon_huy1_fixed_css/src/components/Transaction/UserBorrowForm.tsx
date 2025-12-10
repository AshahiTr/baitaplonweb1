import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createTransaction } from '../../redux/transactionsSlice';
import { fetchBooks } from '../../redux/booksSlice';
import './Transaction.css';

interface UserBorrowFormProps {
  onClose: () => void;
}

const UserBorrowForm: React.FC<UserBorrowFormProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { books } = useAppSelector((state) => state.books);
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    bookId: '',
    borrowDate: new Date().toISOString().split('T')[0],
    dueDate: '',
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const availableBooks = books.filter(book => book.availableQuantity > 0 && !book.isHidden);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    await dispatch(createTransaction({
      readerId: user.id,
      bookId: formData.bookId,
      borrowDate: formData.borrowDate,
      dueDate: formData.dueDate,
      returnDate: null,
      status: 'pending',
      overdueNote: '',
      approvedAt: null,
      requestedBy: 'reader',
    }));

    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Tạo Đơn Mượn Sách</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        {success ? (
          <div className="success-message">
            Đơn mượn đã được gửi! Vui lòng chờ quản trị viên phê duyệt.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Chọn sách: *</label>
              <select
                name="bookId"
                value={formData.bookId}
                onChange={handleChange}
                required
                className="select-large"
              >
                <option value="">-- Chọn sách --</option>
                {availableBooks.map(book => (
                  <option key={book.id} value={book.id} title={`${book.title} - ${book.author} (Còn: ${book.availableQuantity})`}>
                    {book.title} - {book.author} (Còn: {book.availableQuantity})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Ngày mượn: *</label>
              <input
                type="date"
                name="borrowDate"
                value={formData.borrowDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Hạn trả: *</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Gửi đơn</button>
              <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserBorrowForm;