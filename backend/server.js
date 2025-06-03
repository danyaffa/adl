const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string';
const client = new MongoClient(mongoUri);

let db;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    db = client.db('adl_tracking');
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Create campaign
app.post('/api/campaigns', async (req, res) => {
  try {
    const campaign = {
      ...req.body,
      createdAt: new Date(),
      clicks: 0,
      conversions: 0,
      revenue: 0,
      status: 'active'
    };
    
    const result = await db.collection('campaigns').insertOne(campaign);
    res.json({ success: true, id: result.insertedId, adlCode: campaign.adlCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all campaigns
app.get('/api/campaigns', async (req, res) => {
  try {
    const campaigns = await db.collection('campaigns').find({}).toArray();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get campaign by ADL code
app.get('/api/campaigns/:adlCode', async (req, res) => {
  try {
    const campaign = await db.collection('campaigns').findOne({ adlCode: req.params.adlCode });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update campaign
app.put('/api/campaigns/:adlCode', async (req, res) => {
  try {
    const result = await db.collection('campaigns').updateOne(
      { adlCode: req.params.adlCode },
      { $set: req.body }
    );
    res.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Track event
app.post('/api/track/:adlCode', async (req, res) => {
  try {
    const { event, url, timestamp, ...data } = req.body;
    
    // Store tracking event
    await db.collection('tracking_events').insertOne({
      adlCode: req.params.adlCode,
      event,
      url,
      timestamp: new Date(timestamp),
      data,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    
    // Update campaign metrics
    const updateData = {};
    if (event === 'click' || event === 'pageview') {
      updateData.$inc = { clicks: 1 };
    } else if (event === 'conversion') {
      updateData.$inc = { 
        conversions: 1,
        revenue: data.value || 0
      };
    }
    
    if (updateData.$inc) {
      await db.collection('campaigns').updateOne(
        { adlCode: req.params.adlCode },
        updateData
      );
    }
    
    // Return tracking pixel
    res.set('Content-Type', 'image/gif');
    res.send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics for campaign
app.get('/api/analytics/:adlCode', async (req, res) => {
  try {
    const campaign = await db.collection('campaigns').findOne({ adlCode: req.params.adlCode });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    // Get recent events
    const recentEvents = await db.collection('tracking_events')
      .find({ adlCode: req.params.adlCode })
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();
    
    // Calculate metrics
    const roi = campaign.budget > 0 ? ((campaign.revenue - campaign.budget) / campaign.budget * 100).toFixed(2) : 0;
    const conversionRate = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks * 100).toFixed(2) : 0;
    
    res.json({
      campaign,
      metrics: {
        roi,
        conversionRate,
        avgRevenuePerConversion: campaign.conversions > 0 ? (campaign.revenue / campaign.conversions).toFixed(2) : 0
      },
      recentEvents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete campaign
app.delete('/api/campaigns/:adlCode', async (req, res) => {
  try {
    await db.collection('campaigns').updateOne(
      { adlCode: req.params.adlCode },
      { $set: { status: 'deleted', deletedAt: new Date() } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`ADL Backend running on port ${PORT}`);
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await client.close();
  process.exit(0);
});
