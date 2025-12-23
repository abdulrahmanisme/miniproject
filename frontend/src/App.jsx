import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import RegisterBiometric from './pages/RegisterBiometric.jsx';
import ScanQR from './pages/ScanQR.jsx';
import AttendSuccess from './pages/AttendSuccess.jsx';
import CreateLecture from './pages/CreateLecture.jsx';
import ShowQR from './pages/ShowQR.jsx';
import AttendanceList from './pages/AttendanceList.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import TailwindTest from './pages/TailwindTest.jsx';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
axios.defaults.withCredentials = true;

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved) setUser(JSON.parse(saved));
    } catch (e) {
      console.error('Auth load error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, login, logout, loading };
}

function Protected({ roles, user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppLayout({ children, logout, user }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-4 mb-4 shadow rounded flex justify-between items-center">
         <h1 className="text-xl font-bold text-blue-600">Smart Classroom</h1>
         {user && <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>}
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const auth = useAuth();

  if (auth.loading) return <div>Loading auth...</div>;

  return (
    <AppLayout user={auth.user} logout={auth.logout}>
      <Routes>
        <Route path="/login" element={<Login onLogin={auth.login} />} />
        <Route path="/test" element={<TailwindTest />} />
        
        <Route path="/" element={<Dashboard user={auth.user} />} />
        
        <Route
          path="/register-biometric"
          element={
            <Protected user={auth.user} roles={['student']}>
              <RegisterBiometric user={auth.user} />
            </Protected>
          }
        />
        <Route
          path="/scan"
          element={
            <Protected user={auth.user} roles={['student']}>
              <ScanQR user={auth.user} />
            </Protected>
          }
        />
        <Route
          path="/attend-success"
          element={
            <Protected user={auth.user} roles={['student']}>
              <AttendSuccess />
            </Protected>
          }
        />
        <Route
          path="/create-lecture"
          element={
            <Protected user={auth.user} roles={['teacher']}>
              <CreateLecture />
            </Protected>
          }
        />
        <Route
          path="/show-qr/:token"
          element={
            <Protected user={auth.user} roles={['teacher']}>
              <ShowQR />
            </Protected>
          }
        />
        <Route
          path="/attendance/:lectureId"
          element={
            <Protected user={auth.user} roles={['teacher']}>
              <AttendanceList />
            </Protected>
          }
        />
        <Route
          path="/admin/users"
          element={
            <Protected user={auth.user} roles={['admin']}>
              <AdminUsers />
            </Protected>
          }
        />
      </Routes>
    </AppLayout>
  );
}
