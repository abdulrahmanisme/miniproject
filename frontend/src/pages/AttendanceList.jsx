import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function AttendanceList() {
  const { lectureId } = useParams();
  const [list, setList] = useState([]);

  useEffect(() => {
    axios.get(`/attendance/lecture/${lectureId}`).then((res) => setList(res.data));
  }, [lectureId]);

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Attendance</h1>
      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Student</th>
              <th className="p-2 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row._id} className="border-t">
                <td className="p-2">{row.studentId?.name}</td>
                <td className="p-2">{new Date(row.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
