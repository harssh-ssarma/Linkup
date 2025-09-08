# 🚀 Linkup - Complete Setup Instructions

## Quick Start (2 Steps)

### 1. Start Backend Server
```bash
cd backend
# Double-click start.bat OR run:
python start_server.py
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

## ✅ What's Working Now

### 🔐 **Real Authentication System**
- ✅ **Country Code Picker** - 10+ countries supported
- ✅ **Real OTP System** - SMS via Twilio (dev mode: any 6-digit code works)
- ✅ **30-second Timer** - Resend OTP with countdown
- ✅ **Database Storage** - All data saved in SQLite/PostgreSQL
- ✅ **JWT Tokens** - Secure authentication
- ✅ **Profile Creation** - Name, email, avatar upload

### 📱 **WhatsApp + Instagram Features**
- ✅ **Modern UI** - Glass morphism design
- ✅ **Bottom Navigation** - 5 main sections
- ✅ **Chat System** - Personal, Groups, Channels
- ✅ **Feed System** - Posts, Stories, Reels
- ✅ **Profile Management** - Avatar, bio, settings
- ✅ **Create Content** - Photos, videos, stories
- ✅ **Discover Section** - Trending, hashtags, people
- ✅ **Settings Panel** - Privacy, notifications, security

## 🔧 Development Mode Features

### OTP Testing
- **Any 6-digit code works** (e.g., 123456, 000000)
- **Real OTP printed in console** when backend starts
- **No SMS charges** in development mode

### Database
- **SQLite** for development (no setup needed)
- **All user data persists** between sessions
- **Admin panel** at http://localhost:8000/admin

## 🌐 Production Setup (Optional)

### For Real SMS (Twilio)
1. Sign up at [twilio.com](https://twilio.com)
2. Get Account SID, Auth Token, Phone Number
3. Add to `backend/linkup/settings.py`:
```python
TWILIO_ACCOUNT_SID = 'your_account_sid'
TWILIO_AUTH_TOKEN = 'your_auth_token'
TWILIO_PHONE_NUMBER = 'your_twilio_number'
```

### For Production Database
1. Install PostgreSQL
2. Update `DATABASES` in `settings.py`
3. Run migrations: `python manage.py migrate`

## 📱 App Features

### Authentication Flow
1. **Select Country** → **Enter Phone** → **Send OTP**
2. **Enter 6-digit OTP** → **30s Timer** → **Resend Option**
3. **Complete Profile** → **Start Using App**

### Main Sections
- **💬 Chats** - WhatsApp-like messaging
- **🏠 Feed** - Instagram-like posts & stories
- **➕ Create** - Post photos, videos, stories, go live
- **🔍 Discover** - Trending content, hashtags, people
- **👤 Profile** - Manage account, settings, privacy

## 🚀 URLs
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api/
- **Admin Panel:** http://localhost:8000/admin/

## 🎯 Next Steps
1. **Test Authentication** - Try different country codes
2. **Explore Features** - Navigate through all sections
3. **Upload Avatar** - Test profile photo upload
4. **Create Content** - Try posting photos/videos
5. **Settings** - Configure privacy options

Your **WhatsApp + Instagram** combined app is ready! 🎉