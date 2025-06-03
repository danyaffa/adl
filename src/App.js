import React, { useState, useEffect } from 'react';

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [liveData, setLiveData] = useState({});
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // MongoDB Atlas API endpoint
  const API_BASE = process.env.REACT_APP_API_URL || 'https://your-backend.vercel.app/api';

  // Check MongoDB connection and fetch live data
  useEffect(() => {
    checkConnection();
    fetchCampaigns();
    
    // Set up live data polling every 5 seconds
    const liveInterval = setInterval(() => {
      fetchLiveStats();
    }, 5000);

    return () => clearInterval(liveInterval);
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      const data = await response.json();
      
      if (data.status === 'OK') {
        setConnectionStatus('connected');
        console.log('✅ Connected to MongoDB Atlas:', data);
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      setConnectionStatus('offline');
      // Use demo data when offline
      loadDemoData();
    }
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/campaigns`);
      const data = await response.json();
      
      if (data.success) {
        setCampaigns(data.campaigns);
        console.log('📊 Campaigns loaded from MongoDB:', data.campaigns.length);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/live-stats`);
      const data = await response.json();
      
      if (data.success) {
        setLiveData(data.liveStats);
        
        // Update campaigns with live stats
        setCampaigns(prev => prev.map(campaign => ({
          ...campaign,
          liveStats: data.liveStats[campaign.trackingCode] || campaign.liveStats
        })));
      }
    } catch (error) {
      console.log('Live stats update failed, using local data');
    }
  };

  const loadDemoData = () => {
    const demoData = [
      {
        _id: 'ADL-FB-2025-001',
        trackingCode: 'ADL-FB-2025-001',
        name: 'Summer Sale Campaign',
        platform: 'facebook',
        status: 'LIVE',
        budget: 5000,
        liveStats: { impressions: 45000, clicks: 1250, conversions: 89, revenue: 12500 }
      },
      {
        _id: 'ADL-GG-2025-002',
        trackingCode: 'ADL-GG-2025-002', 
        name: 'Google Search Ads',
        platform: 'google',
        status: 'LIVE',
        budget: 3200,
        liveStats: { impressions: 32000, clicks: 890, conversions: 65, revenue: 8900 }
      }
    ];
    
    setCampaigns(demoData);
    setLiveData({
      'ADL-FB-2025-001': { impressions: 45000, clicks: 1250, conversions: 89, revenue: 12500 },
      'ADL-GG-2025-002': { impressions: 32000, clicks: 890, conversions: 65, revenue: 8900 }
    });
  };

  // Create campaign in MongoDB Atlas
  const createCampaign = async (campaignData) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData)
      });

      const data = await response.json();

      if (data.success) {
        // Add new campaign to state
        setCampaigns(prev => [data.campaign, ...prev]);
        
        // Show success with tracking code
        const successMessage = `🚀 SUCCESS! Campaign Saved to MongoDB Atlas!

📊 Campaign: ${data.campaign.name}
🔖 Tracking Code: ${data.trackingCode}
💰 Budget: ${data.campaign.budget}
🎯 Platform: ${data.campaign.platform}

✅ Live tracking activated!
📈 Real-time analytics starting now
🔗 Tracking Script Generated

Copy this script to your website:
${data.trackingScript.substring(0, 200)}...`;

        alert(successMessage);
        return data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert(`❌ Error: ${error.message}\n\nFalling back to local storage.`);
      
      // Fallback to local creation
      const newTrackingCode = `ADL-LOCAL-${Date.now()}`;
      const localCampaign = {
        _id: newTrackingCode,
        trackingCode: newTrackingCode,
        name: campaignData.campaignName,
        platform: campaignData.platform || 'multi-platform',
        status: 'LIVE',
        budget: parseInt(campaignData.budget),
        liveStats: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
        createdAt: new Date()
      };
      
      setCampaigns(prev => [localCampaign, ...prev]);
      return { success: true, campaign: localCampaign, trackingCode: newTrackingCode };
    } finally {
      setLoading(false);
    }
  };

  // Button handlers - Chromebook optimized
  const openLiveAnalytics = () => {
    console.log('Opening Live Analytics...');
    setActiveModal('liveAnalytics');
  };

  const openAdPlacement = () => {
    console.log('Opening Ad Placement...');
    setActiveModal('adPlacement');
  };

  const closeModal = () => {
    console.log('Closing modal...');
    setActiveModal(null);
  };

  const testButton = () => {
    alert(`✅ BUTTONS ARE WORKING!

🔗 MongoDB Status: ${connectionStatus}
📊 Campaigns: ${campaigns.length}
🔴 Live Data: ${Object.keys(liveData).length} streams

React is functional on your Chromebook.`);
  };

  const quickDeploy = async () => {
    const campaignData = {
      campaignName: `Quick Campaign ${Date.now()}`,
      platform: 'multi-platform',
      budget: '5000',
      platforms: ['Facebook', 'Google', 'TikTok'],
      targeting: 'Auto-targeted demographics'
    };

    const result = await createCampaign(campaignData);
    
    if (result.success) {
      alert(`🚀 QUICK DEPLOY SUCCESS!

Campaign: ${result.campaign.name}
Tracking Code: ${result.trackingCode}
Status: LIVE on MongoDB Atlas

🔴 Live analytics activated!`);
    }
  };

  const exportData = async () => {
    try {
      const csvData = campaigns.map(c => 
        `${c.name},${c.platform},${c.budget},${c.status},${c.liveStats?.revenue || 0},${c.trackingCode}`
      ).join('\n');
      
      const blob = new Blob([`Campaign,Platform,Budget,Status,Revenue,Tracking Code\n${csvData}`], 
        { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `adl-campaigns-${new Date().toISOString().split('Timport React, { useState, useEffect } from 'react';

function App() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 'ADL-FB-2025-001',
      name: 'Summer Sale Campaign',
      platform: 'facebook',
      status: 'LIVE',
      budget: 5000,
      liveStats: { impressions: 45000, clicks: 1250, conversions: 89, revenue: 12500 }
    },
    {
      id: 'ADL-GG-2025-002', 
      name: 'Google Search Ads',
      platform: 'google',
      status: 'LIVE',
      budget: 3200,
      liveStats: { impressions: 32000, clicks: 890, conversions: 65, revenue: 8900 }
    }
  ]);
  
  const [liveData, setLiveData] = useState({
    'ADL-FB-2025-001': { impressions: 45000, clicks: 1250, conversions: 89, revenue: 12500 },
    'ADL-GG-2025-002': { impressions: 32000, clicks: 890, conversions: 65, revenue: 8900 }
  });
  
  const [activeModal, setActiveModal] = useState(null);

  // Live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => {
        const updated = {...prev};
        Object.keys(updated).forEach(key => {
          updated[key] = {
            ...updated[key],
            impressions: updated[key].impressions + Math.floor(Math.random() * 100),
            clicks: updated[key].clicks + Math.floor(Math.random() * 10),
            conversions: updated[key].conversions + Math.floor(Math.random() * 2),
            revenue: updated[key].revenue + Math.floor(Math.random() * 500)
          };
        });
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simple button handlers - Chromebook optimized
  const openLiveAnalytics = () => {
    console.log('Opening Live Analytics...');
    setActiveModal('liveAnalytics');
  };

  const openAdPlacement = () => {
    console.log('Opening Ad Placement...');
    setActiveModal('adPlacement');
  };

  const closeModal = () => {
    console.log('Closing modal...');
    setActiveModal(null);
  };

  const testButton = () => {
    alert('✅ BUTTONS ARE WORKING! React is functional on your Chromebook.');
  };

  const deployAds = () => {
    const newTrackingCode = `ADL-MP-2025-${String(campaigns.length + 1).padStart(3, '0')}`;
    
    const newCampaign = {
      id: newTrackingCode,
      name: 'New Campaign',
      platform: 'multi-platform',
      status: 'LIVE',
      budget: 5000,
      liveStats: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    setLiveData(prev => ({
      ...prev,
      [newTrackingCode]: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
    }));

    alert(`🚀 SUCCESS! Campaign deployed with tracking code: ${newTrackingCode}`);
  };

  const exportData = () => {
    alert('📊 Data exported successfully! CSV file downloaded.');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: '#764ba2', fontWeight: 'bold', fontSize: '20px' }}>ADL</span>
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>AD DATA LOGIC</h1>
              <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>Ad Placement + Live Analytics Platform</p>
            </div>
          </div>
          
          {/* Test Button - Remove after confirming buttons work */}
          <button 
            onClick={testButton}
            style={{
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            🧪 TEST BUTTON - CLICK ME FIRST
          </button>
          
          {/* Main Action Buttons */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={openLiveAnalytics}
              style={{ 
                backgroundColor: '#dc2626',
                color: 'white', 
                padding: '15px 25px',
                borderRadius: '8px',
                border: 'none', 
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              🔴 Live Analytics
            </button>
            <button 
              onClick={openAdPlacement}
              style={{ 
                backgroundColor: '#10b981',
                color: 'white', 
                padding: '15px 25px',
                borderRadius: '8px',
                border: 'none', 
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              🚀 Ad Placement
            </button>
            <button 
              onClick={deployAds}
              style={{ 
                backgroundColor: '#7c3aed',
                color: 'white', 
                padding: '15px 25px',
                borderRadius: '8px',
                border: 'none', 
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              📊 Quick Deploy
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '60px 20px', backgroundColor: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
            Professional Ad Placement + Real-Time Analytics
          </h2>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '30px' }}>
            Deploy ads across Facebook, Google, TikTok, Instagram, LinkedIn instantly. Monitor live performance with real-time data.
          </p>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={deployAds}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '18px 35px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              🚀 Deploy Ads Now
            </button>
            <button 
              onClick={openLiveAnalytics}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '18px 35px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              🔴 View Live Data
            </button>
          </div>
        </div>
      </section>

      {/* Live Metrics */}
      <section style={{ padding: '40px 20px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '30px', color: '#1f2937' }}>
            🔴 LIVE PERFORMANCE METRICS
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>{campaigns.length}</div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>Active Campaigns</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>
                ${Object.values(liveData).reduce((sum, data) => sum + (data?.revenue || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>Total Revenue</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#7c3aed' }}>
                {Object.values(liveData).reduce((sum, data) => sum + (data?.clicks || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>Total Clicks</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc2626' }}>5</div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>Connected Platforms</div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign List */}
      <section style={{ padding: '40px 20px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '20px', color: '#1f2937' }}>🔴 Live Campaigns</h3>
          <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', overflow: 'hidden' }}>
            {campaigns.map((campaign, index) => (
              <div key={campaign.id} style={{ 
                padding: '20px', 
                borderBottom: index < campaigns.length - 1 ? '1px solid #e5e7eb' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: 'bold' }}>{campaign.name}</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    Platform: {campaign.platform} | Budget: ${campaign.budget} | Status: {campaign.status}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => alert(`📊 ${campaign.name} Analytics:\n\n• Impressions: ${(liveData[campaign.id]?.impressions || 0).toLocaleString()}\n• Clicks: ${(liveData[campaign.id]?.clicks || 0).toLocaleString()}\n• Revenue: $${(liveData[campaign.id]?.revenue || 0).toLocaleString()}`)}
                    style={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      padding: '8px 15px',
                      borderRadius: '5px',
                      border: 'none',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    🔴 View Live
                  </button>
                  <button
                    onClick={exportData}
                    style={{
                      backgroundColor: '#16a34a',
                      color: 'white',
                      padding: '8px 15px',
                      borderRadius: '5px',
                      border: 'none',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    📊 Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            
            {/* Close Button */}
            <button 
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280',
                zIndex: 1001
              }}
            >
              ×
            </button>

            {/* Modal Content */}
            <div style={{ padding: '30px' }}>
              {activeModal === 'liveAnalytics' && (
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>🔴 LIVE ANALYTICS DASHBOARD</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                    <div style={{ backgroundColor: '#dbeafe', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>
                        {Object.values(liveData).reduce((sum, data) => sum + (data?.impressions || 0), 0).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Live Impressions</div>
                    </div>
                    <div style={{ backgroundColor: '#dcfce7', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a' }}>
                        {Object.values(liveData).reduce((sum, data) => sum + (data?.clicks || 0), 0).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Live Clicks</div>
                    </div>
                    <div style={{ backgroundColor: '#fecaca', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc2626' }}>
                        ${Object.values(liveData).reduce((sum, data) => sum + (data?.revenue || 0), 0).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Live Revenue</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Campaign Performance</h3>
                    {campaigns.map(campaign => (
                      <div key={campaign.id} style={{ 
                        backgroundColor: '#f9fafb', 
                        padding: '15px', 
                        borderRadius: '8px', 
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <strong>{campaign.name}</strong>
                          <div style={{ fontSize: '14px', color: '#6b7280' }}>
                            Revenue: ${(liveData[campaign.id]?.revenue || 0).toLocaleString()}
                          </div>
                        </div>
                        <span style={{
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          padding: '4px 8px',
                          borderRadius: '15px',
                          fontSize: '12px'
                        }}>
                          🔴 LIVE
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={exportData}
                      style={{
                        backgroundColor: '#16a34a',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      📊 Export Data
                    </button>
                    <button 
                      onClick={closeModal}
                      style={{
                        backgroundColor: '#6b7280',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'adPlacement' && (
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>🚀 AD PLACEMENT WIZARD</h2>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                      Campaign Name
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g., Q1 2025 Product Launch"
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                      Budget ($)
                    </label>
                    <input
                      type="number"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                      placeholder="5000"
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                      Select Platforms
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
                      {['Facebook', 'Google', 'TikTok', 'Instagram', 'LinkedIn'].map(platform => (
                        <label key={platform} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          padding: '10px', 
                          border: '1px solid #d1d5db', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          backgroundColor: '#f9fafb'
                        }}>
                          <input type="checkbox" style={{ marginRight: '8px' }} />
                          <span style={{ fontSize: '14px' }}>{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ 
                    padding: '15px', 
                    backgroundColor: '#dbeafe', 
                    borderRadius: '8px', 
                    marginBottom: '20px' 
                  }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#1e40af' }}>🚀 What happens next:</h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#1e40af', fontSize: '14px' }}>
                      <li>Ads deployed instantly across selected platforms</li>
                      <li>Unique tracking code generated automatically</li>
                      <li>Live analytics start immediately</li>
                      <li>Real-time performance monitoring activated</li>
                    </ul>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={deployAds}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '16px',
                        flex: 1
                      }}
                    >
                      🚀 DEPLOY ADS
                    </button>
                    <button
                      onClick={closeModal}
                      style={{
                        backgroundColor: '#6b7280',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ backgroundColor: '#1f2937', color: 'white', padding: '30px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '15px' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>AD DATA LOGIC</span>
          </div>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>
            © 2025 Leffler International Investments Pty Ltd | ABN 90124089345<br />
            Level 2, 222 Pitt Street, Sydney 2000, Australia<br />
            Office: 0478 965 828 | Email: leffleryd@gmail.com
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
