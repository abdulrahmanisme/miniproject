import { useState } from 'react';
import axios from 'axios';
import { startRegistration } from '@simplewebauthn/browser';

export default function RegisterBiometric({ user }) {
  const [status, setStatus] = useState('');

  const register = async () => {
    setStatus('Requesting challenge...');
    const { data: options } = await axios.post('/webauthn/register-challenge', { userId: user.id });
    const attestationResponse = await startRegistration(options);
    setStatus('Verifying...');
    await axios.post('/webauthn/register-verify', { userId: user.id, attestationResponse });
    setStatus('Biometric registered!');
  };

  return (
    <div className="max-w-md bg-white p-4 rounded shadow">
      <h1 className="text-xl font-semibold mb-3">Register Biometric</h1>
      <p className="text-sm text-gray-600 mb-3">This is a one-time setup.</p>
      <button onClick={register} className="bg-blue-600 text-white px-4 py-2 rounded">
        Start Registration
      </button>
      {status && <p className="mt-3 text-sm">{status}</p>}
    </div>
  );
}
