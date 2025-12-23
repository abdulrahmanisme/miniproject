import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  console.log('Login component rendering');
  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', { email, password });
      onLogin(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '2px solid green', padding: '20px', backgroundColor: 'white' }} className="max-w-sm mx-auto bg-white p-6 rounded shadow mt-10">
      <h1 style={{ color: 'black' }} className="text-2xl font-bold mb-4 text-center text-gray-800">Smart Classroom Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}
        <button 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <div className="text-xs text-gray-500 text-center mt-3">
          <p>Demo: student@example.com / password123</p>
        </div>
      </form>
    </div>
  );
}
