# ADL - Ad Data Logic Universal Tracking Platform

## 🚀 Quick Start

ADL is a free, universal advertising tracking platform that automatically generates unique tracking codes for each campaign, enabling cross-platform attribution and real-time analytics.

## 📱 Deployment Options

### Option 1: Vercel (Recommended for Free Hosting)

1. **Fork/Clone the repository**
   ```bash
   git clone https://github.com/danyaffa/adl.git
   cd adl
   ```

2. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```

4. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Add: `MONGODB_URI` with your MongoDB Atlas connection string

### Option 2: Railway (Alternative Free Hosting)

1. **Connect GitHub repo to Railway**
   - Visit [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select `danyaffa/adl`

2. **Add MongoDB Plugin**
   - In Railway dashboard, click "New" → "Database" → "MongoDB"
   - Or use your existing MongoDB Atlas connection

3. **Deploy**
   - Railway will automatically deploy your app
   - Get your app URL from the deployment

### Option 3: Static Hosting (Netlify/GitHub Pages) + Separate API

For better performance and free hosting:

**Frontend (Netlify):**
1. Deploy `index.html` and `public/` folder to Netlify
2. Update API URLs in index.html to point to your backend

**Backend (Railway/Render):**
1. Deploy only `server.js` and backend files
2. Set CORS to allow your frontend domain

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create Free MongoDB Atlas Account**
   - Visit [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Create a free M0 cluster

2. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

3. **Create Database**
   - Database name: `adl_tracking`
   - Collections: `campaigns`, `tracking_events`, `analytics_data`

## 📂 Project Structure

```
adl/
├── index.html          # Main app (React + Tailwind)
├── server.js           # Backend API
├── package.json        # Dependencies
├── vercel.json         # Vercel config
├── .env.example        # Environment variables template
├── public/
│   ├── manifest.json   # PWA manifest
│   ├── icons/          # App icons
│   └── screenshots/    # App store screenshots
└── README.md          # This file
```

## 🔧 Environment Variables

Create `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adl_tracking
PORT=3000
```

## 📱 Mobile App Deployment

### Progressive Web App (PWA)
The app is already PWA-ready. Users can install it from their browser:
- iOS: Safari → Share → Add to Home Screen
- Android: Chrome → Menu → Install App

### App Store Submission

**For iOS:**
1. Use Capacitor or React Native wrapper
2. Generate iOS build
3. Submit to App Store Connect

**For Android:**
1. Use TWA (Trusted Web Activity) or React Native
2. Generate APK/AAB
3. Submit to Google Play Console

## 🛠️ Features

- ✅ Create campaigns with auto-generated ADL codes
- ✅ Track clicks, conversions, and revenue
- ✅ Real-time analytics dashboard
- ✅ Cross-platform attribution
- ✅ Export data as CSV
- ✅ Mobile-responsive design
- ✅ PWA support
- ✅ Free forever

## 🔐 Security

- All API endpoints use HTTPS
- MongoDB connection uses SSL
- No sensitive data stored in frontend
- CORS configured for your domains only

## 📊 API Endpoints

- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:adlCode` - Get specific campaign
- `PUT /api/campaigns/:adlCode` - Update campaign
- `DELETE /api/campaigns/:adlCode` - Delete campaign
- `POST /api/track/:adlCode` - Track event
- `GET /api/analytics/:adlCode` - Get analytics

## 🚀 Performance Optimization

1. **CDN Setup**: Use Cloudflare for static assets
2. **Caching**: Enable browser caching for assets
3. **Compression**: Enable gzip compression
4. **Lazy Loading**: Images and components load on demand

## 🆘 Troubleshooting

**Vercel deployment fails:**
- Check `vercel.json` syntax
- Ensure all dependencies are in `package.json`
- Check build logs for errors

**MongoDB connection issues:**
- Whitelist your IP in MongoDB Atlas
- Check connection string format
- Ensure database user has correct permissions

**CORS errors:**
- Update CORS origins in `server.js`
- Ensure frontend and backend domains match

## 📝 License

MIT License - Free to use for commercial and personal projects

## 🤝 Support

- GitHub Issues: [github.com/danyaffa/adl/issues](https://github.com/danyaffa/adl/issues)
- Email: support@addatalogic.com

---

Built with ❤️ by the ADL Team
