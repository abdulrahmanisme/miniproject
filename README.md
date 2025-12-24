# 🎓 Smart Attendance System

A modern, secure attendance management system using QR codes and WebAuthn biometric authentication.

## 🚀 Features

### For Students
- ✅ Scan QR codes to mark attendance
- 🔐 Biometric authentication (fingerprint/face ID)
- 📊 View attendance history and statistics
- 📱 Mobile-friendly interface

### For Teachers
- 📝 Create lecture sessions
- 🎯 Generate time-limited QR codes
- 👥 Real-time attendance tracking
- 📈 View student attendance lists

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **html5-qrcode** - QR code scanning
- **@simplewebauthn/browser** - WebAuthn client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **@simplewebauthn/server** - WebAuthn server
- **QRCode** - QR generation

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB running (local or cloud)

### 1. Clone the repository
```bash
cd E:\Attendance-project
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

**Backend** (`server/.env` - already configured):
```env
MONGO_URI=mongodb+srv://arahmanforge_db_user:516XeLQSXWYuzHUT@bioattendance.oyna1wl.mongodb.net/attendance
JWT_SECRET=devsecret
CLIENT_URL=http://localhost:5173
ORIGIN=http://localhost:5173
RP_ID=localhost
PORT=4000
```

**Frontend** (`frontend/.env` - already configured):
```env
VITE_API_URL=http://localhost:4000
```

### 5. Seed the Database (Optional)
```bash
cd server
npm run seed
```

This creates demo users:
- Student: `student@test.com` / `password123`
- Teacher: `teacher@test.com` / `password123`

## 🎯 Running the Application

### Start Backend (Terminal 1)
```bash
cd server
npm run dev
```
Backend runs on: http://localhost:4000

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

## 📱 Usage Guide

### For Students:

1. **Login** at http://localhost:5173/login
   - Use: `student@test.com` / `password123`

2. **Register Biometric** (First time only)
   - Click "Register Biometric" on dashboard
   - Follow browser prompts for fingerprint/face ID
   - This enables secure attendance confirmation

3. **Mark Attendance**
   - Click "Scan QR Code"
   - Allow camera access
   - Point camera at teacher's QR code
   - Complete biometric verification
   - Done! ✅

4. **View Attendance**
   - Check your attendance history on dashboard
   - See attendance percentage

### For Teachers:

1. **Login** at http://localhost:5173/login
   - Use: `teacher@test.com` / `password123`

2. **Create Lecture**
   - Click "Create New Lecture"
   - Enter subject name and duration
   - QR code generated automatically

3. **Display QR Code**
   - Show QR on projector/screen
   - Students can scan from their devices
   - Watch real-time attendance updates

4. **Monitor Attendance**
   - See students as they mark attendance
   - Click "Refresh Attendance" to update list
   - QR expires after set duration

## 🔒 Security Features

- **JWT Authentication**: HTTP-only cookies
- **WebAuthn Biometric**: FIDO2 standard
- **Time-Limited QR Codes**: Expire after set duration
- **One Attendance Per Lecture**: Prevents duplicates
- **Secure Token Verification**: Prevents proxy attendance

## 🎨 Key Features

### Modern UI/UX
- Gradient backgrounds and smooth animations
- Responsive design (mobile & desktop)
- Real-time updates
- Loading states and error handling
- Success celebrations

### Biometric Authentication
- Fingerprint recognition
- Face ID support
- Secure credential storage
- Privacy-focused (no biometric data stored on server)

### QR Code System
- Auto-expiring tokens
- Embedded lecture information
- Fast scanning
- Mobile-optimized

## 🐛 Troubleshooting

### Camera Not Working
- Ensure HTTPS or localhost
- Check browser permissions
- Try different browser (Chrome/Edge recommended)

### Biometric Not Working
- Use modern browser (Chrome 90+, Safari 14+, Edge 90+)
- Ensure device has biometric hardware
- Enable biometric in OS settings

### Backend Connection Issues
- Check MongoDB connection
- Verify backend is running on port 4000
- Check CORS settings

## 📁 Project Structure

```
Attendance-project/
├── frontend/
│   ├── src/
│   │   ├── api/           # API utilities
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/
    ├── src/
    │   ├── config/        # Configuration
    │   ├── middleware/    # Auth middleware
    │   ├── models/        # Database models
    │   ├── routes/        # API routes
    │   ├── utils/         # Utilities
    │   └── app.js         # Express app
    ├── server.js          # Entry point
    └── package.json
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Set environment variable: `VITE_API_URL`

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy from `server` folder
3. Ensure MongoDB accessible

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### WebAuthn
- `POST /webauthn/register-challenge` - Get registration options
- `POST /webauthn/register-verify` - Verify registration
- `POST /webauthn/auth-challenge` - Get authentication options
- `POST /webauthn/auth-verify` - Verify authentication

### Lectures
- `POST /lecture/create` - Create lecture (teacher only)
- `GET /lecture/:id` - Get lecture details

### Attendance
- `POST /attendance/mark` - Mark attendance
- `GET /attendance/student` - Get student attendance
- `GET /attendance/lecture/:id` - Get lecture attendance (teacher only)

## 🎯 Future Enhancements

- [ ] Admin dashboard
- [ ] Attendance reports/analytics
- [ ] Email notifications
- [ ] Bulk attendance export
- [ ] Multi-factor authentication
- [ ] PWA support
- [ ] Dark mode

## 📄 License

MIT License - feel free to use for educational purposes!

## 👨‍💻 Developer Notes

- All components use modern React hooks
- Tailwind CSS for rapid styling
- Error boundaries for stability
- Accessible UI components
- SEO-friendly structure

## 🤝 Contributing

Contributions welcome! Please follow:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📧 Support

For issues or questions:
- Check troubleshooting section
- Review API documentation
- Test with demo credentials

---

Made with ❤️ for smart classrooms
