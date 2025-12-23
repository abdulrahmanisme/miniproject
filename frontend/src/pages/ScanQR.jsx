import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { startAuthentication } from '@simplewebauthn/browser';

export default function ScanQR({ user }) {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 });
    scanner.render(async (decoded) => {
      setMessage('QR scanned, verifying...');
      scanner.clear();
      try {
        const token = decoded;
        const { data: challengeOptions } = await axios.post('/webauthn/auth-challenge', { userId: user.id });
        const assertionResponse = await startAuthentication(challengeOptions);
        await axios.post('/webauthn/auth-verify', { userId: user.id, assertionResponse });
        await axios.post('/attendance/mark', { token });
        navigate('/attend-success');
      } catch (e) {
        setMessage(e.response?.data?.message || 'Failed to mark');
      }
    });
    return () => scanner.clear();
  }, [navigate, user.id]);

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Scan QR</h1>
      <div id="reader" className="w-full" />
      {message && <p>{message}</p>}
    </div>
  );
}
