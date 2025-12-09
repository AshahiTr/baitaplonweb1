import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import ForgotPassword from '../components/Auth/ForgotPassword';
import ResetPassword from '../components/Auth/ResetPassword';
import BookList from '../components/Book/BookList';
import BookListUser from '../components/Book/BookListUser';
import CategoryList from '../components/Category/CategoryList';
import ReaderList from '../components/Reader/ReaderList';
import TransactionList from '../components/Transaction/TransactionList';
import BorrowRequestList from '../components/Transaction/BorrowRequestList';
import UserBorrowForm from '../components/Transaction/UserBorrowForm';
import TransactionHistory from '../components/Transaction/TransactionHistory';
import OverdueManagement from '../components/Transaction/OverdueManagement';
import UserProfile from '../components/User/UserProfile';
import UserHistory from '../components/User/UserHistory';
import InventoryStats from '../components/Stats/InventoryStats';
import UserStats from '../components/Stats/UserStats';

const BorrowPage: React.FC = () => {
  const [showBorrowForm, setShowBorrowForm] = useState(false);

  return (
    <>
      <BookListUser />
      <button 
        className="floating-btn" 
        onClick={() => setShowBorrowForm(true)}
      >
        + Tạo đơn mượn
      </button>
      {showBorrowForm && (
        <UserBorrowForm onClose={() => setShowBorrowForm(false)} />
      )}
    </>
  );
};

const AppRouter: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={
            <Layout>
              {user?.role === 'admin' ? <Navigate to="/books" /> : <Navigate to="/books-user" />}
            </Layout>
          } />

          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/books" element={<Layout><BookList /></Layout>} />
            <Route path="/categories" element={<Layout><CategoryList /></Layout>} />
            <Route path="/readers" element={<Layout><ReaderList /></Layout>} />
            <Route path="/transactions" element={<Layout><TransactionList /></Layout>} />
            <Route path="/borrow-requests" element={<Layout><BorrowRequestList /></Layout>} />
            <Route path="/overdue" element={<Layout><OverdueManagement /></Layout>} />
            <Route path="/history" element={<Layout><TransactionHistory /></Layout>} />
            <Route path="/stats" element={<Layout><InventoryStats /></Layout>} />
          </Route>

          <Route path="/books-user" element={<Layout><BookListUser /></Layout>} />
          <Route path="/borrow" element={<Layout><BorrowPage /></Layout>} />
          <Route path="/profile" element={<Layout><UserProfile /></Layout>} />
          <Route path="/user-history" element={<Layout><UserHistory /></Layout>} />
          <Route path="/user-stats" element={<Layout><UserStats /></Layout>} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
