# 🔗 Nivaran Backend Connection Setup Guide

## 🎯 Overview
This guide will help you connect your Nivaran frontend to a backend server for full functionality including user authentication, data persistence, and real-time emergency notifications.

## 🚀 Quick Start

### Option 1: Use Existing Backend (Recommended)
If you already have a backend server running:

1. **Update Environment Variables**:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env file with your backend URL
   REACT_APP_API_URL=http://your-backend-url:port/api
   ```

2. **Test Connection**:
   - Start your frontend: `npm start`
   - Look for the green "Backend Connected" indicator in the top-left corner
   - If red, check your backend URL and ensure the server is running

### Option 2: Create New Backend
If you need to create a backend server:

## 🛠️ Backend Requirements

Your backend should provide these API endpoints:

### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
PUT  /api/auth/profile
```

### Patient Management
```
GET  /api/patients
GET  /api/patients/me
POST /api/patients
PUT  /api/patients/:id
GET  /api/patients/:id/stats
```

### Quiz & Assessment
```
GET  /api/quiz/questions
POST /api/quiz/submit
GET  /api/quiz/history
GET  /api/quiz/latest
```

### Emergency Notifications
```
GET  /api/emergency/alerts
POST /api/emergency/alerts/:id/acknowledge
POST /api/emergency/test
```

### Health Check
```
GET  /api/health
GET  /api/status
```

## 📋 Backend Data Models

### User Model
```typescript
interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  userType: 'user' | 'mentor' | 'doctor';
  riskLevel?: 'safe' | 'medium' | 'high';
  isVerified: boolean;
  createdAt: string;
  lastLogin: string;
}
```

### Patient Model
```typescript
interface Patient {
  id: string;
  userId: string;
  name: string;
  age: number;
  phone: string;
  riskLevel: 'safe' | 'medium' | 'high';
  emergencyContact: string;
  emergencyPhone: string;
  progressData: {
    sobrietyDays: number;
    moodRating: number;
    stressLevel: number;
    // ... other metrics
  };
  assignedMentor?: string;
  assignedDoctor?: string;
}
```

### Quiz Result Model
```typescript
interface QuizResult {
  id: string;
  userId: string;
  riskLevel: 'safe' | 'medium' | 'high';
  riskScore: number;
  riskFactors: string[];
  emergencyTriggered: boolean;
  completedAt: string;
}
```

## 🔧 Environment Configuration

Create a `.env` file in your frontend root:

```env
# Backend Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=http://localhost:5000

# Emergency Contacts
REACT_APP_EMERGENCY_PHONE_1=919150397529
REACT_APP_EMERGENCY_PHONE_2=919025363352
REACT_APP_EMERGENCY_PHONE_3=917845272736

# Feature Flags
REACT_APP_ENABLE_OFFLINE_MODE=true
REACT_APP_ENABLE_REAL_SMS=false
```

## 🧪 Testing Backend Connection

### 1. Backend Status Indicator
- **Green dot**: Backend connected ✅
- **Red dot**: Backend disconnected ❌
- **Yellow dot**: Checking connection 🟡

### 2. Manual Testing
Open browser console and run:
```javascript
// Test API connection
fetch('http://localhost:5000/api/health')
  .then(response => response.json())
  .then(data => console.log('Backend status:', data));
```

### 3. Authentication Testing
1. Try logging in with backend credentials
2. Check browser console for authentication logs
3. Verify JWT token is stored in localStorage

## 🔄 Offline Mode

The frontend includes offline mode for development:

- **With Backend**: Full functionality with data persistence
- **Without Backend**: Local storage mode for testing UI/UX

Toggle offline mode in `.env`:
```env
REACT_APP_ENABLE_OFFLINE_MODE=true
```

## 📱 Emergency Notification Integration

### Backend Requirements for Emergency Alerts:
1. **SMS Service**: Twilio, TextBelt, or similar
2. **Email Service**: SendGrid, Nodemailer, or similar
3. **Push Notifications**: Firebase Cloud Messaging
4. **Database**: Store emergency alerts and status

### Emergency Flow:
1. User completes high-risk quiz
2. Frontend sends quiz results to backend
3. Backend calculates risk level
4. If high-risk: Backend triggers emergency notifications
5. Backend sends SMS/Email to registered numbers
6. Frontend shows confirmation to user

## 🛡️ Security Considerations

### Authentication
- Use JWT tokens with expiration
- Implement refresh token mechanism
- Secure password hashing (bcrypt)

### API Security
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention

### Data Protection
- Encrypt sensitive data
- HTTPS in production
- Secure emergency contact storage

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to your hosting service
# (Netlify, Vercel, AWS S3, etc.)
```

### Backend Deployment
- Deploy to cloud service (AWS, Heroku, DigitalOcean)
- Set up database (PostgreSQL, MongoDB)
- Configure environment variables
- Set up SSL certificates

## 📞 Emergency Contact Configuration

Update emergency contacts in backend:
```javascript
// Backend configuration
const EMERGENCY_CONTACTS = [
  { name: 'Primary', phone: '+919150397529', isPrimary: true },
  { name: 'Secondary', phone: '+919025363352', isPrimary: false },
  { name: 'Backup', phone: '+917845272736', isPrimary: false }
];
```

## 🔍 Troubleshooting

### Common Issues:

1. **Backend Not Connected**
   - Check if backend server is running
   - Verify API URL in .env file
   - Check CORS configuration

2. **Authentication Fails**
   - Verify JWT secret matches
   - Check token expiration
   - Ensure user exists in database

3. **Emergency Notifications Not Working**
   - Check SMS service configuration
   - Verify emergency contact numbers
   - Test SMS service separately

### Debug Mode:
Enable detailed logging:
```env
REACT_APP_LOG_LEVEL=debug
REACT_APP_ENABLE_CONSOLE_LOGS=true
```

## 📚 Next Steps

1. **Set up your backend server**
2. **Configure environment variables**
3. **Test all API endpoints**
4. **Set up emergency notification services**
5. **Deploy to production**

## 💡 Tips

- Start with offline mode for UI development
- Use backend status indicator to monitor connection
- Test emergency notifications thoroughly
- Keep emergency contact numbers updated
- Monitor backend logs for errors

---

**Need Help?** Check the browser console for detailed error messages and API response logs.
