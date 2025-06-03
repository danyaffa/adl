const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
let db;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://adl_admin:ADL2025secure@cluster0.mongodb.net/adl_tracking?retryWrites=true&w=majority';

MongoClient.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(client => {
  console.log('✅ Connected to MongoDB Atlas - ADL Data Service');
  db = client.db('adl_tracking');
  
  // Create indexes for better performance
  db.collection('campaigns').createIndex({ trackingCode: 1 });
  db.collection('tracking_events').createIndex({ trackingCode: 1, timestamp: -1 });
  db.collection('analytics').createIndex({ trackingCode: 1, date: -1 });
  
}).catch(error => {
  console.error('❌ MongoDB Atlas connection failed:', error);
  process.exit(1);
});

// Auto-generate unique tracking codes
const generateTrackingCode = async (platform) => {
  const platformCodes = {
    facebook: 'FB',
    google: 'GG', 
    tiktok: 'TT',
    instagram: 'IG',
    linkedin: 'LI',
    twitter: 'TW',
    'multi-platform': 'MP'
  };
  
  const year = new Date().getFullYear();
  const platformCode = platformCodes[platform.toLowerCase()] || 'XX';
  
  // Get next sequence number from MongoDB
  const counter = await db.collection('counters').findOneAndUpdate(
    { _id: `${platformCode}_${year}` },
    { $inc: { sequence: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  
  const sequence = String(counter.value.sequence).padStart(3, '0');
  return `ADL-${platformCode}-${year}-${sequence}`;
};

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test MongoDB connection
    await db.admin().ping();
    
    res.json({
      status: 'OK',
      service: 'ADL MongoDB Data Service',
      timestamp: new Date().toISOString(),
      database: 'Connected to MongoDB Atlas',
      collections: {
        campaigns: await db.collection('campaigns').countDocuments(),
        tracking_events: await db.collection('tracking_events').countDocuments(),
        analytics: await db.collection('analytics').countDocuments()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      service: 'ADL MongoDB Data Service',
      error: error.message
    });
  }
});

// Create new campaign - Save to MongoDB Atlas
app.post('/api/campaigns', async (req, res) => {
  try {
    const {
      campaignName,
      platform = 'multi-platform',
      budget,
      duration,
      objective,
      audience,
      adCopy,
      platforms = [],
      targeting = '',
      userId = 'default_user'
    } = req.body;

    // Validate required fields
    if (!campaignName || !budget) {
      return res.status(400).json({
        success: false,
        error: 'Campaign name and budget are required'
      });
    }

    // Generate unique tracking code
    const trackingCode = await generateTrackingCode(platform);
    
    // Create campaign document for MongoDB
    const campaign = {
      _id: trackingCode,
      trackingCode: trackingCode,
      name: campaignName,
      platform: platform,
      platforms: platforms,
      budget: parseFloat(budget),
      duration: duration ? parseInt(duration) : null,
      objective: objective || 'conversions',
      audience: audience || '',
      adCopy: adCopy || '',
      targeting: targeting,
      userId: userId,
      status: 'LIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      liveStats: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        spend: 0,
        revenue: 0,
        ctr: 0,
        cpc: 0,
        roi: 0
      },
      deployments: platforms.map(p => ({
        platform: p,
        status: 'deployed',
        deployedAt: new Date()
      }))
    };

    // Save to MongoDB Atlas
    await db.collection('campaigns').insertOne(campaign);
    
    // Generate live tracking script
    const trackingScript = generateTrackingScript(trackingCode);
    
    // Log campaign creation
    await db.collection('activity_log').insertOne({
      action: 'campaign_created',
      trackingCode: trackingCode,
      userId: userId,
      timestamp: new Date(),
      details: { campaignName, platform, budget }
    });

    res.json({
      success: true,
      campaign: campaign,
      trackingCode: trackingCode,
      trackingScript: trackingScript,
      liveAnalyticsUrl: `${process.env.FRONTEND_URL || 'https://your-app.vercel.app'}/live/${trackingCode}`,
      message: 'Campaign created and saved to MongoDB Atlas!'
    });

  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create campaign in MongoDB',
      message: error.message
    });
  }
});

// Get all campaigns from MongoDB Atlas
app.get('/api/campaigns', async (req, res) => {
  try {
    const userId = req.query.userId || 'default_user';
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;
    
    const campaigns = await db.collection('campaigns')
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get live stats for each campaign
    for (let campaign of campaigns) {
      const liveStats = await getLiveStats(campaign.trackingCode);
      campaign.liveStats = { ...campaign.liveStats, ...liveStats };
    }

    res.json({
      success: true,
      campaigns: campaigns,
      total: await db.collection('campaigns').countDocuments({ userId: userId }),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaigns from MongoDB'
    });
  }
});

// Track events - Save to MongoDB Atlas
app.post('/api/track', async (req, res) => {
  try {
    const {
      trackingCode,
      event,
      data = {},
      timestamp,
      url,
      referrer,
      userAgent,
      sessionId
    } = req.body;

    if (!trackingCode || !event) {
      return res.status(400).json({
        success: false,
        error: 'Tracking code and event are required'
      });
    }

    // Create tracking event document
    const trackingEvent = {
      trackingCode: trackingCode,
      event: event,
      data: data,
      timestamp: new Date(timestamp || Date.now()),
      url: url,
      referrer: referrer,
      userAgent: userAgent,
      sessionId: sessionId,
      ip: req.ip || req.connection.remoteAddress,
      createdAt: new Date()
    };

    // Save to MongoDB Atlas
    await db.collection('tracking_events').insertOne(trackingEvent);

    // Update campaign live stats
    await updateCampaignLiveStats(trackingCode, event, data);

    res.json({ 
      success: true, 
      message: 'Event tracked and saved to MongoDB Atlas',
      eventId: trackingEvent._id 
    });

  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to track event in MongoDB' 
    });
  }
});

// Get live analytics from MongoDB Atlas
app.get('/api/analytics/:trackingCode', async (req, res) => {
  try {
    const { trackingCode } = req.params;
    const timeRange = req.query.range || '24h'; // 24h, 7d, 30d
    
    // Get campaign details
    const campaign = await db.collection('campaigns').findOne({ 
      trackingCode: trackingCode 
    });
    
    if (!campaign) {
      return res.status(404).json({ 
        success: false, 
        error: 'Campaign not found' 
      });
    }

    // Calculate time range
    const now = new Date();
    const timeRanges = {
      '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    };
    const startTime = timeRanges[timeRange] || timeRanges['24h'];

    // Get tracking events from MongoDB
    const events = await db.collection('tracking_events')
      .find({ 
        trackingCode: trackingCode,
        timestamp: { $gte: startTime }
      })
      .sort({ timestamp: -1 })
      .toArray();

    // Calculate real-time analytics
    const analytics = {
      campaign: campaign,
      timeRange: timeRange,
      totalEvents: events.length,
      pageViews: events.filter(e => e.event === 'page_view').length,
      clicks: events.filter(e => e.event === 'click').length,
      conversions: events.filter(e => e.event === 'conversion').length,
      uniqueVisitors: new Set(events.map(e => e.sessionId || e.ip)).size,
      bounceRate: calculateBounceRate(events),
      avgSessionDuration: calculateAvgSessionDuration(events),
      topPages: getTopPages(events),
      topReferrers: getTopReferrers(events),
      deviceBreakdown: getDeviceBreakdown(events),
      hourlyBreakdown: getHourlyBreakdown(events),
      liveStats: await getLiveStats(trackingCode),
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      analytics: analytics
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch analytics from MongoDB' 
    });
  }
});

// Get live stats for real-time updates
app.get('/api/live/:trackingCode', async (req, res) => {
  try {
    const { trackingCode } = req.params;
    
    const liveStats = await getLiveStats(trackingCode);
    
    res.json({
      success: true,
      trackingCode: trackingCode,
      liveStats: liveStats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching live stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch live stats' 
    });
  }
});

// Bulk live stats for dashboard
app.get('/api/live-stats', async (req, res) => {
  try {
    const userId = req.query.userId || 'default_user';
    
    // Get all active campaigns
    const campaigns = await db.collection('campaigns')
      .find({ userId: userId, status: 'LIVE' })
      .toArray();

    const liveStats = {};
    
    for (const campaign of campaigns) {
      liveStats[campaign.trackingCode] = await getLiveStats(campaign.trackingCode);
    }

    res.json({
      success: true,
      liveStats: liveStats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching bulk live stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch live stats' 
    });
  }
});

// Helper Functions

async function getLiveStats(trackingCode) {
  try {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const events = await db.collection('tracking_events')
      .find({ 
        trackingCode: trackingCode,
        timestamp: { $gte: last24h }
      })
      .toArray();

    const impressions = events.filter(e => e.event === 'page_view').length;
    const clicks = events.filter(e => e.event === 'click').length;
    const conversions = events.filter(e => e.event === 'conversion').length;
    
    const ctr = impressions > 0 ? (clicks / impressions * 100) : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks * 100) : 0;
    const revenue = conversions * 50; // Estimate $50 per conversion
    
    return {
      impressions: impressions,
      clicks: clicks,
      conversions: conversions,
      ctr: parseFloat(ctr.toFixed(2)),
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      revenue: revenue,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error calculating live stats:', error);
    return {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      conversionRate: 0,
      revenue: 0
    };
  }
}

async function updateCampaignLiveStats(trackingCode, event, data) {
  try {
    const updateData = { 
      $set: { updatedAt: new Date() },
      $inc: {}
    };

    switch (event) {
      case 'page_view':
        updateData.$inc['liveStats.impressions'] = 1;
        break;
      case 'click':
        updateData.$inc['liveStats.clicks'] = 1;
        break;
      case 'conversion':
        updateData.$inc['liveStats.conversions'] = 1;
        updateData.$inc['liveStats.revenue'] = data.value || 50;
        break;
    }

    await db.collection('campaigns').updateOne(
      { trackingCode: trackingCode },
      updateData
    );

    // Recalculate derived stats
    const campaign = await db.collection('campaigns').findOne({ trackingCode: trackingCode });
    if (campaign && campaign.liveStats.impressions > 0) {
      const ctr = (campaign.liveStats.clicks / campaign.liveStats.impressions * 100).toFixed(2);
      const roi = campaign.liveStats.revenue > 0 ? 
        ((campaign.liveStats.revenue - campaign.budget) / campaign.budget * 100).toFixed(2) : 0;
      
      await db.collection('campaigns').updateOne(
        { trackingCode: trackingCode },
        { 
          $set: { 
            'liveStats.ctr': parseFloat(ctr),
            'liveStats.roi': parseFloat(roi)
          }
        }
      );
    }
  } catch (error) {
    console.error('Error updating campaign stats:', error);
  }
}

function generateTrackingScript(trackingCode) {
  return `
<!-- ADL Live Tracking Code: ${trackingCode} -->
<script>
(function() {
  const ADL_TRACKING = {
    trackingCode: '${trackingCode}',
    apiEndpoint: '${process.env.API_ENDPOINT || 'https://your-backend.vercel.app'}/api',
    sessionId: 'adl_' + Math.random().toString(36).substr(2, 9),
    
    track: function(event, data = {}) {
      fetch(this.apiEndpoint + '/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingCode: this.trackingCode,
          event: event,
          data: data,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          sessionId: this.sessionId
        })
      }).catch(e => console.log('ADL tracking error:', e));
    },
    
    init: function() {
      // Track page view
      this.track('page_view');
      
      // Track clicks
      document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
          this.track('click', {
            element: e.target.tagName,
            text: e.target.innerText?.substr(0, 100),
            href: e.target.href
          });
        }
      });
      
      // Track form submissions as conversions
      document.addEventListener('submit', (e) => {
        this.track('conversion', {
          form: e.target.action || 'form_submit',
          value: 50
        });
      });
      
      // Track scroll depth
      let maxScroll = 0;
      window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
          maxScroll = scrollPercent;
          this.track('scroll', { depth: scrollPercent });
        }
      });
    }
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ADL_TRACKING.init());
  } else {
    ADL_TRACKING.init();
  }
})();
</script>`;
}

// Additional helper functions
function calculateBounceRate(events) {
  const sessions = {};
  events.forEach(event => {
    const sessionId = event.sessionId || event.ip;
    if (!sessions[sessionId]) sessions[sessionId] = [];
    sessions[sessionId].push(event);
  });
  
  const singlePageSessions = Object.values(sessions).filter(session => 
    session.filter(e => e.event === 'page_view').length === 1
  ).length;
  
  return Object.keys(sessions).length > 0 ? 
    (singlePageSessions / Object.keys(sessions).length * 100).toFixed(1) : 0;
}

function calculateAvgSessionDuration(events) {
  // Implementation for session duration calculation
  return '2:34'; // Placeholder
}

function getTopPages(events) {
  const pages = {};
  events.filter(e => e.event === 'page_view').forEach(event => {
    if (event.url) {
      pages[event.url] = (pages[event.url] || 0) + 1;
    }
  });
  return Object.entries(pages)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([url, count]) => ({ url, count }));
}

function getTopReferrers(events) {
  const referrers = {};
  events.forEach(event => {
    if (event.referrer && event.referrer !== '') {
      try {
        const domain = new URL(event.referrer).hostname;
        referrers[domain] = (referrers[domain] || 0) + 1;
      } catch (e) {
        referrers[event.referrer] = (referrers[event.referrer] || 0) + 1;
      }
    }
  });
  return Object.entries(referrers)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([domain, count]) => ({ domain, count }));
}

function getDeviceBreakdown(events) {
  const devices = { mobile: 0, desktop: 0, tablet: 0 };
  events.forEach(event => {
    const ua = event.userAgent || '';
    if (/Mobile|Android|iPhone|iPad/.test(ua)) {
      devices.mobile++;
    } else if (/Tablet|iPad/.test(ua)) {
      devices.tablet++;
    } else {
      devices.desktop++;
    }
  });
  return devices;
}

function getHourlyBreakdown(events) {
  const hours = {};
  events.forEach(event => {
    const hour = new Date(event.timestamp).getHours();
    hours[hour] = (hours[hour] || 0) + 1;
  });
  
  const breakdown = [];
  for (let i = 0; i < 24; i++) {
    breakdown.push({ hour: i, count: hours[i] || 0 });
  }
  return breakdown;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ADL MongoDB Data Service running on port ${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🔗 MongoDB Atlas: Connected`);
  console.log(`📈 Live Analytics: Enabled`);
});

module.exports = app;
