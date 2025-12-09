import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './Auth.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Quên Mật Khẩu</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {success ? (
          <div className="success-message">
            <p>✅ Đã gửi email khôi phục mật khẩu!</p>
            <p style={{ marginTop: '15px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Vui lòng kiểm tra email của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
            </p>
            <div style={{ marginTop: '25px' }}>
              <Link to="/login" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Quay lại Đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ 
              marginBottom: '25px', 
              color: 'var(--text-secondary)', 
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn link để đặt lại mật khẩu.
            </p>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Gửi Email Khôi Phục'}
            </button>
          </form>
        )}

        <div className="auth-link">
          Nhớ mật khẩu? <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;