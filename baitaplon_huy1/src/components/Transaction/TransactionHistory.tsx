import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchTransactions } from '../../redux/transactionsSlice';
import { fetchBooks } from '../../redux/booksSlice';
import { fetchUsers } from '../../redux/usersSlice';
import './Transaction.css';

const TransactionHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector((state) => state.transactions);
  const { books } = useAppSelector((state) => state.books);
  const { users } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBooks());
    dispatch(fetchUsers());
  }, [dispatch]);

  const approvedTransactions = transactions.filter(t => t.approvedAt);

  const getReaderName = (readerId: string) => {
    const user = users.find(u => u.id === readerId);
    return user ? user.fullName : 'N/A';
  };

  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'N/A';
  };

  const groupByDate = (transactions: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    transactions.forEach(transaction => {
      const date = new Date(transaction.createdAt).toLocaleDateString('vi-VN');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });
    return grouped;
  };

  const groupedTransactions = groupByDate(approvedTransactions);

  return (
    <div className="history-container">
      <div className="list-header">
        <h2>Lịch Sử Mượn Trả</h2>
      </div>

      {Object.keys(groupedTransactions).length === 0 ? (
        <div className="empty-state">
          <p>Chưa có lịch sử mượn trả</p>
        </div>
      ) : (
        Object.keys(groupedTransactions).sort((a, b) => {
          return new Date(b).getTime() - new Date(a).getTime();
        }).map(date => (
          <div key={date} className="history-group">
            <h3 className="history-date">Ngày {date}</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Bạn đọc</th>
                    <th>Sách</th>
                    <th>Giờ tạo đơn</th>
                    <th>Giờ phê duyệt</th>
                    <th>Ngày mượn</th>
                    <th>Hạn trả</th>
                    <th>Ngày trả</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedTransactions[date].map(transaction => (
                    <tr key={transaction.id}>
                      <td>{getReaderName(transaction.readerId)}</td>
                      <td>{getBookTitle(transaction.bookId)}</td>
                      <td>{new Date(transaction.createdAt).toLocaleTimeString('vi-VN')}</td>
                      <td>{transaction.approvedAt ? new Date(transaction.approvedAt).toLocaleTimeString('vi-VN') : '-'}</td>
                      <td>{new Date(transaction.borrowDate).toLocaleDateString('vi-VN')}</td>
                      <td>{new Date(transaction.dueDate).toLocaleDateString('vi-VN')}</td>
                      <td>
                        {transaction.returnDate 
                          ? new Date(transaction.returnDate).toLocaleString('vi-VN')
                          : '-'
                        }
                      </td>
                      <td>
                        <span className={`status-badge ${transaction.status}`}>
                          {transaction.status === 'returned' ? 'Đã trả' : 'Đang mượn'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionHistory;
