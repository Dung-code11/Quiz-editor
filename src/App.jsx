import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import QuizEditor from './pages/QuizEditor';
import QuizList from './pages/QuizList';
import QuizTake from './pages/QuizTake';
import QuizResult from './pages/QuizResult';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('currentUser') !== null;
  };

  const getUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      return user?.role;
    } catch {
      return null;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route 
          path="/" 
          element={
            isAuthenticated() ? (
              getUserRole() === 'admin' ? (
                <Navigate to="/quiz/editor" replace />
              ) : (
                <Navigate to="/quiz/list" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Admin routes - chỉ admin mới vào được */}
        <Route
          path="/quiz/editor"
          element={
            <ProtectedRoute allowedRole="admin">
              <QuizEditor />
            </ProtectedRoute>
          }
        />

        {/* User routes - cả user và admin đều vào được */}
        <Route
          path="/quiz/list"
          element={
            <ProtectedRoute>
              <QuizList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/take/:id"
          element={
            <ProtectedRoute>
              <QuizTake />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/result/:id"
          element={
            <ProtectedRoute>
              <QuizResult />
            </ProtectedRoute>
          }
        />
        <Route 
          path="*" 
          element={
            <div style={{ 
              textAlign: 'center', 
              padding: '50px',
              fontFamily: 'Arial, sans-serif'
            }}>
              <h1 style={{ fontSize: '3em', color: '#667eea' }}>404</h1>
              <p style={{ fontSize: '1.2em', color: '#718096' }}>
                Trang bạn tìm không tồn tại
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  fontSize: '1em',
                  cursor: 'pointer',
                  marginTop: '20px'
                }}
              >
                Về trang chủ
              </button>
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;