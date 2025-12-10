import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logout } from '../redux/authSlice';
import BackgroundEffects from './BackgroundEffects';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { pending } = useAppSelector((state) => state.transactions);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="layout">
      <BackgroundEffects />
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">Thư viện số</Link>
        </div>
        <div className="nav-menu">
          {user?.role === 'admin' ? (
            <>
              <Link to="/books">Danh sách</Link>
              <Link to="/categories">Thể loại</Link>
              <Link to="/readers">Bạn đọc</Link>
              <Link to="/transactions">Mượn - Trả</Link>
              <Link to="/borrow-requests" className="nav-with-badge">
                Đơn mượn
                {pending.length > 0 && (
                  <span className="nav-badge">{pending.length}</span>
                )}
              </Link>
              <Link to="/overdue">Quá hạn</Link>
              <Link to="/history">Lịch sử</Link>
              <Link to="/stats">Thống kê</Link>
            </>
          ) : (
            <>
              <Link to="/books-user">Danh sách</Link>
              <Link to="/borrow">Mượn sách</Link>
              <Link to="/profile">Thông tin</Link>
              <Link to="/user-history">Lịch sử</Link>
              <Link to="/user-stats">Thống kê</Link>
            </>
          )}
        </div>
        <div className="nav-user">
          <span className="user-name" title={user?.fullName}>{user?.fullName}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;