# Smart Classroom Attendance - Server

Production-ready Node.js + Express API for attendance management.

## 🚀 Deploy to Vercel

### Prerequisites
- MongoDB Atlas connection string
- GitHub repository

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production-ready server"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set **Root Directory** to `server`
   - Add environment variables (see below)
   - Deploy

### Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=your-strong-production-secret-here
CLIENT_URL=https://your-frontend.vercel.app
ORIGIN=https://your-frontend.vercel.app
RP_ID=your-frontend.vercel.app
```

⚠️ **Important**: 
- Replace `JWT_SECRET` with a strong random string
- Update `CLIENT_URL`, `ORIGIN`, `RP_ID` with your actual frontend domain

### Post-Deployment

After deploying, update your frontend `.env`:
```
VITE_API_URL=https://your-server.vercel.app
```

## 📦 API Endpoints

- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /webauthn/register-challenge` - Get biometric registration challenge
- `POST /webauthn/register-verify` - Verify biometric registration
- `POST /webauthn/auth-challenge` - Get biometric auth challenge
- `POST /webauthn/auth-verify` - Verify biometric auth
- `POST /lecture/create` - Create lecture (teacher only)
- `GET /lecture/:id` - Get lecture details
- `POST /attendance/mark` - Mark attendance
- `GET /attendance/student` - Get student attendance
- `GET /attendance/lecture/:id` - Get lecture attendance (teacher only)

## 🔒 Security

- JWT authentication with httpOnly cookies
- Role-based access control
- CORS configured for frontend domain
- WebAuthn biometric verification
- MongoDB Atlas with encrypted connections

## 🛠️ Local Development

```bash
npm install
cp .env.example .env
# Edit .env with your local values
npm run seed  # Optional: Add demo users
npm run dev
```

## 📝 Notes

- WebAuthn requires HTTPS (Vercel provides this)
- Lecture QR tokens expire after 10 minutes
- One attendance per student per lecture (MongoDB unique index)
- Challenge storage is in-memory (consider Redis for production scale)
