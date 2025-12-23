import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });

  const load = async () => {
    const res = await axios.get('/attendance/student'); // placeholder fetch for auth
    setUsers(res.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await axios.post('/auth/register', form);
    setForm({ name: '', email: '', password: '', role: 'student' });
    // In real app, fetch users from admin endpoint
  };

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Admin - Create User</h1>
      <form onSubmit={submit} className="grid gap-2 max-w-md bg-white p-4 rounded shadow">
        <input
          className="border p-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="border p-2 rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-blue-600 text-white py-2 rounded">Create</button>
      </form>
    </div>
  );
}
