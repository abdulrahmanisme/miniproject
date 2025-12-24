import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function AttendanceSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Confetti effect
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Create simple confetti effect with emoji
      if (window.confetti) {
        window.confetti(Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        window.confetti(Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Animation */}
        <div className="animate-fade-in">
          <div className="inline-block mb-6 animate-bounce">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-slide-up">
            Attendance Marked! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Your presence has been successfully recorded
          </p>

          {/* Success Details */}
          <div className="card mb-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">
                  Marked at: <strong>{new Date().toLocaleTimeString()}</strong>
                </span>
              </div>
              
              <div className="flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700">
                  Date: <strong>{new Date().toLocaleDateString()}</strong>
                </span>
              </div>

              <div className="pt-4 border-t border-green-200">
                <p className="text-green-800 font-medium">✓ Biometric Verified</p>
                <p className="text-green-700 text-sm mt-1">Your identity has been confirmed</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => navigate('/student')}
              className="btn-primary w-full"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Dashboard
            </button>

            <button
              onClick={() => navigate('/scan')}
              className="btn-secondary w-full"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Scan Another QR
            </button>
          </div>

          {/* Fun Message */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-blue-800 text-sm">
              💡 <strong>Pro Tip:</strong> Check your dashboard to see your attendance statistics!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceSuccess;
