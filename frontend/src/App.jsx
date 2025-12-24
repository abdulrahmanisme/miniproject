import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ScanQR from './pages/ScanQR';
import AttendanceSuccess from './pages/AttendanceSuccess';
import { getCurrentUser } from './api/auth';

// Helper function to get dashboard path based on role
function getDashboardPath(role) {
  switch (role) {
    case 'teacher':
      return '/teacher';
    case 'student':
      return '/student';
    case 'admin':
      return '/admin';
    default:
      return '/login';
  }
}

// Protected Route wrapper
function ProtectedRoute({ user, allowedRoles, children }) {
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If allowedRoles is specified, check if user's role is in the list
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }
  
  return children;
}

// Public Route wrapper (redirects if already logged in)
function PublicRoute({ user, children }) {
  if (user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute user={user}><Login setUser={setUser} /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute user={user}><Register /></PublicRoute>} />
        
        {/* Student Routes */}
        <Route 
          path="/student" 
          element={
            <ProtectedRoute user={user} allowedRoles={['student']}>
              <StudentDashboard user={user} setUser={setUser} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/scan" 
          element={
            <ProtectedRoute user={user} allowedRoles={['student']}>
              <ScanQR user={user} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/success" 
          element={
            <ProtectedRoute user={user} allowedRoles={['student']}>
              <AttendanceSuccess />
            </ProtectedRoute>
          } 
        />
        
        {/* Teacher Routes (teachers and admins) */}
        <Route 
          path="/teacher" 
          element={
            <ProtectedRoute user={user} allowedRoles={['teacher']}>
              <TeacherDashboard user={user} setUser={setUser} />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <AdminDashboard user={user} setUser={setUser} />
            </ProtectedRoute>
          } 
        />
        
        {/* Default Route */}
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to={getDashboardPath(user.role)} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
