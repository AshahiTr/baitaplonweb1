import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createTransaction, fetchTransactions } from '../../redux/transactionsSlice';
import { fetchBooks, updateBook } from '../../redux/booksSlice';
import { fetchUsers } from '../../redux/usersSlice';
import './Transaction.css';

interface BorrowFormProps {
  onClose: () => void;
}

const BorrowForm: React.FC<BorrowFormProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { books } = useAppSelector((state) => state.books);
  const { users } = useAppSelector((state) => state.users);
  const [formData, setFormData] = useState({
    readerId: '',
    bookId: '',
    borrowDate: new Date().toISOString().split('T')[0],
    dueDate: '',
  });

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchUsers());
  }, [dispatch]);

  const readers = users.filter(user => user.role === 'reader');
  const availableBooks = books.filter(book => book.availableQuantity > 0 && !book.isHidden);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.readerId || !formData.bookId || !formData.dueDate) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const book = books.find(b => b.id === formData.bookId);
    if (!book || book.availableQuantity <= 0) {
      alert('Sách không còn sẵn');
      return;
    }

    await dispatch(createTransaction({
      ...formData,
      returnDate: null,
      status: 'borrowing',
      overdueNote: '',
      approvedAt: new Date().toISOString(),
      requestedBy: 'admin',
    }));

    await dispatch(updateBook({
      id: formData.bookId,
      updates: { availableQuantity: book.availableQuantity - 1 }
    }));

    dispatch(fetchTransactions());
    alert('Cho mượn sách thành công!');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Cho Mượn Sách Trực Tiếp</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Chọn bạn đọc: *</label>
            <select
              name="readerId"
              value={formData.readerId}
              onChange={handleChange}
              required
              className="select-large"
            >
              <option value="">-- Chọn bạn đọc --</option>
              {readers.map(reader => (
                <option key={reader.id} value={reader.id}>
                  {reader.fullName} - {reader.email}
                </option>
              ))}
            </select>
          </div>
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
              min={formData.borrowDate}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Xác nhận cho mượn</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowForm;