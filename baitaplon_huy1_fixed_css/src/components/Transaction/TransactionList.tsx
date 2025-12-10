import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchTransactions, updateTransaction, deleteTransaction } from '../../redux/transactionsSlice';
import { fetchBooks } from '../../redux/booksSlice';
import { fetchUsers } from '../../redux/usersSlice';
import BorrowForm from './BorrowForm';
import ReturnForm from './ReturnForm';
import './Transaction.css';

const TransactionList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector((state) => state.transactions);
  const { books } = useAppSelector((state) => state.books);
  const { users } = useAppSelector((state) => state.users);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBooks());
    dispatch(fetchUsers());
  }, [dispatch]);


  useEffect(() => {
    const updateOverdueStatus = async () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0); 

      for (const transaction of transactions) {
        if (transaction.status === 'borrowing' && !transaction.returnDate) {
          const dueDate = new Date(transaction.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          if (dueDate < now) {
            await dispatch(updateTransaction({
              id: transaction.id,
              updates: { status: 'overdue' }
            }));
          }
        }
      }
    };

    updateOverdueStatus();
  }, [transactions, dispatch]);

  const activeTransactions = transactions.filter(
    t => t.status !== 'pending' && t.status !== 'returned'
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
    due.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diff = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const getStatus = (transaction: any) => {
    if (transaction.returnDate) return 'returned';
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dueDate = new Date(transaction.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    if (dueDate < now) {
      return 'overdue';
    }
    return 'borrowing';
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa thông tin mượn trả này?')) {
      dispatch(deleteTransaction(id));
    }
  };

  const overdueCount = activeTransactions.filter(t => getStatus(t) === 'overdue').length;
  const totalBorrowing = activeTransactions.length;

  return (
    <div className="transaction-list-container">
      <div className="list-header">
        <h2>Quản Lý Mượn - Trả</h2>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowBorrowForm(true)}>
            Mượn Sách
          </button>
          <button className="btn-primary" onClick={() => setShowReturnForm(true)}>
            Trả Sách
          </button>
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-card">
          <h3>{totalBorrowing}</h3>
          <p>Tổng số sách đang mượn</p>
        </div>
        <div className="stat-card danger">
          <h3>{overdueCount}</h3>
          <p>Tổng số quá hạn</p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Bạn đọc</th>
              <th>Sách mượn</th>
              <th>Ngày mượn</th>
              <th>Hạn trả</th>
              <th>Ngày trả</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {activeTransactions.map(transaction => {
              const status = getStatus(transaction);
              const overdueDays = getOverdueDays(transaction.dueDate);
              return (
                <tr key={transaction.id} className={status === 'overdue' ? 'overdue-row' : ''}>
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
                    <span className={`status-badge ${status}`}>
                      {status === 'overdue' ? 'Quá hạn' : 'Đang mượn'}
                    </span>
                  </td>
                  <td>
                    {overdueDays > 0 ? (
                      <span style={{ color: 'var(--neon-pink)', fontWeight: 'bold' }}>
                        ⚠️ Quá hạn {overdueDays} ngày
                      </span>
                    ) : '-'}
                  </td>
                  <td>
                    <button 
                      className="btn-small btn-delete" 
                      onClick={() => handleDelete(transaction.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showBorrowForm && (
        <BorrowForm onClose={() => setShowBorrowForm(false)} />
      )}

      {showReturnForm && (
        <ReturnForm onClose={() => setShowReturnForm(false)} />
      )}
    </div>
  );
};

export default TransactionList;