import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchUsers, deleteUser } from '../../redux/usersSlice';
import { fetchTransactions } from '../../redux/transactionsSlice';
import ReaderForm from './ReaderForm';
import './Reader.css';

const ReaderList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const { transactions } = useAppSelector((state) => state.transactions);
  const [showForm, setShowForm] = useState(false);
  const [editingReader, setEditingReader] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const readers = users.filter(user => user.role === 'reader');

  const getBorrowingCount = (userId: string) => {
    return transactions.filter(
      t => t.readerId === userId && t.status !== 'returned'
    ).length;
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa bạn đọc này?')) {
      dispatch(deleteUser(id));
    }
  };

  const handleEdit = (reader: any) => {
    setEditingReader(reader);
    setShowForm(true);
  };

  return (
    <div className="reader-list-container">
      <div className="list-header">
        <h2>Quản Lý Bạn Đọc</h2>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Quota</th>
              <th>Đang mượn</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {readers.map(reader => (
              <tr key={reader.id}>
                <td>{reader.fullName}</td>
                <td>{reader.phone}</td>
                <td>{reader.email}</td>
                <td>{reader.quota}</td>
                <td>{getBorrowingCount(reader.id)}</td>
                <td>
                  <span className={`status-badge ${reader.penaltyStatus ? 'penalty' : 'normal'}`}>
                    {reader.penaltyStatus || 'Bình thường'}
                  </span>
                </td>
                <td>
                  <button className="btn-small btn-edit" onClick={() => handleEdit(reader)}>Sửa</button>
                  <button className="btn-small btn-delete" onClick={() => handleDelete(reader.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ReaderForm
          reader={editingReader}
          onClose={() => { setShowForm(false); setEditingReader(null); }}
        />
      )}
    </div>
  );
};

export default ReaderList;
