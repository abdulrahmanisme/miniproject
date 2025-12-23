# Smart Classroom Attendance System

## 🔧 **FIXES APPLIED**

### Issue: Blank White Screen on Frontend

**Root Cause:** Missing environment configuration files (`.env`)

**Fixed:**
1. ✅ Created `frontend/.env` with API URL configuration
2. ✅ Created `backend/.env` with MongoDB and auth settings  
3. ✅ Removed deprecated Mongoose connection options from `server.js`
4. ✅ Both servers now running properly

---

## 🚀 **HOW TO RUN THE PROJECT**

### **Prerequisites**
- Node.js 18+ installed
- MongoDB running on `mongodb://127.0.0.1:27017`

### **Step 1: Start MongoDB**
```bash
# Make sure MongoDB is running on your system
# Windows: Start MongoDB service
# Mac/Linux: sudo systemctl start mongod
```

### **Step 2: Backend Setup**
```bash
cd backend
npm install
npm run seed    # Seed demo users
npm run dev     # Starts on http://localhost:4000
```

### **Step 3: Frontend Setup**
Open a NEW terminal:
```bash
cd frontend
npm install
npm run dev     # Starts on http://localhost:5173
```

### **Step 4: Access the App**
Open browser: **http://localhost:5173**

---

## 👤 **DEMO CREDENTIALS**

### Student Account
- **Email:** student@example.com
- **Password:** password123

### Teacher Account
- **Email:** teacher@example.com
- **Password:** password123

### Admin Account
- **Email:** admin@example.com
- **Password:** password123

---

## 📁 **PROJECT STRUCTURE**

```
Attendance-project/
├── backend/
│   ├── .env                     # Backend config (created)
│   ├── server.js                # Express server
│   ├── seed.js                  # Seed demo users
│   └── src/
│       ├── models/
│       │   ├── User.js
│       │   ├── Lecture.js
│       │   └── Attendance.js
│       ├── routes/
│       │   ├── auth.js
│       │   ├── webauthn.js
│       │   ├── lecture.js
│       │   └── attendance.js
│       └── middleware/
│           └── authMiddleware.js
│
└── frontend/
    ├── .env                     # Frontend config (created)
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.cjs
    └── src/
        ├── main.jsx             # Entry point
        ├── App.jsx              # Main app with routing
        ├── index.css            # Tailwind imports
        └── pages/
            ├── Login.jsx
            ├── Dashboard.jsx
            ├── RegisterBiometric.jsx
            ├── ScanQR.jsx
            ├── AttendSuccess.jsx
            ├── CreateLecture.jsx
            ├── ShowQR.jsx
            ├── AttendanceList.jsx
            └── AdminUsers.jsx
```

---

## 🎯 **TESTING THE APP**

### **1. Student Flow**
1. Login as student
2. Go to "Register Biometric" → Register fingerprint/face
3. Go to "Scan QR" → Scan teacher's QR code
4. Confirm biometric → Attendance marked
5. View "Attendance Status" to see records

### **2. Teacher Flow**
1. Login as teacher
2. Go to "Create Lecture"
3. Enter subject (e.g., "Math") and duration (10 min)
4. QR code displayed
5. Students scan this QR
6. View attendance list for lecture

### **3. Admin Flow**
1. Login as admin
2. Create new users with roles

---

## 🔐 **SECURITY FEATURES**

- JWT authentication with httpOnly cookies
- WebAuthn biometric verification
- Short-lived QR tokens (expire after 10 min)
- One attendance per student per lecture (MongoDB unique index)
- CORS protection

---

## 📱 **MOBILE SUPPORT**

- Responsive Tailwind CSS design
- QR scanner works on mobile cameras
- WebAuthn works with phone fingerprint/Face ID

---

## ⚙️ **ENVIRONMENT VARIABLES**

### Backend (`.env`)
```env
MONGO_URI=mongodb://127.0.0.1:27017/attendance
JWT_SECRET=devsecret
CLIENT_URL=http://localhost:5173
ORIGIN=http://localhost:5173
RP_ID=localhost
PORT=4000
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:4000
```

---

## 🐛 **TROUBLESHOOTING**

### Blank Screen?
- ✅ Check both `.env` files exist
- ✅ Verify backend is running on port 4000
- ✅ Verify frontend is running on port 5173
- ✅ Check MongoDB is running
- ✅ Clear browser cache and reload

### MongoDB Connection Error?
- ✅ Start MongoDB service
- ✅ Check URI in `backend/.env`
- ✅ Run `npm run seed` to create demo users

### CORS Error?
- ✅ Verify `CLIENT_URL` in backend `.env` matches frontend URL
- ✅ Make sure `axios.defaults.withCredentials = true` in App.jsx

---

## 🛠 **TECH STACK**

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Axios
- html5-qrcode (QR scanning)
- @simplewebauthn/browser (biometrics)
- Vite (bundler)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- qrcode (QR generation)
- @simplewebauthn/server (WebAuthn)

---

## 📖 **API ENDPOINTS**

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### WebAuthn
- `POST /webauthn/register-challenge` - Get biometric registration challenge
- `POST /webauthn/register-verify` - Verify biometric registration
- `POST /webauthn/auth-challenge` - Get biometric auth challenge
- `POST /webauthn/auth-verify` - Verify biometric auth

### Lecture
- `POST /lecture/create` - Create lecture with QR
- `GET /lecture/:id` - Get lecture details

### Attendance
- `POST /attendance/mark` - Mark attendance
- `GET /attendance/student` - Get student's attendance
- `GET /attendance/lecture/:id` - Get lecture attendance list

---

## ✅ **STATUS**

- ✅ Backend API running
- ✅ Frontend running
- ✅ MongoDB connected
- ✅ Demo users seeded
- ✅ Environment configured
- ✅ All routes functional

**The app is now fully operational!** 🎉

Open http://localhost:5173 and start testing!
