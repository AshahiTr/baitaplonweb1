import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchPendingTransactions, updateTransaction, deleteTransaction } from '../../redux/transactionsSlice';
import { fetchBooks, updateBook } from '../../redux/booksSlice';
import { fetchUsers } from '../../redux/usersSlice';
import './Transaction.css';

const BorrowRequestList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pending, loading, error } = useAppSelector((state) => state.transactions);
  const { books } = useAppSelector((state) => state.books);
  const { users } = useAppSelector((state) => state.users);

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchPendingTransactions()).unwrap();
        await dispatch(fetchBooks()).unwrap();
        await dispatch(fetchUsers()).unwrap();
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    
    loadData();
  }, [dispatch]);

  const getReaderName = (readerId: string) => {
    const user = users.find(u => u.id === readerId);
    return user ? user.fullName : 'N/A';
  };

  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'N/A';
  };

  const handleApprove = async (transaction: any) => {
    try {
      const book = books.find(b => b.id === transaction.bookId);
      if (!book || book.availableQuantity <= 0) {
        alert('Sách không còn sẵn');
        return;
      }


      await dispatch(updateTransaction({
        id: transaction.id,
        updates: {
          status: 'borrowing',
          approvedAt: new Date().toISOString(),
        }
      })).unwrap();


      await dispatch(updateBook({
        id: transaction.bookId,
        updates: { availableQuantity: book.availableQuantity - 1 }
      })).unwrap();


      await dispatch(fetchPendingTransactions()).unwrap();
      
      alert('Đã phê duyệt đơn mượn thành công!');
    } catch (err) {
      console.error('Error approving request:', err);
      alert('Có lỗi xảy ra khi phê duyệt đơn mượn');
    }
  };

  const handleReject = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn từ chối đơn mượn này?')) {
      try {
        await dispatch(deleteTransaction(id)).unwrap();
        await dispatch(fetchPendingTransactions()).unwrap();
        alert('Đã từ chối đơn mượn');
      } catch (err) {
        console.error('Error rejecting request:', err);
        alert('Có lỗi xảy ra khi từ chối đơn mượn');
      }
    }
  };

  if (loading) {
    return (
      <div className="borrow-request-container">
        <div className="list-header">
          <h2>Quản Lý Đơn Mượn</h2>
        </div>
        <div className="empty-state">
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="borrow-request-container">
        <div className="list-header">
          <h2>Quản Lý Đơn Mượn</h2>
        </div>
        <div className="error-message">
          <p>Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="borrow-request-container">
      <div className="list-header">
        <h2>Quản Lý Đơn Mượn</h2>
        {pending.length > 0 && (
          <span className="notification-badge">{pending.length}</span>
        )}
      </div>

      {pending.length === 0 ? (
        <div className="empty-state">
          <p>Không có đơn mượn nào đang chờ phê duyệt</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Bạn đọc</th>
                <th>Sách</th>
                <th>Ngày tạo đơn</th>
                <th>Ngày mượn</th>
                <th>Hạn trả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pending.map(transaction => (
                <tr key={transaction.id}>
                  <td>{getReaderName(transaction.readerId)}</td>
                  <td>{getBookTitle(transaction.bookId)}</td>
                  <td>{new Date(transaction.createdAt).toLocaleString('vi-VN')}</td>
                  <td>{new Date(transaction.borrowDate).toLocaleDateString('vi-VN')}</td>
                  <td>{new Date(transaction.dueDate).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <button 
                      className="btn-small btn-approve" 
                      onClick={() => handleApprove(transaction)}
                    >
                      Phê duyệt
                    </button>
                    <button 
                      className="btn-small btn-delete" 
                      onClick={() => handleReject(transaction.id)}
                    >
                      Từ chối
                    </button>
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

export default BorrowRequestList;