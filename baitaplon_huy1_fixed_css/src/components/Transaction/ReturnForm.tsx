import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchTransactions, updateTransaction } from '../../redux/transactionsSlice';
import { fetchBooks, updateBook } from '../../redux/booksSlice';
import { fetchUsers } from '../../redux/usersSlice';
import './Transaction.css';

interface ReturnFormProps {
  onClose: () => void;
}

const ReturnForm: React.FC<ReturnFormProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector((state) => state.transactions);
  const { books } = useAppSelector((state) => state.books);
  const { users } = useAppSelector((state) => state.users);
  const [selectedTransaction, setSelectedTransaction] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBooks());
    dispatch(fetchUsers());
  }, [dispatch]);

  const borrowingTransactions = transactions.filter(
    t => t.status !== 'returned' && t.status !== 'pending'
  );

  const getReaderName = (readerId: string) => {
    const user = users.find(u => u.id === readerId);
    return user ? user.fullName : 'N/A';
  };

  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'N/A';
  };

  const getOverdueDays = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const handleReturn = async () => {
    if (!selectedTransaction) {
      alert('Vui lòng chọn sách cần trả');
      return;
    }

    const transaction = transactions.find(t => t.id === selectedTransaction);
    if (!transaction) return;

    await dispatch(updateTransaction({
      id: transaction.id,
      updates: {
        returnDate: new Date().toISOString(),
        status: 'returned',
      }
    }));

    const book = books.find(b => b.id === transaction.bookId);
    if (book) {
      await dispatch(updateBook({
        id: book.id,
        updates: { availableQuantity: book.availableQuantity + 1 }
      }));
    }

    dispatch(fetchTransactions());
    alert('Trả sách thành công!');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Trả Sách</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        {borrowingTransactions.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px' }}>
            <p>Không có sách nào đang được mượn</p>
          </div>
        ) : (
          <>
            <div className="return-list">
              <p style={{ marginBottom: '15px', color: 'var(--text-primary)', fontWeight: 600 }}>
                Chọn sách cần trả:
              </p>
              {borrowingTransactions.map(transaction => {
                const overdueDays = getOverdueDays(transaction.dueDate);
                return (
                  <div
                    key={transaction.id}
                    className={`return-item ${selectedTransaction === transaction.id ? 'selected' : ''}`}
                    onClick={() => setSelectedTransaction(transaction.id)}
                  >
                    <div>
                      <strong>{getReaderName(transaction.readerId)}</strong>
                      <p><strong>Sách:</strong> {getBookTitle(transaction.bookId)}</p>
                      <small>Ngày mượn: {new Date(transaction.borrowDate).toLocaleDateString('vi-VN')}</small>
                      <br />
                      <small>Hạn trả: {new Date(transaction.dueDate).toLocaleDateString('vi-VN')}</small>
                      {overdueDays > 0 && (
                        <>
                          <br />
                          <small style={{ color: 'var(--neon-pink)', fontWeight: 'bold' }}>
                            ⚠️ Quá hạn {overdueDays} ngày
                          </small>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="form-actions">
              <button
                className="btn-primary"
                onClick={handleReturn}
                disabled={!selectedTransaction}
              >
                Xác nhận trả sách
              </button>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Hủy
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReturnForm;
