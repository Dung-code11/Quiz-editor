import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLogout } from 'react-icons/md';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#f56565',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s',
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
      }}
      onMouseEnter={(e) => e.target.style.background = '#e53e3e'}
      onMouseLeave={(e) => e.target.style.background = '#f56565'}
    >
      <MdLogout size={18} />
      Đăng xuất
    </button>
  );
};

export default LogoutButton;