import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchTransactions, updateTransaction } from '../../redux/transactionsSlice';
import { fetchBooks } from '../../redux/booksSlice';
import { fetchUsers, updateUser } from '../../redux/usersSlice';
import './Transaction.css';

const OverdueManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector((state) => state.transactions);
  const { books } = useAppSelector((state) => state.books);
  const { users } = useAppSelector((state) => state.users);
  const [showPenaltyForm, setShowPenaltyForm] = useState(false);
  const [selectedReader, setSelectedReader] = useState<any>(null);
  const [penaltyAmount, setPenaltyAmount] = useState('');
  const [penaltyType, setPenaltyType] = useState('money');

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

  const getOverdueTransactions = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    return transactions.filter(t => {
      if (t.status === 'returned') return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < now;
    });
  };

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
    return Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handlePenalty = (readerId: string) => {
    const reader = users.find(u => u.id === readerId);
    if (reader) {
      setSelectedReader(reader);
      setShowPenaltyForm(true);
    }
  };

  const handleSubmitPenalty = async () => {
    if (!selectedReader) return;

    let penaltyStatus = '';
    if (penaltyType === 'money') {
      penaltyStatus = `Phạt tiền: ${penaltyAmount} VNĐ`;
    } else {
      penaltyStatus = `Cấm mượn sách ${penaltyAmount} ngày`;
    }

    await dispatch(updateUser({
      id: selectedReader.id,
      updates: { penaltyStatus }
    }));

    setShowPenaltyForm(false);
    setSelectedReader(null);
    setPenaltyAmount('');
    alert('Đã xử phạt thành công!');
  };

  const overdueTransactions = getOverdueTransactions();

  return (
    <div className="overdue-container">
      <div className="list-header">
        <h2>Quản Lý Tình Trạng Quá Hạn</h2>
        <div className="overdue-count">
          Tổng số quá hạn: <strong>{overdueTransactions.length}</strong>
        </div>
      </div>

      {overdueTransactions.length === 0 ? (
        <div className="empty-state">
          <p>Không có tình trạng quá hạn nào</p>
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
                <th>Quá hạn</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {overdueTransactions.map(transaction => {
                const overdueDays = getOverdueDays(transaction.dueDate);
                return (
                  <tr key={transaction.id} className="overdue-row">
                    <td>{getReaderName(transaction.readerId)}</td>
                    <td>{getBookTitle(transaction.bookId)}</td>
                    <td>{new Date(transaction.borrowDate).toLocaleDateString('vi-VN')}</td>
                    <td>{new Date(transaction.dueDate).toLocaleDateString('vi-VN')}</td>
                    <td className="overdue-days">
                      <strong>⚠️ {overdueDays} ngày</strong>
                    </td>
                    <td>
                      <button 
                        className="btn-small btn-penalty" 
                        onClick={() => handlePenalty(transaction.readerId)}
                      >
                        Xử phạt
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showPenaltyForm && (
        <div className="modal-overlay" onClick={() => setShowPenaltyForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Xử Phạt Bạn Đọc</h3>
              <button className="close-btn" onClick={() => setShowPenaltyForm(false)}>&times;</button>
            </div>
            <div className="penalty-form">
              <p><strong>Bạn đọc:</strong> {selectedReader?.fullName}</p>
              <div className="form-group">
                <label>Loại phạt:</label>
                <select value={penaltyType} onChange={(e) => setPenaltyType(e.target.value)}>
                  <option value="money">Phạt tiền</option>
                  <option value="suspend">Cấm mượn sách</option>
                </select>
              </div>
              <div className="form-group">
                <label>{penaltyType === 'money' ? 'Số tiền (VNĐ):' : 'Số ngày:'}</label>
                <input
                  type="number"
                  value={penaltyAmount}
                  onChange={(e) => setPenaltyAmount(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <button className="btn-primary" onClick={handleSubmitPenalty}>Xác nhận</button>
                <button className="btn-secondary" onClick={() => setShowPenaltyForm(false)}>Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverdueManagement;