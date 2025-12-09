import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchTransactions } from '../../redux/transactionsSlice';
import { fetchBooks } from '../../redux/booksSlice';
import { fetchUsers } from '../../redux/usersSlice';
import './Stats.css';

const InventoryStats: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector((state) => state.transactions);
  const { books } = useAppSelector((state) => state.books);
  const { users } = useAppSelector((state) => state.users);
  const [timePeriod, setTimePeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBooks());
    dispatch(fetchUsers());
  }, [dispatch]);

  const getDateRange = () => {
    const now = new Date();
    const start = new Date();
    
    if (timePeriod === 'week') {
      start.setDate(now.getDate() - 7);
    } else {
      start.setMonth(now.getMonth() - 1);
    }
    
    return { start, end: now };
  };

  const { start, end } = getDateRange();

  const filteredTransactions = transactions.filter(t => {
    const transDate = new Date(t.borrowDate);
    return transDate >= start && transDate <= end;
  });

  const borrowCount = filteredTransactions.length;
  const returnCount = filteredTransactions.filter(t => t.returnDate).length;

  const getReaderName = (readerId: string) => {
    const user = users.find(u => u.id === readerId);
    return user ? user.fullName : 'N/A';
  };

  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'N/A';
  };

  const readerStats = users.filter(u => u.role === 'reader').map(reader => {
    const readerTransactions = filteredTransactions.filter(t => t.readerId === reader.id);
    return {
      name: reader.fullName,
      borrowed: readerTransactions.length,
      returned: readerTransactions.filter(t => t.returnDate).length,
    };
  }).filter(stat => stat.borrowed > 0);

  const bookStats = books.map(book => {
    const bookTransactions = filteredTransactions.filter(t => t.bookId === book.id);
    return {
      title: book.title,
      borrowed: bookTransactions.length,
    };
  }).filter(stat => stat.borrowed > 0).sort((a, b) => b.borrowed - a.borrowed);

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Thống Kê Mượn Trả</h2>
        <div className="time-selector">
          <button
            className={`time-btn ${timePeriod === 'week' ? 'active' : ''}`}
            onClick={() => setTimePeriod('week')}
          >
            Tuần
          </button>
          <button
            className={`time-btn ${timePeriod === 'month' ? 'active' : ''}`}
            onClick={() => setTimePeriod('month')}
          >
            Tháng
          </button>
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-card">
          <h3>{borrowCount}</h3>
          <p>Lượt mượn</p>
        </div>
        <div className="stat-card">
          <h3>{returnCount}</h3>
          <p>Lượt trả</p>
        </div>
        <div className="stat-card">
          <h3>{borrowCount - returnCount}</h3>
          <p>Đang mượn</p>
        </div>
      </div>

      <div className="stats-section">
        <h3>Thống Kê Theo Bạn Đọc</h3>
        {readerStats.length === 0 ? (
          <div className="empty-state">
            <p>Không có dữ liệu</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Bạn đọc</th>
                  <th>Số lượt mượn</th>
                  <th>Số lượt trả</th>
                  <th>Đang mượn</th>
                </tr>
              </thead>
              <tbody>
                {readerStats.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.name}</td>
                    <td>{stat.borrowed}</td>
                    <td>{stat.returned}</td>
                    <td>{stat.borrowed - stat.returned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="stats-section">
        <h3>Top Sách Được Mượn Nhiều Nhất</h3>
        {bookStats.length === 0 ? (
          <div className="empty-state">
            <p>Không có dữ liệu</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên sách</th>
                  <th>Số lượt mượn</th>
                </tr>
              </thead>
              <tbody>
                {bookStats.map((stat, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{stat.title}</td>
                    <td>{stat.borrowed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="stats-section">
        <h3>Chi Tiết Giao Dịch Trong Kỳ</h3>
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <p>Không có giao dịch nào</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Bạn đọc</th>
                  <th>Sách</th>
                  <th>Ngày mượn</th>
                  <th>Hạn trả</th>
                  <th>Ngày trả</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{getReaderName(transaction.readerId)}</td>
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
                        {transaction.status === 'returned' ? 'Đã trả' : 'Đang mượn'}
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

export default InventoryStats;
