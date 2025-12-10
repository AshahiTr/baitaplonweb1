import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchTransactions } from '../../redux/transactionsSlice';
import './User.css';

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { transactions } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  if (!user) return null;

  const userTransactions = transactions.filter(
    t => t.readerId === user.id && t.status !== 'returned' && t.status !== 'pending'
  );

  return (
    <div className="user-profile-container">
      <div className="profile-card">
        <h2>Thông Tin Cá Nhân</h2>
        <div className="profile-info">
          <div className="info-row">
            <label>Họ và tên:</label>
            <span>{user.fullName}</span>
          </div>
          <div className="info-row">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="info-row">
            <label>Số điện thoại:</label>
            <span>{user.phone}</span>
          </div>
          <div className="info-row">
            <label>Quota:</label>
            <span>{user.quota}</span>
          </div>
          <div className="info-row">
            <label>Đang mượn:</label>
            <span>{userTransactions.length} quyển</span>
          </div>
          <div className="info-row">
            <label>Tình trạng phạt:</label>
            <span className={user.penaltyStatus ? 'penalty-text' : 'normal-text'}>
              {user.penaltyStatus || 'Bạn đang chưa phải chịu hình phạt nào từ thư viện'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
