import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import { getStudentAttendance } from '../api/attendance';
import { registerBiometric, isWebAuthnSupported } from '../api/webauthn';

function StudentDashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [biometricMessage, setBiometricMessage] = useState('');
  const [hasBiometric, setHasBiometric] = useState(false);

  useEffect(() => {
    fetchAttendance();
    checkBiometric();
  }, []);

  const fetchAttendance = async () => {
    try {
      const data = await getStudentAttendance();
      setAttendance(data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkBiometric = () => {
    // Check if user has biometric registered (you'd get this from the user object)
    setHasBiometric(user.credentialId ? true : false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleRegisterBiometric = async () => {
    if (!isWebAuthnSupported()) {
      setBiometricMessage('WebAuthn is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    setBiometricLoading(true);
    setBiometricMessage('');

    try {
      // Use id field from backend response
      const userId = user.id || user._id;
      console.log('User object:', user);
      console.log('Using userId:', userId);
      
      if (!userId) {
        throw new Error('User ID not found. Please login again.');
      }
      
      await registerBiometric(userId);
      setBiometricMessage('Biometric registered successfully! ✓');
      setHasBiometric(true);
      
      // Update user in localStorage
      const updatedUser = { ...user, credentialId: 'registered' };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Registration error:', error);
      setBiometricMessage(`Registration failed: ${error.message}`);
    } finally {
      setBiometricLoading(false);
    }
  };

  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0;
    return 100; // Simplified - in real app, calculate based on total lectures
  };

  const attendancePercentage = calculateAttendancePercentage();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.email}!</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Classes</p>
                <p className="text-3xl font-bold mt-2">{attendance.length}</p>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Attendance Rate</p>
                <p className="text-3xl font-bold mt-2">{attendancePercentage}%</p>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`card ${hasBiometric ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-orange-500 to-orange-600'} text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-opacity-90 text-sm font-medium">Biometric Status</p>
                <p className="text-xl font-bold mt-2">{hasBiometric ? 'Registered ✓' : 'Not Registered'}</p>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Biometric Registration Card */}
        {!hasBiometric && (
          <div className="card mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 animate-slide-up">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-gray-800 mb-2">🔒 Setup Biometric Authentication</h3>
                <p className="text-gray-600">Register your fingerprint or face ID to confirm attendance securely</p>
              </div>
              <button
                onClick={handleRegisterBiometric}
                disabled={biometricLoading}
                className="btn-primary"
              >
                {biometricLoading ? (
                  <>
                    <div className="loading-spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Register Biometric
                  </>
                )}
              </button>
            </div>
            {biometricMessage && (
              <div className={`mt-4 p-3 rounded-lg ${biometricMessage.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {biometricMessage}
              </div>
            )}
          </div>
        )}

        {/* Scan QR Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/scan')}
            className="btn-primary w-full md:w-auto text-lg py-4 px-8"
          >
            <svg className="w-6 h-6 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Scan QR Code to Mark Attendance
          </button>
        </div>

        {/* Attendance History */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Attendance History
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="loading-spinner w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading attendance records...</p>
            </div>
          ) : attendance.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 text-lg">No attendance records yet</p>
              <p className="text-gray-500 text-sm mt-2">Start scanning QR codes in your classes!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-800">
                        {record.lectureId?.subject || 'Unknown'}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(record.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(record.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className="badge-success">Present</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
