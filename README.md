# ADL Tracker & Optimization

## AD DATA LOGIC - Advanced Ad Campaign Management Platform

### Overview
ADL Tracker & Optimization is a comprehensive web-based platform for managing, tracking, and optimizing advertising campaigns across multiple platforms including Facebook, Google Ads, TikTok, and more.

### Features
- 📈 Real-time campaign tracking
- 🤖 AI-powered optimization suggestions
- 🔗 Multi-platform integration
- 📊 Advanced analytics and reporting
- ⚡ Smart automation tools
- 🎯 ROI maximization

### Tech Stack
- **Frontend**: HTML5, CSS3, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Deployment**: Vercel
- **Database**: Ready for integration (Firebase/Supabase)

### Getting Started

#### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/danyaffa/adl.git
   cd adl
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

#### Deployment
The application is configured for automatic deployment on Vercel:
1. Connect your GitHub repository to Vercel
2. Deploy automatically on every push to main branch

### Project Structure
```
adl/
├── public/
│   ├── index.html          # Main landing page
│   └── ADL_logo.png        # Company logo
├── backend/
│   ├── .env.example        # Environment variables template
│   └── vercel.json         # Backend configuration
├── docs/
│   ├── DEPLOYMENT.md       # Deployment instructions
│   └── FEATURES.md         # Feature specifications
├── server.js               # Express server
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

### API Endpoints
- `GET /api/health` - Health check endpoint
- More endpoints to be added for campaign management

### Environment Variables
Create a `.env` file in the root directory:
```
NODE_ENV=production
PORT=3000
```

### Company Information
**Leffler International Investments Pty Ltd**
- ACN: 124 089 345
- ABN: 90124089345
- Address: Level 2, 222 Pitt Street, Sydney 2000, Australia
- Phone: 0478 965 828
- Email: leffleryd@gmail.com

### License
© 2025 Leffler International Investments Pty Ltd. All rights reserved.

### Support
For technical support, please contact: leffleryd@gmail.com
