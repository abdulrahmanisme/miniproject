import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { markAttendance } from '../api/attendance';
import { authenticateBiometric, isWebAuthnSupported } from '../api/webauthn';

function ScanQR({ user }) {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [scannedToken, setScannedToken] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [showSkipOption, setShowSkipOption] = useState(false); // Show skip button on biometric error
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const scannerInitialized = useRef(false);
  const processingRef = useRef(false); // Flag to prevent duplicate scans

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (scannerInitialized.current) return;
    scannerInitialized.current = true;
    
    startScanner();
    
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setScanning(true);
      setError('');
      setShowSkipOption(false); // Reset skip option

      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;

      // Try to get camera list first
      const devices = await Html5Qrcode.getCameras();
      console.log('Available cameras:', devices);

      const config = {
        fps: 20, // Increased from 10 for faster detection
        qrbox: { width: 300, height: 300 }, // Larger scan area
        aspectRatio: 1.0,
        disableFlip: false, // Allow flipping for better detection
        videoConstraints: {
          facingMode: { ideal: 'environment' }, // Prefer back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      // Use back camera if available, otherwise use first camera
      const cameraId = devices.length > 0 ? devices[devices.length - 1].id : { facingMode: 'environment' };

      await html5QrCode.start(
        cameraId,
        config,
        onScanSuccess,
        onScanError
      );
      
      console.log('QR Scanner started successfully');
    } catch (err) {
      console.error('Scanner error:', err);
      setError('Failed to start camera. Please allow camera permissions and try again.');
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        const scanner = html5QrCodeRef.current;
        
        // Check if scanner is running before stopping
        if (scanner.isScanning) {
          await scanner.stop();
        }
        
        // Clear the scanner
        await scanner.clear();
        html5QrCodeRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    setScanning(false);
  };

  const onScanSuccess = async (decodedText) => {
    // Prevent re-entry while processing
    if (processingRef.current) {
      console.log('Already processing QR code, ignoring duplicate scan');
      return;
    }
    
    processingRef.current = true;
    console.log('QR Code detected:', decodedText);
    
    // Stop scanning immediately
    await stopScanner();
    setScannedToken(decodedText);
    
    // Process the scanned token (SKIP BIOMETRIC FOR TESTING)
    await processAttendance(decodedText, true);
  };

  const onScanError = (errorMessage) => {
    // Ignore scanning errors (happens continuously while scanning)
    // Only log occasionally for debugging
    if (Math.random() < 0.01) { // Log 1% of errors
      console.log('Scanning...', errorMessage);
    }
  };

  const processAttendance = async (token, skipBiometric = true) => {
    setVerifying(true);
    setError('');
    setShowSkipOption(false); // Reset skip option

    try {
      console.log('User object:', user);
      console.log('Skip biometric:', skipBiometric);
      console.log('⚠️ TESTING MODE: Skipping biometric verification');
      
      // TESTING MODE: Skip all biometric checks
      // Step 1 & 2: Biometric checks disabled for testing

      // Step 3: Mark attendance
      console.log('Marking attendance...');
      await markAttendance(token);
      
      // Success! Navigate to success page
      console.log('✅ Attendance marked successfully!');
      navigate('/success');
    } catch (err) {
      console.error('Attendance marking error:', err);
      setError(err.response?.data?.message || 'Failed to mark attendance. The QR code may be expired.');
      setVerifying(false);
      setShowSkipOption(false);
      
      // Reset processing flag and restart scanner after error
      processingRef.current = false;
      setTimeout(async () => {
        setScannedToken(null);
        scannerInitialized.current = false;
        await startScanner();
      }, 3000);
    }
  };

  // Handler for skip biometric button
  const handleSkipBiometric = async () => {
    if (scannedToken) {
      setShowSkipOption(false);
      await processAttendance(scannedToken, true); // true = skip biometric
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <button
            onClick={() => navigate('/student')}
            className="btn-secondary mb-4"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          
          <div className="inline-block p-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-full mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Scan QR Code</h1>
          <p className="text-gray-600">Point your camera at the teacher's QR code</p>
        </div>

        {/* Scanner Card */}
        <div className="card">
          {/* QR Scanner */}
          <div 
            id="qr-reader" 
            className="rounded-lg overflow-hidden mb-4 bg-gray-900"
            style={{ maxWidth: '100%' }}
          />

          {/* Status Messages */}
          {scanning && !scannedToken && (
            <div className="text-center p-4 bg-blue-50 rounded-lg mb-4 animate-pulse">
              <p className="text-blue-800 font-medium">📷 Scanning for QR code...</p>
              <p className="text-blue-600 text-sm mt-1">Hold your device 15-30cm from the QR code</p>
              <p className="text-blue-500 text-xs mt-1">Tip: Increase screen brightness for better detection</p>
            </div>
          )}

          {scannedToken && verifying && (
            <div className="text-center p-4 bg-yellow-50 rounded-lg mb-4">
              <div className="loading-spinner w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-yellow-800 font-medium">Verifying attendance...</p>
              {user.credentialId && (
                <p className="text-yellow-600 text-sm mt-1">Complete biometric verification</p>
              )}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4 animate-slide-up">
              <p className="text-red-800 font-medium">{error}</p>
              
              {/* Show Skip Biometric button when there's a biometric error */}
              {showSkipOption && (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleSkipBiometric}
                    className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                  >
                    🧪 Skip Biometric (Testing Mode)
                  </button>
                  <button
                    onClick={async () => {
                      setShowSkipOption(false);
                      setError('');
                      processingRef.current = false;
                      setScannedToken(null);
                      scannerInitialized.current = false;
                      await startScanner();
                    }}
                    className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Instructions
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Position the QR code within the camera frame</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Make sure the QR code is clearly visible and well-lit</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>The scan will happen automatically when detected</span>
              </li>
              {user.credentialId && (
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>You'll be prompted for biometric verification</span>
                </li>
              )}
            </ul>
          </div>

          {/* Biometric Warning */}
          {!user.credentialId && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-800 text-sm">
                <strong>Note:</strong> You haven't registered biometric authentication yet. 
                <button
                  onClick={() => navigate('/student')}
                  className="text-orange-600 hover:text-orange-700 font-semibold ml-1"
                >
                  Register now →
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScanQR;
