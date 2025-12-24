export const rpID = process.env.RP_ID || 'localhost';
export const rpName = 'Smart Classroom Attendance';
// Remove trailing slash to match browser-sent origin
export const origin = (process.env.ORIGIN || 'http://localhost:5173').replace(/\/$/, '');
