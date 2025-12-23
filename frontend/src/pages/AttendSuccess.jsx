import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AttendSuccess() {
  const [list, setList] = useState([]);

  useEffect(() => {
    axios.get('/attendance/student').then((res) => setList(res.data));
  }, []);

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Your Attendance</h1>
      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Subject</th>
              <th className="p-2 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row._id} className="border-t">
                <td className="p-2">{row.lectureId?.subject}</td>
                <td className="p-2">{new Date(row.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
