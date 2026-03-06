import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdQuiz,
  MdEmail,
  MdLock,
  MdAdminPanelSettings,
  MdSchool,
  MdVisibility,
  MdVisibilityOff,
  MdEdit,
  MdCheckCircle,
  MdBarChart,
  MdPerson,
} from 'react-icons/md';
import styles from '../css/LoginPage.module.css';

const DEMO_ACCOUNTS = [
  {
    id: 1,
    email: 'admin@quiz.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin',
    avatar: <MdAdminPanelSettings size={24} />
  },
  {
    id: 2,
    email: 'user@quiz.com',
    password: 'user123',
    role: 'user',
    name: 'Nguyễn Văn A',
    avatar: <MdPerson size={24} />
  }
];

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDemoAccount, setSelectedDemoAccount] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      const account = DEMO_ACCOUNTS.find(
        acc => acc.email === email && acc.password === password
      );

      if (account) {
        const userInfo = {
          id: account.id,
          email: account.email,
          name: account.name,
          role: account.role,
          avatar: account.avatar,
          loggedInAt: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        
        if (account.role === 'admin') {
          navigate('/quiz/editor');
        } else {
          navigate('/quiz/list');
        }
      } else {
        setError('Email hoặc mật khẩu không đúng');
      }
      
      setLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setSelectedDemoAccount(account.email);
    
    setTimeout(() => {
      const loginEvent = new Event('submit', { cancelable: true });
      document.getElementById('loginForm').dispatchEvent(loginEvent);
    }, 100);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      {/* Left Side - Branding */}
      <div className={styles.brandSide}>
        <div className={styles.brandContent}>
          <MdQuiz size={80} className={styles.brandIcon} />
          <h1>Quiz Editor</h1>
          <p>Tạo và làm quiz trực tuyến</p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <MdEdit size={32} />
              </div>
              <div>
                <h3>Tạo quiz dễ dàng</h3>
                <p>Admin có thể tạo quiz với nhiều câu hỏi</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <MdCheckCircle size={32} />
              </div>
              <div>
                <h3>Làm bài trực tuyến</h3>
                <p>User có thể làm quiz và xem kết quả ngay</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <MdBarChart size={32} />
              </div>
              <div>
                <h3>Thống kê chi tiết</h3>
                <p>Xem kết quả và phân tích câu trả lời</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <h2>Đăng nhập</h2>
          <p className={styles.subtitle}>Sử dụng tài khoản demo bên dưới</p>

          {/* Demo Accounts */}
          <div className={styles.demoAccounts}>
            <h4>Tài khoản demo:</h4>
            <div className={styles.demoButtons}>
              <button
                onClick={() => handleDemoLogin(DEMO_ACCOUNTS[0])}
                className={`${styles.demoBtn} ${styles.adminBtn} ${
                  selectedDemoAccount === DEMO_ACCOUNTS[0].email ? styles.selected : ''
                }`}
              >
                <MdAdminPanelSettings size={24} />
                <div>
                  <strong>Admin</strong>
                  <span>admin@quiz.com / admin123</span>
                </div>
              </button>

              <button
                onClick={() => handleDemoLogin(DEMO_ACCOUNTS[1])}
                className={`${styles.demoBtn} ${styles.userBtn} ${
                  selectedDemoAccount === DEMO_ACCOUNTS[1].email ? styles.selected : ''
                }`}
              >
                <MdSchool size={24} />
                <div>
                  <strong>User</strong>
                  <span>user@quiz.com / user123</span>
                </div>
              </button>
            </div>
          </div>

          <div className={styles.divider}>
            <span>hoặc nhập thông tin</span>
          </div>

          <form id="loginForm" onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrapper}>
                <MdEmail className={styles.inputIcon} size={20} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nhập email của bạn"
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Mật khẩu</label>
              <div className={styles.inputWrapper}>
                <MdLock className={styles.inputIcon} size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={styles.passwordToggle}
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className={styles.loginBtn}
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className={styles.demoNote}>
            <MdCheckCircle size={18} />
            <p>Đây là trang demo, bạn có thể dùng 2 tài khoản trên để đăng nhập</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;