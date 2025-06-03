# 🚀 ADL Tracking System - Complete MongoDB Atlas Integration

> **🔴 LIVE SYSTEM** - Real-time tracking with MongoDB Atlas cloud database

## ✨ Features

- 🔥 **Live MongoDB Atlas Integration** - Cloud database with real-time sync
- 📊 **Real Tracking Analytics** - Actual click & conversion tracking
- 🎯 **Campaign Management** - Create, edit, delete campaigns
- 📈 **Live Dashboard** - Real-time performance metrics
- 🔒 **Secure Authentication** - JWT-based user system
- 📤 **Data Export** - CSV export from MongoDB data
- 🖥️ **Responsive UI** - Works on all devices
- ⚡ **Production Ready** - Complete deployment setup

## 🚀 Quick Start

### 1. Clone & Setup
```bash
git clone https://github.com/your-repo/adl-tracking
cd adl-tracking
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 2. Configure MongoDB Atlas
```bash
# Edit .env file
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/adl_tracking
JWT_SECRET=your-secure-secret-key
FRONTEND_URL=https://your-domain.com
```

### 3. Install Dependencies
```bash
npm run install-all
```

### 4. Start Development
```bash
# Backend (Port 3001)
npm run dev

# Frontend (Port 3000)
npm run client
```

### 5. Production Deployment
```bash
npm run deploy
```

## 📁 Project Structure

```
adl-tracking-system/
├── backend/
│   ├── server.js           # Main MongoDB server
│   └── public/             # Built frontend files
├── frontend/
│   ├── src/
│   │   └── App.js          # React app with MongoDB integration
│   └── package.json
├── scripts/
│   └── deploy.sh           # Automated deployment
├── .env                    # Environment variables
├── package.json            # Backend dependencies
└── ecosystem.config.js     # PM2 configuration
```

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - Create user account
- `POST /api/login` - User authentication

### Campaigns
- `GET /api/campaigns` - List all user campaigns
- `POST /api/campaigns` - Create new campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Tracking
- `GET /api/track/:code` - Track clicks (pixel)
- `POST /api/convert/:code` - Record conversions
- `GET /api/analytics/:code` - Get campaign analytics
- `GET /api/analytics` - Get all campaigns analytics

### Data Export
- `GET /api/export` - Export data to CSV
- `GET /api/dashboard` - Dashboard summary

## 📊 Usage Examples

### 1. Create Campaign
```javascript
const campaign = await fetch('/api/campaigns', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Summer Sale 2025',
    source: 'google',
    medium: 'cpc',
    budget: 1000
  })
});
```

### 2. Track Clicks (Pixel)
```html
<!-- Add to your landing page -->
<img src="https://your-domain.com/api/track/ADL_ABC12345" 
     width="1" height="1" style="display:none" />
```

### 3. Record Conversion
```javascript
await fetch('/api/convert/ADL_ABC12345', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    value: 99.99,
    currency: 'USD'
  })
});
```

### 4. Get Analytics
```javascript
const analytics = await fetch('/api/analytics/ADL_ABC12345');
const data = await analytics.json();
// { clicks: 150, conversions: 12, revenue: 1200, conversionRate: 8.0 }
```

## 🔒 Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcrypt encryption
- ✅ **Rate Limiting** - API abuse protection
- ✅ **CORS Protection** - Cross-origin security
- ✅ **Input Validation** - Data sanitization
- ✅ **Helmet Security** - HTTP headers protection

## 🌐 MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
- Visit [MongoDB Atlas](https://cloud.mongodb.com)
- Create free cluster
- Add database user
- Whitelist IP addresses

### 2. Get Connection String
```
mongodb+srv://username:password@
