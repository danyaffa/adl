const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
let db;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adl_tracking';

MongoClient.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(client => {
  console.log('✅ Connected to MongoDB Atlas');
  db = client.db('adl_tracking');
  
  // Create indexes for better performance
  db.collection('campaigns').createIndex({ code: 1 }, { unique: true });
  db.collection('campaigns').createIndex({ userId: 1 });
  db.collection('tracking_events').createIndex({ code: 1 });
  db.collection('tracking_events').createIndex({ timestamp: 1 });
})
.catch(error => {
  console.error('❌ MongoDB connection failed:', error);
  process.exit(1);
});

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'adl-secret-key-2025', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Generate unique tracking code
const generateTrackingCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ADL_';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// ROUTES

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    mongodb: db ? 'connected' : 'disconnected'
  });
});

// User registration (simplified for demo)
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: result.insertedId, email },
      process.env.JWT_SECRET || 'adl-secret-key-2025',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.insertedId, email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'adl-secret-key-2025',
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all campaigns for user
app.get('/api/campaigns', authenticateToken, async (req, res) => {
  try {
    const campaigns = await db.collection('campaigns')
      .find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json(campaigns);
  } catch (error) {
    console.error('Fetch campaigns error:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Create new campaign
app.post('/api/campaigns', authenticateToken, async (req, res) => {
  try {
    const { name, source, medium, campaign, budget } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Campaign name is required' });
    }

    let trackingCode;
    let codeExists = true;
    
    // Generate unique tracking code
    while (codeExists) {
      trackingCode = generateTrackingCode();
      const existing = await db.collection('campaigns').findOne({ code: trackingCode });
      codeExists = !!existing;
    }

    const newCampaign = {
      name: name.trim(),
      source: source?.trim() || '',
      medium: medium?.trim() || '',
      campaign: campaign?.trim() || '',
      budget: budget ? parseFloat(budget) : 0,
      code: trackingCode,
      userId: req.user.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    };

    const result = await db.collection('campaigns').insertOne(newCampaign);
    
    res.status(201).json({
      _id: result.insertedId,
      ...newCampaign
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Update campaign
app.put('/api/campaigns/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, source, medium, campaign, budget, status } = req.body;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const updateData = {
      updatedAt: new Date()
    };

    if (name?.trim()) updateData.name = name.trim();
    if (source !== undefined) updateData.source = source.trim();
    if (medium !== undefined) updateData.medium = medium.trim();
    if (campaign !== undefined) updateData.campaign = campaign.trim();
    if (budget !== undefined) updateData.budget = parseFloat(budget) || 0;
    if (status) updateData.status = status;

    const result = await db.collection('campaigns').updateOne(
      { _id: new ObjectId(id), userId: req.user.userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ message: 'Campaign updated successfully' });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// Delete campaign
app.delete('/api/campaigns/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const result = await db.collection('campaigns').deleteOne({
      _id: new ObjectId(id),
      userId: req.user.userId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Also delete associated tracking events
    await db.collection('tracking_events').deleteMany({
      campaignId: new ObjectId(id)
    });

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

// Track pixel/event
app.get('/api/track/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const referer = req.headers.referer || '';
    
    // Find campaign by code
    const campaign = await db.collection('campaigns').findOne({ code });
    
    if (!campaign) {
      // Return 1x1 transparent pixel even for invalid codes
      res.set({
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      return res.send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
    }

    // Record tracking event
    await db.collection('tracking_events').insertOne({
      campaignId: campaign._id,
      code: code,
      type: 'click',
      ip: ip,
      userAgent: userAgent,
      referer: referer,
      timestamp: new Date()
    });

    // Return 1x1 transparent pixel
    res.set({
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.send(pixel);
  } catch (error) {
    console.error('Tracking error:', error);
    // Still return pixel even if tracking fails
    res.set({ 'Content-Type': 'image/gif' });
    res.send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
  }
});

// Record conversion
app.post('/api/convert/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { value = 0, currency = 'USD' } = req.body;
    
    const campaign = await db.collection('campaigns').findOne({ code });
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Record conversion event
    await db.collection('tracking_events').insertOne({
      campaignId: campaign._id,
      code: code,
      type: 'conversion',
      value: parseFloat(value) || 0,
      currency: currency,
      timestamp: new Date()
    });

    res.json({ message: 'Conversion recorded successfully' });
  } catch (error) {
    console.error('Conversion tracking error:', error);
    res.status(500).json({ error: 'Failed to record conversion' });
  }
});

// Get analytics for campaign
app.get('/api/analytics/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const campaign = await db.collection('campaigns').findOne({ code });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Get analytics data
    const pipeline = [
      { $match: { code: code } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' }
        }
      }
    ];

    const analytics = await db.collection('tracking_events').aggregate(pipeline).toArray();
    
    let clicks = 0;
    let conversions = 0;
    let revenue = 0;

    analytics.forEach(item => {
      if (item._id === 'click') clicks = item.count;
      if (item._id === 'conversion') {
        conversions = item.count;
        revenue = item.totalValue || 0;
      }
    });

    res.json({
      code,
      clicks,
      conversions,
      revenue,
      conversionRate: clicks > 0 ? ((conversions / clicks) * 100).toFixed(2) : 0,
      avgOrderValue: conversions > 0 ? (revenue / conversions).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get analytics for all user campaigns
app.get('/api/analytics', authenticateToken, async (req, res) => {
  try {
    const campaigns = await db.collection('campaigns')
      .find({ userId: req.user.userId })
      .toArray();
    
    const codes = campaigns.map(c => c.code);
    
    const pipeline = [
      { $match: { code: { $in: codes } } },
      {
        $group: {
          _id: { code: '$code', type: '$type' },
          count: { $sum: 1 },
          totalValue: { $sum: '$value' }
        }
      }
    ];

    const analytics = await db.collection('tracking_events').aggregate(pipeline).toArray();
    
    const result = {};
    
    codes.forEach(code => {
      result[code] = { clicks: 0, conversions: 0, revenue: 0 };
    });

    analytics.forEach(item => {
      const code = item._id.code;
      const type = item._id.type;
      
      if (type === 'click') {
        result[code].clicks = item.count;
      } else if (type === 'conversion') {
        result[code].conversions = item.count;
        result[code].revenue = item.totalValue || 0;
      }
    });

    res.json(result);
