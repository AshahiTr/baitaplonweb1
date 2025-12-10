import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createTransaction, fetchTransactions } from '../../redux/transactionsSlice';
import { fetchBooks } from '../../redux/booksSlice';
import './Transaction.css';

interface UserBorrowFormProps {
  onClose: () => void;
}

const UserBorrowForm: React.FC<UserBorrowFormProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { books } = useAppSelector((state) => state.books);
  const { user } = useAppSelector((state) => state.auth);
  const { transactions } = useAppSelector((state) => state.transactions);
  const [formData, setFormData] = useState({
    bookId: '',
    borrowDate: new Date().toISOString().split('T')[0],
    dueDate: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const availableBooks = books.filter(book => book.availableQuantity > 0 && !book.isHidden);

  // Tính số sách đang mượn
  const currentBorrowingCount = user ? transactions.filter(
    t => t.readerId === user.id && t.status !== 'returned' && t.status !== 'pending'
  ).length : 0;

  // Tính số đơn đang chờ phê duyệt
  const pendingCount = user ? transactions.filter(
    t => t.readerId === user.id && t.status === 'pending'
  ).length : 0;

  const canBorrow = user && (currentBorrowingCount < user.quota);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Kiểm tra quota
    if (currentBorrowingCount >= user.quota) {
      setError(`Bạn đã mượn tối đa ${user.quota} quyển sách. Vui lòng trả sách trước khi mượn thêm.`);
      return;
    }

    // Kiểm tra tổng số sách đang mượn + đơn chờ duyệt
    if (currentBorrowingCount + pendingCount >= user.quota) {
      setError(`Bạn đã có ${pendingCount} đơn đang chờ phê duyệt. Tổng số sách (đang mượn + chờ duyệt) không được vượt quá ${user.quota} quyển.`);
      return;
    }

    try {
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
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo đơn mượn');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Tạo Đơn Mượn Sách</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        {user && (
          <div style={{ 
            padding: '15px', 
            background: canBorrow ? '#E8F5E9' : '#FFEBEE',
            border: `1px solid ${canBorrow ? 'var(--success)' : 'var(--danger)'}`,
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>
              Đang mượn: <strong>{currentBorrowingCount}/{user.quota}</strong> quyển
            </p>
            {pendingCount > 0 && (
              <p style={{ margin: '5px 0 0 0', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>
                Đơn chờ duyệt: <strong>{pendingCount}</strong> đơn
              </p>
            )}
            {!canBorrow && (
              <p style={{ margin: '10px 0 0 0', color: 'var(--danger)', fontWeight: 600, fontSize: '13px' }}>
                ⚠️ Bạn đã đạt giới hạn mượn sách. Vui lòng trả sách trước khi mượn thêm.
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="error-message" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}

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
                disabled={!canBorrow}
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
                disabled={!canBorrow}
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
                disabled={!canBorrow}
                min={formData.borrowDate}
              />
            </div>
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={!canBorrow}
              >
                Gửi đơn
              </button>
              <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserBorrowForm;