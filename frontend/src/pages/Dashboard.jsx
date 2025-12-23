import { Link, Navigate } from 'react-router-dom';

export default function Dashboard({ user }) {
  console.log('Dashboard rendering, user:', user);
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {user.role === 'student' && (
        <div className="grid gap-3">
          <Link to="/register-biometric" className="bg-white p-4 rounded shadow">
            Register Biometric
          </Link>
          <Link to="/scan" className="bg-white p-4 rounded shadow">
            Scan QR
          </Link>
          <Link to="/attend-success" className="bg-white p-4 rounded shadow">
            Attendance Status
          </Link>
        </div>
      )}
      {user.role === 'teacher' && (
        <div className="grid gap-3">
          <Link to="/create-lecture" className="bg-white p-4 rounded shadow">
            Create Lecture
          </Link>
        </div>
      )}
      {user.role === 'admin' && (
        <div className="grid gap-3">
          <Link to="/admin/users" className="bg-white p-4 rounded shadow">
            Manage Users
          </Link>
        </div>
      )}
    </div>
  );
}
