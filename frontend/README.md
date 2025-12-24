# Smart Classroom Attendance - Frontend

Production-ready React app for classroom attendance with QR scanning and biometric authentication.

## 🚀 Deploy to Vercel

### Prerequisites
- Backend deployed and URL ready
- GitHub repository

### Steps

1. **Update Environment Variables**
   
   Create `.env` file:
   ```
   VITE_API_URL=https://your-backend.vercel.app
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production-ready frontend"
   git push origin main
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set **Root Directory** to `frontend`
   - Add environment variable:
     - `VITE_API_URL` = Your deployed backend URL
   - Deploy

4. **Update Backend Environment**
   
   After deployment, update your backend Vercel environment variables:
   ```
   CLIENT_URL=https://your-frontend.vercel.app
   ORIGIN=https://your-frontend.vercel.app
   RP_ID=your-frontend.vercel.app
   ```
   
   Redeploy backend for changes to take effect.

## 🔧 Features

- **Student Dashboard**
  - Register biometric (one-time)
  - Scan QR codes for attendance
  - View attendance history

- **Teacher Dashboard**
  - Create lecture sessions
  - Generate QR codes
  - View student attendance lists

- **Admin Dashboard**
  - Create users
  - Assign roles

## 🔒 Security

- JWT authentication with httpOnly cookies
- WebAuthn biometric confirmation
- Role-based routing
- CORS protection

## 🛠️ Local Development

```bash
npm install
cp .env.example .env
# Edit .env with your local backend URL
npm run dev
```

## 📱 Browser Requirements

- HTTPS required for WebAuthn (Vercel provides this)
- Modern browser with WebAuthn support
- Camera access for QR scanning

## 🎨 Tech Stack

- React 18
- React Router v6
- Tailwind CSS
- Vite
- Axios
- html5-qrcode
- @simplewebauthn/browser

## 📝 Demo Credentials

```
Student: student@example.com / password123
Teacher: teacher@example.com / password123
Admin: admin@example.com / password123
```

## ⚠️ Post-Deployment Checklist

- [ ] Backend deployed and running
- [ ] Frontend VITE_API_URL points to backend
- [ ] Backend CLIENT_URL, ORIGIN, RP_ID point to frontend
- [ ] WebAuthn working (requires HTTPS)
- [ ] QR scanning working
- [ ] Login/logout working
- [ ] All role-based routes accessible
