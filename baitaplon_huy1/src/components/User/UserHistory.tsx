import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchTransactions } from '../../redux/transactionsSlice';
import { fetchBooks } from '../../redux/booksSlice';
import './User.css';

const UserHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { transactions } = useAppSelector((state) => state.transactions);
  const { books } = useAppSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBooks());
  }, [dispatch]);

  if (!user) return null;

  const userTransactions = transactions.filter(t => t.readerId === user.id && t.approvedAt);

  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'N/A';
  };

  return (
    <div className="user-history-container">
      <h2>Lịch Sử Mượn Trả</h2>
      
      {userTransactions.length === 0 ? (
        <div className="empty-state">
          <p>Chưa có lịch sử mượn trả</p>
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
  );
};

export default UserHistory;
