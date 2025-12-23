import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateLecture() {
  const [subject, setSubject] = useState('Math');
  const [duration, setDuration] = useState(10);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await axios.post('/lecture/create', { subject, durationMinutes: duration });
    navigate(`/show-qr/${encodeURIComponent(res.data.token)}`, { state: res.data });
  };

  return (
    <div className="max-w-md bg-white p-4 rounded shadow">
      <h1 className="text-xl font-semibold mb-3">Create Lecture</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
        />
        <input
          className="w-full border p-2 rounded"
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          placeholder="Duration minutes"
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Generate QR</button>
      </form>
    </div>
  );
}
