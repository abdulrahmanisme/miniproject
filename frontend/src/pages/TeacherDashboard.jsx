import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import { createLecture } from '../api/lecture';
import { getLectureAttendance } from '../api/attendance';

function TeacherDashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState(10);
  const [loading, setLoading] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (currentLecture) {
      startTimer();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentLecture]);

  const startTimer = () => {
    const interval = setInterval(() => {
      const now = new Date();
      const expiry = new Date(currentLecture.expiresAt);
      const diff = expiry - now;

      if (diff <= 0) {
        clearInterval(interval);
        setCurrentLecture(null);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimer(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);
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

  const handleCreateLecture = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const lecture = await createLecture(subject, duration);
      setCurrentLecture(lecture);
      setShowCreateModal(false);
      setSubject('');
      setDuration(10);
      
      // Fetch attendance for this lecture
      fetchAttendance(lecture.lectureId);
    } catch (error) {
      alert('Failed to create lecture: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (lectureId) => {
    try {
      const data = await getLectureAttendance(lectureId);
      setAttendanceList(data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    }
  };

  const refreshAttendance = () => {
    if (currentLecture) {
      fetchAttendance(currentLecture.lectureId);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your lectures and attendance</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* Create Lecture Button */}
        {!currentLecture && (
          <div className="mb-8">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary text-lg py-4 px-8"
            >
              <svg className="w-6 h-6 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Lecture
            </button>
          </div>
        )}

        {/* Active Lecture Card */}
        {currentLecture && (
          <div className="card mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 animate-slide-up">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* QR Code Section */}
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Active Lecture</h3>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-semibold text-gray-800">{currentLecture.subject || 'Lecture'}</h4>
                    <p className="text-sm text-gray-600 mt-1">Students can scan this QR code</p>
                  </div>
                  
                  {/* QR Code Display */}
                  <div className="bg-white p-4 rounded-lg border-4 border-blue-500 mx-auto w-fit">
                    <img 
                      src={currentLecture.qrDataUrl} 
                      alt="QR Code" 
                      className="w-64 h-64 mx-auto"
                    />
                  </div>

                  {/* Timer */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Time Remaining</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{timer}</p>
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={refreshAttendance}
                    className="btn-secondary w-full mt-4"
                  >
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Attendance
                  </button>
                </div>
              </div>

              {/* Attendance List Section */}
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Present Students ({attendanceList.length})
                </h3>
                <div className="bg-white rounded-xl shadow-lg p-6 max-h-96 overflow-y-auto">
                  {attendanceList.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-gray-600">No students have marked attendance yet</p>
                      <p className="text-gray-500 text-sm mt-2">They will appear here as they scan the QR code</p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {attendanceList.map((record, index) => (
                        <li 
                          key={record._id} 
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 animate-slide-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                              {record.studentId?.name?.charAt(0).toUpperCase() || 'S'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {record.studentId?.name || 'Unknown Student'}
                              </p>
                              <p className="text-sm text-gray-600">
                                {record.studentId?.email || ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="badge-success">Present</span>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(record.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions Card */}
        <div className="card bg-gradient-to-r from-purple-50 to-pink-50">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📚 How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Create Lecture</h4>
              <p className="text-sm text-gray-600">Click "Create New Lecture" and enter subject details</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Show QR Code</h4>
              <p className="text-sm text-gray-600">Display the generated QR code to students</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Track Attendance</h4>
              <p className="text-sm text-gray-600">Watch as students mark their attendance in real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Lecture Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Lecture</h2>
            
            <form onSubmit={handleCreateLecture} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g., Mathematics, Physics"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="60"
                  className="input-field"
                  placeholder="10"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                />
                <p className="text-sm text-gray-500 mt-1">QR code will expire after this duration</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? 'Creating...' : 'Create Lecture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
