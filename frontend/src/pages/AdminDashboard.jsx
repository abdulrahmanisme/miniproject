import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../api/auth';

function AdminDashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalLectures: 0,
    totalAttendances: 0
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      console.log('Fetching admin data...');
      
      // Fetch all users
      const usersRes = await axios.get('http://localhost:4000/admin/users', { withCredentials: true });
      console.log('Users response:', usersRes.data);
      const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];
      setUsers(usersData);
      
      // Fetch all lectures
      const lecturesRes = await axios.get('http://localhost:4000/admin/lectures', { withCredentials: true });
      console.log('Lectures response:', lecturesRes.data);
      const lecturesData = Array.isArray(lecturesRes.data) ? lecturesRes.data : [];
      setLectures(lecturesData);
      
      // Fetch all attendance records
      const attendanceRes = await axios.get('http://localhost:4000/admin/attendances', { withCredentials: true });
      console.log('Attendances response:', attendanceRes.data);
      const attendancesData = Array.isArray(attendanceRes.data) ? attendanceRes.data : [];
      setAttendances(attendancesData);

      // Calculate stats safely
      const studentCount = usersData.filter(u => u.role === 'student').length;
      const teacherCount = usersData.filter(u => u.role === 'teacher').length;
      
      const newStats = {
        totalUsers: usersData.length,
        totalStudents: studentCount,
        totalTeachers: teacherCount,
        totalLectures: lecturesData.length,
        totalAttendances: attendancesData.length
      };
      
      console.log('Calculated stats:', newStats);
      setStats(newStats);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching admin data:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login');
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`http://localhost:4000/admin/users/${userId}`, { withCredentials: true });
      alert('User deleted successfully');
      fetchAllData();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const deleteLecture = async (lectureId) => {
    if (!confirm('Are you sure you want to delete this lecture?')) return;
    
    try {
      await axios.delete(`http://localhost:4000/lecture/${lectureId}`, { withCredentials: true });
      alert('Lecture deleted successfully');
      fetchAllData();
    } catch (error) {
      alert('Failed to delete lecture');
    }
  };

  const deleteAttendance = async (attendanceId) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return;
    
    try {
      await axios.delete(`http://localhost:4000/admin/attendances/${attendanceId}`, { withCredentials: true });
      alert('Attendance record deleted successfully');
      fetchAllData();
    } catch (error) {
      alert('Failed to delete attendance');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Full System Control {lastUpdate && <span className="text-green-600">• Live</span>}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchAllData} 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center"
                title="Refresh data"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <div className="text-right">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-purple-600 font-semibold">Administrator</p>
              </div>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {lastUpdate && (
          <div className="mb-4 text-sm text-gray-600 flex items-center justify-end">
            <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="3"/>
            </svg>
            Last updated: {lastUpdate.toLocaleTimeString()} • Click Refresh button to update data
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Students</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalStudents}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Teachers</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalTeachers}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Lectures</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalLectures}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-pink-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Attendances</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalAttendances}</p>
              </div>
              <div className="p-3 bg-pink-100 rounded-lg">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium transition ${activeTab === 'overview' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-medium transition ${activeTab === 'users' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
            >
              Users Management
            </button>
            <button
              onClick={() => setActiveTab('lectures')}
              className={`px-6 py-4 font-medium transition ${activeTab === 'lectures' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
            >
              Lectures
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-6 py-4 font-medium transition ${activeTab === 'attendance' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
            >
              Attendance Records
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">System Overview</h3>
                  <p className="text-gray-600 mb-4">Welcome to the Admin Dashboard. You have full control over the attendance system.</p>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Quick Actions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button onClick={() => setActiveTab('users')} className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition text-left">
                        <p className="font-medium text-purple-600">Manage Users</p>
                        <p className="text-sm text-gray-600 mt-1">View and control all system users</p>
                      </button>
                      <button onClick={() => setActiveTab('lectures')} className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition text-left">
                        <p className="font-medium text-purple-600">View Lectures</p>
                        <p className="text-sm text-gray-600 mt-1">Monitor all lecture sessions</p>
                      </button>
                      <button onClick={() => setActiveTab('attendance')} className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition text-left">
                        <p className="font-medium text-purple-600">Attendance Records</p>
                        <p className="text-sm text-gray-600 mt-1">Track all attendance entries</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Users Management</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Biometric</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map(u => (
                        <tr key={u._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{u.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              u.role === 'student' ? 'bg-blue-100 text-blue-800' : 
                              u.role === 'teacher' ? 'bg-green-100 text-green-800' : 
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {u.credentialId ? (
                              <span className="text-green-600 text-sm">✓ Registered</span>
                            ) : (
                              <span className="text-gray-400 text-sm">Not registered</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => deleteUser(u._id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Lectures Tab */}
            {activeTab === 'lectures' && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">All Lectures</h3>
                <div className="grid gap-4">
                  {lectures.map(lecture => (
                    <div key={lecture._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{lecture.subject}</h4>
                          <p className="text-sm text-gray-600 mt-1">QR Token: {lecture.qrToken?.substring(0, 20)}...</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Teacher: {lecture.teacherId?.name || 'Unknown'}</span>
                            <span>•</span>
                            <span>Expires: {new Date(lecture.expiresAt).toLocaleString()}</span>
                            <span>•</span>
                            <span className={new Date(lecture.expiresAt) > new Date() ? 'text-green-600' : 'text-red-600'}>
                              {new Date(lecture.expiresAt) > new Date() ? 'Active' : 'Expired'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteLecture(lecture._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Attendance Records</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lecture</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {attendances.map(att => (
                        <tr key={att._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{att.student?.name || 'Unknown'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{att.lecture?.title || 'Unknown'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{new Date(att.timestamp).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            {att.biometricVerified ? (
                              <span className="text-green-600 text-sm">✓ Verified</span>
                            ) : (
                              <span className="text-orange-600 text-sm">Manual</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => deleteAttendance(att._id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
