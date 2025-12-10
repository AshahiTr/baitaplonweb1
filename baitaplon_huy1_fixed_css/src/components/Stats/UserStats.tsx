import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchTransactions } from '../../redux/transactionsSlice';
import { fetchBooks } from '../../redux/booksSlice';
import './Stats.css';

const UserStats: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { transactions } = useAppSelector((state) => state.transactions);
  const { books } = useAppSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBooks());
  }, [dispatch]);

  if (!user) return null;

  const userTransactions = transactions.filter(t => t.readerId === user.id);
  const totalBorrowed = userTransactions.length;
  const returned = userTransactions.filter(t => t.returnDate).length;
  const borrowing = userTransactions.filter(t => !t.returnDate && t.status !== 'pending').length;

  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'N/A';
  };

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Thống Kê Cá Nhân</h2>
      </div>

      <div className="stats-summary">
        <div className="stat-card">
          <h3>{totalBorrowed}</h3>
          <p>Tổng lượt mượn</p>
        </div>
        <div className="stat-card">
          <h3>{returned}</h3>
          <p>Đã trả</p>
        </div>
        <div className="stat-card">
          <h3>{borrowing}</h3>
          <p>Đang mượn</p>
        </div>
      </div>

      <div className="stats-section">
        <h3>Lịch Sử Mượn Sách</h3>
        {userTransactions.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có lịch sử mượn sách</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Sách</th>
                  <th>Ngày mượn</th>
                  <th>Hạn trả</th>
                  <th>Ngày trả</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {userTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{getBookTitle(transaction.bookId)}</td>
                    <td>{new Date(transaction.borrowDate).toLocaleDateString('vi-VN')}</td>
                    <td>{new Date(transaction.dueDate).toLocaleDateString('vi-VN')}</td>
                    <td>
                      {transaction.returnDate 
                        ? new Date(transaction.returnDate).toLocaleDateString('vi-VN')
                        : '-'
                      }
                    </td>
                    <td>
                      <span className={`status-badge ${transaction.status}`}>
                        {transaction.status === 'returned' ? 'Đã trả' : 
                         transaction.status === 'pending' ? 'Chờ duyệt' : 'Đang mượn'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStats;
