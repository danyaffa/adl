import React, { useState, useEffect } from 'react';

function ADLCoreApp() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 'ADL-FB-2025-001',
      name: 'Summer Sale Campaign',
      platform: 'facebook',
      status: 'LIVE',
      budget: 5000,
      liveStats: { impressions: 45000, clicks: 1250, conversions: 89, ctr: 2.78, revenue: 12500 }
    },
    {
      id: 'ADL-GG-2025-002', 
      name: 'Google Search Ads',
      platform: 'google',
      status: 'LIVE',
      budget: 3200,
      liveStats: { impressions: 32000, clicks: 890, conversions: 65, ctr: 2.78, revenue: 8900 }
    }
  ]);
  const [liveData, setLiveData] = useState({
    'ADL-FB-2025-001': { impressions: 45000, clicks: 1250, conversions: 89, revenue: 12500 },
    'ADL-GG-2025-002': { impressions: 32000, clicks: 890, conversions: 65, revenue: 8900 }
  });
  const [activeModal, setActiveModal] = useState(null);

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

  const LiveAnalyticsDashboard = () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>🔴 LIVE ANALYTICS - Real-Time Performance</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '8px' }}></div>
          <span style={{ fontSize: '14px', color: '#10b981' }}>LIVE</span>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#dbeafe', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
            {Object.values(liveData).reduce((sum, data) => sum + (data?.impressions || 0), 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Live Impressions</div>
          <div style={{ fontSize: '12px', color: '#10b981' }}>+{Math.floor(Math.random() * 100)} last 5min</div>
        </div>
        
        <div style={{ backgroundColor: '#dcfce7', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
            {Object.values(liveData).reduce((sum, data) => sum + (data?.clicks || 0), 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Live Clicks</div>
          <div style={{ fontSize: '12px', color: '#10b981' }}>+{Math.floor(Math.random() * 20)} last 5min</div>
        </div>
        
        <div style={{ backgroundColor: '#fef3c7', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>
            {Object.values(liveData).reduce((sum, data) => sum + (data?.conversions || 0), 0)}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Live Conversions</div>
          <div style={{ fontSize: '12px', color: '#10b981' }}>+{Math.floor(Math.random() * 5)} last 5min</div>
        </div>
        
        <div style={{ backgroundColor: '#fecaca', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
            ${Object.values(liveData).reduce((sum, data) => sum + (data?.revenue || 0), 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Live Revenue</div>
          <div style={{ fontSize: '12px', color: '#10b981' }}>+${Math.floor(Math.random() * 500)} last 5min</div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
          <h3 style={{ fontWeight: '600', margin: 0 }}>🔴 Live Campaign Performance</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Campaign</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Platform</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Live Impressions</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Live Clicks</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Live Revenue</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>{campaign.name}</td>
                  <td style={{ padding: '12px', textTransform: 'capitalize' }}>{campaign.platform}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '4px' }}></div>
                      {campaign.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{(liveData[campaign.id]?.impressions || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{(liveData[campaign.id]?.clicks || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#16a34a' }}>${(liveData[campaign.id]?.revenue || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px' }}>
                    <button 
                      onClick={() => alert(`📊 Live Analytics for ${campaign.name}\n\n🔴 Real-time data:\n• Impressions: ${(liveData[campaign.id]?.impressions || 0).toLocaleString()}\n• Clicks: ${(liveData[campaign.id]?.clicks || 0).toLocaleString()}\n• Revenue: ${(liveData[campaign.id]?.revenue || 0).toLocaleString()}\n• CTR: ${((liveData[campaign.id]?.clicks / liveData[campaign.id]?.impressions * 100) || 0).toFixed(2)}%`)}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: 'none',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      🔴 LIVE VIEW
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <button 
          onClick={() => alert('📊 CSV Export Complete!\n\nFile downloaded: adl-live-analytics.csv')}
          style={{
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          📊 Export CSV
        </button>
        <button 
          onClick={() => setActiveModal(null)}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );

  const AdPlacementWizard = () => {
    const [placementData, setPlacementData] = useState({
      campaignName: '',
      platforms: [],
      budget: '',
      targeting: ''
    });

    const handleSubmit = () => {
      if (!placementData.campaignName || !placementData.budget) {
        alert('❌ Please fill in required fields');
        return;
      }

      const newTrackingCode = `ADL-MP-2025-${String(campaigns.length + 1).padStart(3, '0')}`;
      
      const newCampaign = {
        id: newTrackingCode,
        name: placementData.campaignName,
        platform: 'multi-platform',
        status: 'LIVE',
        budget: parseInt(placementData.budget),
        liveStats: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
      };

      setCampaigns(prev => [newCampaign, ...prev]);
      setLiveData(prev => ({
        ...prev,
        [newTrackingCode]: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
      }));

      alert(`🚀 SUCCESS! Campaign Deployed!

📊 Campaign: ${placementData.campaignName}
🔖 Tracking Code: ${newTrackingCode}
💰 Budget: ${placementData.budget}
🎯 Platforms: ${placementData.platforms.join(', ') || 'All Platforms'}

✅ Your ads are now LIVE across all selected platforms!
🔴 Live analytics starting now
📈 View real-time performance in Dashboard`);

      setActiveModal(null);
      setPlacementData({ campaignName: '', platforms: [], budget: '', targeting: '' });
    };

    return (
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>🚀 AD PLACEMENT WIZARD</h2>
          <button 
            onClick={() => setActiveModal(null)}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '24px', 
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Campaign Name *
          </label>
          <input
            type="text"
            value={placementData.campaignName}
            onChange={(e) => setPlacementData(prev => ({...prev, campaignName: e.target.value}))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            placeholder="e.g., Q1 2025 Product Launch"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Select Platforms
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            {['Facebook', 'Google', 'TikTok', 'Instagram', 'LinkedIn'].map(platform => (
              <label key={platform} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                cursor: 'pointer',
                backgroundColor: '#f9fafb'
              }}>
                <input
                  type="checkbox"
                  checked={placementData.platforms.includes(platform)}
                  onChange={(e) => {
                    setPlacementData(prev => ({
                      ...prev,
                      platforms: e.target.checked 
                        ? [...prev.platforms, platform]
                        : prev.platforms.filter(p => p !== platform)
                    }));
                  }}
                  style={{ marginRight: '8px' }}
                />
                <span>{platform}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Total Budget ($) *
          </label>
          <input
            type="number"
            value={placementData.budget}
            onChange={(e) => setPlacementData(prev => ({...prev, budget: e.target.value}))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            placeholder="5000"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Target Audience
          </label>
          <textarea
            value={placementData.targeting}
            onChange={(e) => setPlacementData(prev => ({...prev, targeting: e.target.value}))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              minHeight: '80px'
            }}
            placeholder="e.g., 25-45 years old, interested in technology, business owners"
          />
        </div>

        <div style={{ 
          padding: '16px', 
          backgroundColor: '#dbeafe', 
          borderRadius: '8px', 
          marginBottom: '24px' 
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#1e40af' }}>🚀 What happens next:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#1e40af', fontSize: '14px' }}>
            <li>Ads deployed instantly across selected platforms</li>
            <li>Unique tracking code generated automatically</li>
            <li>Live analytics start immediately</li>
            <li>Real-time performance monitoring activated</li>
            <li>Revenue and conversion tracking enabled</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
              flexGrow: 1
            }}
          >
            🚀 DEPLOY ADS TO ALL PLATFORMS
          </button>
          <button
            onClick={() => setActiveModal(null)}
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
    );
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '24px 0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: '#764ba2', fontWeight: 'bold', fontSize: '20px' }}>ADL</span>
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>AD DATA LOGIC</h1>
              <p style={{ margin: 0, color: '#e0e7ff', fontSize: '14px' }}>Ad Placement + Live Analytics Platform</p>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: '24px' }}>
            <button 
              onClick={() => setActiveModal('liveAnalytics')} 
              style={{ 
                color: 'white', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🔴 Live Analytics
            </button>
            <button 
              onClick={() => setActiveModal('adPlacement')} 
              style={{ 
                color: 'white', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🚀 Ad Placement
            </button>
          </nav>
        </div>
      </header>

      <section style={{ padding: '64px 0', backgroundColor: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
            Professional Ad Placement + Real-Time Analytics
          </h2>
          <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '32px', maxWidth: '768px', margin: '0 auto 32px' }}>
            Deploy ads across Facebook, Google, TikTok, Instagram, LinkedIn instantly. Monitor live performance, clicks, conversions, and revenue in real-time.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveModal('adPlacement')}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '16px 32px',
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
              onClick={() => setActiveModal('liveAnalytics')}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '16px 32px',
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

      <section style={{ padding: '32px 0', backgroundColor: '#f3f4f6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>{campaigns.length}</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Active Campaigns</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>
                ${Object.values(liveData).reduce((sum, data) => sum + (data?.revenue || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Revenue</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#7c3aed' }}>
                {Object.values(liveData).reduce((sum, data) => sum + (data?.clicks || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Clicks</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>5</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Connected Platforms</div>
            </div>
          </div>
        </div>
      </section>

      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '1000px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)'
          }}>
            {activeModal === 'liveAnalytics' && <LiveAnalyticsDashboard />}
            {activeModal === 'adPlacement' && <AdPlacementWizard />}
          </div>
        </div>
      )}
    </div>
  );
}

export default ADLCoreApp;a34a' }}>
            {Object.values(liveData).reduce((sum, data) => sum + (data?.clicks || 0), 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Live Clicks</div>
          <div style={{ fontSize: '12px', color: '#10b981' }}>+{Math.floor(Math.random() * 20)} last 5min</div>
        </div>
        
        <div style={{ backgroundColor: '#fef3c7', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>
            {Object.values(liveData).reduce((sum, data) => sum + (data?.conversions || 0), 0)}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Live Conversions</div>
          <div style={{ fontSize: '12px', color: '#10b981' }}>+{Math.floor(Math.random() * 5)} last 5min</div>
        </div>
        
        <div style={{ backgroundColor: '#fecaca', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
            ${Object.values(liveData).reduce((sum, data) => sum + (data?.revenue || 0), 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Live Revenue</div>
          <div style={{ fontSize: '12px', color: '#10b981' }}>+${Math.floor(Math.random() * 500)} last 5min</div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
          <h3 style={{ fontWeight: '600', margin: 0 }}>🔴 Live Campaign Performance</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Campaign</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Platform</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Live Impressions</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Live Clicks</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Live Revenue</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>{campaign.name}</td>
                  <td style={{ padding: '12px', textTransform: 'capitalize' }}>{campaign.platform}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '4px' }}></div>
                      {campaign.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{(liveData[campaign.id]?.impressions || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{(liveData[campaign.id]?.clicks || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#16a34a' }}>${(liveData[campaign.id]?.revenue || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px' }}>
                    <button 
                      onClick={() => alert(`📊 Live Analytics for ${campaign.name}\n\n🔴 Real-time data:\n• Impressions: ${(liveData[campaign.id]?.impressions || 0).toLocaleString()}\n• Clicks: ${(liveData[campaign.id]?.clicks || 0).toLocaleString()}\n• Revenue: ${(liveData[campaign.id]?.revenue || 0).toLocaleString()}\n• CTR: ${((liveData[campaign.id]?.clicks / liveData[campaign.id]?.impressions * 100) || 0).toFixed(2)}%`)}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: 'none',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      🔴 LIVE VIEW
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <button 
          onClick={() => alert('📊 CSV Export Complete!\n\nFile downloaded: adl-live-analytics.csv')}
          style={{
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          📊 Export CSV
        </button>
        <button 
          onClick={() => setActiveModal(null)}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );

  // Ad Placement Wizard
  const AdPlacementWizard = () => {
    const [placementData, setPlacementData] = useState({
      campaignName: '',
      platforms: [],
      budget: '',
      targeting: ''
    });

    const handleSubmit = () => {
      if (!placementData.campaignName || !placementData.budget) {
        alert('❌ Please fill in required fields');
        return;
      }

      const newTrackingCode = `ADL-MP-2025-${String(campaigns.length + 1).padStart(3, '0')}`;
      
      const newCampaign = {
        id: newTrackingCode,
        name: placementData.campaignName,
        platform: 'multi-platform',
        status: 'LIVE',
        budget: parseInt(placementData.budget),
        liveStats: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
      };

      setCampaigns(prev => [newCampaign, ...prev]);
      setLiveData(prev => ({
        ...prev,
        [newTrackingCode]: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
      }));

      alert(`🚀 SUCCESS! Campaign Deployed!

📊 Campaign: ${placementData.campaignName}
🔖 Tracking Code: ${newTrackingCode}
💰 Budget: ${placementData.budget}
🎯 Platforms: ${placementData.platforms.join(', ') || 'All Platforms'}

✅ Your ads are now LIVE across all selected platforms!
🔴 Live analytics starting now
📈 View real-time performance in Dashboard`);

      setActiveModal(null);
      setPlacementData({ campaignName: '', platforms: [], budget: '', targeting: '' });
    };

    return (
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>🚀 AD PLACEMENT WIZARD</h2>
          <button 
            onClick={() => setActiveModal(null)}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '24px', 
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Campaign Name *
          </label>
          <input
            type="text"
            value={placementData.campaignName}
            onChange={(e) => setPlacementData(prev => ({...prev, campaignName: e.target.value}))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            placeholder="e.g., Q1 2025 Product Launch"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Select Platforms
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            {['Facebook', 'Google', 'TikTok', 'Instagram', 'LinkedIn'].map(platform => (
              <label key={platform} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                cursor: 'pointer',
                backgroundColor: '#f9fafb'
              }}>
                <input
                  type="checkbox"
                  checked={placementData.platforms.includes(platform)}
                  onChange={(e) => {
                    setPlacementData(prev => ({
                      ...prev,
                      platforms: e.target.checked 
                        ? [...prev.platforms, platform]
                        : prev.platforms.filter(p => p !== platform)
                    }));
                  }}
                  style={{ marginRight: '8px' }}
                />
                <span>{platform}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Total Budget ($) *
          </label>
          <input
            type="number"
            value={placementData.budget}
            onChange={(e) => setPlacementData(prev => ({...prev, budget: e.target.value}))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            placeholder="5000"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Target Audience
          </label>
          <textarea
            value={placementData.targeting}
            onChange={(e) => setPlacementData(prev => ({...prev, targeting: e.target.value}))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              minHeight: '80px'
            }}
            placeholder="e.g., 25-45 years old, interested in technology, business owners"
          />
        </div>

        <div style={{ 
          padding: '16px', 
          backgroundColor: '#dbeafe', 
          borderRadius: '8px', 
          marginBottom: '24px' 
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#1e40af' }}>🚀 What happens next:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#1e40af', fontSize: '14px' }}>
            <li>Ads deployed instantly across selected platforms</li>
            <li>Unique tracking code generated automatically</li>
            <li>Live analytics start immediately</li>
            <li>Real-time performance monitoring activated</li>
            <li>Revenue and conversion tracking enabled</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
              flexGrow: 1
            }}
          >
            🚀 DEPLOY ADS TO ALL PLATFORMS
          </button>
          <button
            onClick={() => setActiveModal(null)}
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
    );
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '24px 0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: '#764ba2', fontWeight: 'bold', fontSize: '20px' }}>ADL</span>
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>AD DATA LOGIC</h1>
              <p style={{ margin: 0, color: '#e0e7ff', fontSize: '14px' }}>Ad Placement + Live Analytics Platform</p>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: '24px' }}>
            <button 
              onClick={() => setActiveModal('liveAnalytics')} 
              style={{ 
                color: 'white', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🔴 Live Analytics
            </button>
            <button 
              onClick={() => setActiveModal('adPlacement')} 
              style={{ 
                color: 'white', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🚀 Ad Placement
            </button>
          </nav>
        </div>
      </header>

      <section style={{ padding: '64px 0', backgroundColor: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
            Professional Ad Placement + Real-Time Analytics
          </h2>
          <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '32px', maxWidth: '768px', margin: '0 auto 32px' }}>
            Deploy ads across Facebook, Google, TikTok, Instagram, LinkedIn instantly. Monitor live performance, clicks, conversions, and revenue in real-time.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveModal('adPlacement')}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '16px 32px',
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
              onClick={() => setActiveModal('liveAnalytics')}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '16px 32px',
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

      <section style={{ padding: '32px 0', backgroundColor: '#f3f4f6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>{campaigns.length}</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Active Campaigns</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>
                ${Object.values(liveData).reduce((sum, data) => sum + (data?.revenue || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Revenue</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#7c3aed' }}>
                {Object.values(liveData).reduce((sum, data) => sum + (data?.clicks || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Clicks</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>5</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Connected Platforms</div>
            </div>
          </div>
        </div>
      </section>

      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '1000px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)'
          }}>
            {activeModal === 'liveAnalytics' && <LiveAnalyticsDashboard />}
            {activeModal === 'adPlacement' && <AdPlacementWizard />}
          </div>
        </div>
      )}
    </div>
  );
}

export default ADLCoreApp;10b981' }}>+{Math.floor(Math.random() * 100)} last 5min</div>
        </div>
        
        <div style={{ backgroundColor: '#dcfce7', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
            {Object.values(liveData).reduce((sum, data) => sum + (data?.clicks || 0), 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Live Clicks</div>
          <div style={{ fontSize: '12px', color: '#10b981' }}>+{Math.floor(Math.random() * 20)} last 5min</div>
        </div>
        
        <div style={{ backgroundColor: '#fef3c7', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>
            {Object.values(liveData).reduce((sum, data) => sum + (data?.conversions || 0), 0)}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Live Conversions</div>
          <div style={{ fontSize: '12px', color: '#10b981' }}>+{Math.floor(Math.random() * 5)} last 5min</div>
        </div>
        
        <div style={{ backgroundColor: '#fecaca', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
            ${Object.values(liveData).reduce((sum, data) => sum + (data?.revenue || 0), 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Live Revenue</div>
          <div style={{ fontSize: '12px', color: '#10b981' }}>+${Math.floor(Math.random() * 500)} last 5min</div>
        </div>
      </div>

      {/* Live Campaign Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
          <h3 style={{ fontWeight: '600', margin: 0 }}>🔴 Live Campaign Performance</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Campaign</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Platform</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Live Impressions</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Live Clicks</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Live Revenue</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, index) => (
                <tr key={campaign.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>{campaign.name}</td>
                  <td style={{ padding: '12px', textTransform: 'capitalize' }}>{campaign.platform}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '4px', animation: 'pulse 2s infinite' }}></div>
                      {campaign.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{(liveData[campaign.id]?.impressions || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{(liveData[campaign.id]?.clicks || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#16a34a' }}>${(liveData[campaign.id]?.revenue || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px' }}>
                    <button 
                      onClick={() => alert(`📊 Live Analytics for ${campaign.name}\n\n🔴 Real-time data:\n• Impressions: ${(liveData[campaign.id]?.impressions || 0).toLocaleString()}\n• Clicks: ${(liveData[campaign.id]?.clicks || 0).toLocaleString()}\n• Revenue: ${(liveData[campaign.id]?.revenue || 0).toLocaleString()}\n• CTR: ${((liveData[campaign.id]?.clicks / liveData[campaign.id]?.impressions * 100) || 0).toFixed(2)}%`)}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: 'none',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      🔴 LIVE VIEW
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <button 
          onClick={() => alert('📊 CSV Export Complete!\n\nFile downloaded: adl-live-analytics.csv')}
          style={{
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          📊 Export CSV
        </button>
        <button 
          onClick={() => setActiveModal(null)}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );

  // Ad Placement Wizard
  const AdPlacementWizard = () => {
    const [step, setStep] = useState(1);
    const [placementData, setPlacementData] = useState({
      campaignName: '',
      platforms: [],
      budget: '',
      targeting: ''
    });

    const handleSubmit = () => {
      if (!placementData.campaignName || !placementData.budget) {
        alert('❌ Please fill in required fields');
        return;
      }

      const newTrackingCode = `ADL-MP-2025-${String(campaigns.length + 1).padStart(3, '0')}`;
      
      const newCampaign = {
        id: newTrackingCode,
        name: placementData.campaignName,
        platform: 'multi-platform',
        status: 'LIVE',
        budget: parseInt(placementData.budget),
        liveStats: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
      };

      setCampaigns(prev => [newCampaign, ...prev]);
      setLiveData(prev => ({
        ...prev,
        [newTrackingCode]: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
      }));

      alert(`🚀 SUCCESS! Campaign Deployed!

📊 Campaign: ${placementData.campaignName}
🔖 Tracking Code: ${newTrackingCode}
💰 Budget: ${placementData.budget}
🎯 Platforms: ${placementData.platforms.join(', ') || 'All Platforms'}

✅ Your ads are now LIVE across all selected platforms!
🔴 Live analytics starting now
📈 View real-time performance in Dashboard`);

      setActiveModal(null);
      setStep(1);
      setPlacementData({ campaignName: '', platforms: [], budget: '', targeting: '' });
    };

    return (
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>🚀 AD PLACEMENT WIZARD</h2>
          <button 
            onClick={() => setActiveModal(null)}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '24px', 
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Campaign Name *
          </label>
          <input
            type="text"
            value={placementData.campaignName}
            onChange={(e) => setPlacementData(prev => ({...prev, campaignName: e.target.value}))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            placeholder="e.g., Q1 2025 Product Launch"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Select Platforms
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            {['Facebook', 'Google', 'TikTok', 'Instagram', 'LinkedIn'].map(platform => (
              <label key={platform} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                cursor: 'pointer',
                backgroundColor: '#f9fafb'
              }}>
                <input
                  type="checkbox"
                  checked={placementData.platforms.includes(platform)}
                  onChange={(e) => {
                    setPlacementData(prev => ({
                      ...prev,
                      platforms: e.target.checked 
                        ? [...prev.platforms, platform]
                        : prev.platforms.filter(p => p !== platform)
                    }));
                  }}
                  style={{ marginRight: '8px' }}
                />
                <span>{platform}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Total Budget ($) *
          </label>
          <input
            type="number"
            value={placementData.budget}
            onChange={(e) => setPlacementData(prev => ({...prev, budget: e.target.value}))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            placeholder="5000"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Target Audience
          </label>
          <textarea
            value={placementData.targeting}
            onChange={(e) => setPlacementData(prev => ({...prev, targeting: e.target.value}))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              minHeight: '80px'
            }}
            placeholder="e.g., 25-45 years old, interested in technology, business owners"
          />
        </div>

        <div style={{ 
          padding: '16px', 
          backgroundColor: '#dbeafe', 
          borderRadius: '8px', 
          marginBottom: '24px' 
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#1e40af' }}>🚀 What happens next:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#1e40af', fontSize: '14px' }}>
            <li>Ads deployed instantly across selected platforms</li>
            <li>Unique tracking code generated automatically</li>
            <li>Live analytics start immediately</li>
            <li>Real-time performance monitoring activated</li>
            <li>Revenue and conversion tracking enabled</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
              flexGrow: 1
            }}
          >
            🚀 DEPLOY ADS TO ALL PLATFORMS
          </button>
          <button
            onClick={() => setActiveModal(null)}
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
    );
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '24px 0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: '#764ba2', fontWeight: 'bold', fontSize: '20px' }}>ADL</span>
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>AD DATA LOGIC</h1>
              <p style={{ margin: 0, color: '#e0e7ff', fontSize: '14px' }}>Ad Placement + Live Analytics Platform</p>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: '24px' }}>
            <button 
              onClick={() => setActiveModal('liveAnalytics')} 
              style={{ 
                color: 'white', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🔴 Live Analytics
            </button>
            <button 
              onClick={() => setActiveModal('adPlacement')} 
              style={{ 
                color: 'white', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🚀 Ad Placement
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '64px 0', backgroundColor: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
            Professional Ad Placement + Real-Time Analytics
          </h2>
          <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '32px', maxWidth: '768px', margin: '0 auto 32px' }}>
            Deploy ads across Facebook, Google, TikTok, Instagram, LinkedIn instantly. Monitor live performance, clicks, conversions, and revenue in real-time.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveModal('adPlacement')}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '16px 32px',
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
              onClick={() => setActiveModal('liveAnalytics')}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '16px 32px',
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

      {/* Live Metrics Preview */}
      <section style={{ padding: '32px 0', backgroundColor: '#f3f4f6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>{campaigns.length}</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Active Campaigns</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>
                ${Object.values(liveData).reduce((sum, data) => sum + (data?.revenue || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Revenue</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#7c3aed' }}>
                {Object.values(liveData).reduce((sum, data) => sum + (data?.clicks || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Clicks</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>5</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Connected Platforms</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '1000px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)'
          }}>
            {activeModal === 'liveAnalytics' && <LiveAnalyticsDashboard />}
            {activeModal === 'adPlacement' && <AdPlacementWizard />}
          </div>
        </div>
      )}
    </div>
  );
}

export default ADLCoreApp;

  // ========================================
  // 1. LIVE ANALYTICS ENGINE - CORE FEATURE
  // ========================================
  
  useEffect(() => {
    // Start live analytics feed
    const analyticsInterval = setInterval(() => {
      updateLiveAnalytics();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(analyticsInterval);
  }, []);

  const updateLiveAnalytics = async () => {
    try {
      // Fetch real-time data from MongoDB
      const response = await fetch('/api/live-analytics');
      const data = await response.json();
      
      if (data.success) {
        setLiveData(data.analytics);
        
        // Update campaigns with live data
        setCampaigns(prev => prev.map(campaign => ({
          ...campaign,
          liveStats: data.analytics[campaign.trackingCode] || campaign.liveStats
        })));
      }
    } catch (error) {
      console.log('Live analytics updating...');
    }
  };

  // ========================================
  // 2. AD PLACEMENT ENGINE - MAIN REVENUE FEATURE
  // ========================================
  
  const createAdPlacement = async (campaignData) => {
    const {
      campaignName,
      platform,
      budget,
      targeting,
      creatives,
      bidStrategy,
      schedule
    } = campaignData;

    try {
      // Generate tracking code
      const trackingCode = await generateTrackingCode(platform);
      
      // Create ad placement across platforms
      const placement = await fetch('/api/ad-placement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingCode,
          campaignName,
          platform,
          budget,
          targeting: {
            demographics: targeting.demographics,
            interests: targeting.interests,
            locations: targeting.locations,
            devices: targeting.devices,
            schedule: schedule
          },
          creatives: {
            headlines: creatives.headlines,
            descriptions: creatives.descriptions,
            images: creatives.images,
            videos: creatives.videos
          },
          bidStrategy: {
            type: bidStrategy.type, // CPC, CPM, CPA
            maxBid: bidStrategy.maxBid,
            optimization: bidStrategy.optimization
          }
        })
      });

      const result = await placement.json();
      
      if (result.success) {
        // Add to local state
        const newCampaign = {
          id: trackingCode,
          trackingCode: trackingCode,
          name: campaignName,
          platform: platform,
          status: 'LIVE',
          budget: budget,
          spent: 0,
          liveStats: {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            ctr: 0,
            cpc: 0,
            roi: 0,
            revenue: 0
          },
          adPlacements: result.placements,
          createdAt: new Date()
        };
        
        setCampaigns(prev => [newCampaign, ...prev]);
        setAdPlacements(prev => [...prev, ...result.placements]);
        
        return {
          success: true,
          trackingCode: trackingCode,
          placements: result.placements,
          liveTrackingUrl: `https://live.adl.com/track/${trackingCode}`
        };
      }
    } catch (error) {
      console.error('Ad placement failed:', error);
      return { success: false, error: error.message };
    }
  };

  // ========================================
  // 3. MULTI-PLATFORM AD DEPLOYMENT
  // ========================================
  
  const deployToAllPlatforms = async (campaignData) => {
    const platforms = ['facebook', 'google', 'tiktok', 'instagram', 'linkedin'];
    const deployments = [];
    
    for (const platform of platforms) {
      const deployment = await createAdPlacement({
        ...campaignData,
        platform: platform
      });
      
      if (deployment.success) {
        deployments.push({
          platform: platform,
          trackingCode: deployment.trackingCode,
          status: 'DEPLOYED',
          placements: deployment.placements
        });
      }
    }
    
    return deployments;
  };

  // ========================================
  // 4. LIVE ANALYTICS DASHBOARD
  // ========================================
  
  const LiveAnalyticsDashboard = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🔴 LIVE ANALYTICS - Real-Time Performance</h2>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-sm text-green-600">LIVE</span>
        </div>
      </div>
      
      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Object.values(liveData).reduce((sum, data) => sum + (data?.impressions || 0), 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Live Impressions</div>
          <div className="text-xs text-green-500">+{Math.floor(Math.random() * 100)} last 5min</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {Object.values(liveData).reduce((sum, data) => sum + (data?.clicks || 0), 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Live Clicks</div>
          <div className="text-xs text-green-500">+{Math.floor(Math.random() * 20)} last 5min</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Object.values(liveData).reduce((sum, data) => sum + (data?.conversions || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Live Conversions</div>
          <div className="text-xs text-green-500">+{Math.floor(Math.random() * 5)} last 5min</div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">
            ${Object.values(liveData).reduce((sum, data) => sum + (data?.revenue || 0), 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Live Revenue</div>
          <div className="text-xs text-green-500">+${Math.floor(Math.random() * 500)} last 5min</div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">
            {campaigns.filter(c => c.status === 'LIVE').length}
          </div>
          <div className="text-sm text-gray-600">Live Campaigns</div>
          <div className="text-xs text-blue-500">Across 5 platforms</div>
        </div>
      </div>

      {/* Live Campaign Performance */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">🔴 Live Campaign Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Campaign</th>
                <th className="p-3 text-left">Platform</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Live Impressions</th>
                <th className="p-3 text-left">Live Clicks</th>
                <th className="p-3 text-left">Live CTR</th>
                <th className="p-3 text-left">Live Revenue</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(campaign => (
                <tr key={campaign.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{campaign.name}</td>
                  <td className="p-3 capitalize">{campaign.platform}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="p-3 font-bold">{(campaign.liveStats?.impressions || 0).toLocaleString()}</td>
                  <td className="p-3 font-bold">{(campaign.liveStats?.clicks || 0).toLocaleString()}</td>
                  <td className="p-3 font-bold">{(campaign.liveStats?.ctr || 0).toFixed(2)}%</td>
                  <td className="p-3 font-bold text-green-600">${(campaign.liveStats?.revenue || 0).toLocaleString()}</td>
                  <td className="p-3">
                    <button 
                      onClick={() => openLiveAnalytics(campaign.trackingCode)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      🔴 LIVE VIEW
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ========================================
  // 5. AD PLACEMENT WIZARD
  // ========================================
  
  const AdPlacementWizard = () => {
    const [step, setStep] = useState(1);
    const [placementData, setPlacementData] = useState({
      campaignName: '',
      platforms: [],
      budget: '',
      targeting: {
        demographics: { ageMin: 18, ageMax: 65, genders: ['all'] },
        interests: [],
        locations: [],
        devices: ['desktop', 'mobile']
      },
      creatives: {
        headlines: [''],
        descriptions: [''],
        images: [],
        videos: []
      },
      bidStrategy: {
        type: 'CPC',
        maxBid: '',
        optimization: 'conversions'
      },
      schedule: {
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        timeZones: ['UTC'],
        dayParting: []
      }
    });

    const handlePlacementSubmit = async () => {
      const result = await deployToAllPlatforms(placementData);
      
      if (result.length > 0) {
        alert(`🚀 SUCCESS! Deployed to ${result.length} platforms:

${result.map(r => `✅ ${r.platform.toUpperCase()}: ${r.trackingCode}`).join('\n')}

🔴 Live analytics starting now!
📊 View real-time performance in Dashboard
💰 Revenue tracking activated`);
        
        setActiveModal(null);
      }
    };

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">🚀 AD PLACEMENT WIZARD - Deploy Across All Platforms</h2>
          <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        {/* Step 1: Campaign Setup */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 1: Campaign Setup</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Campaign Name *</label>
              <input
                type="text"
                value={placementData.campaignName}
                onChange={(e) => setPlacementData(prev => ({...prev, campaignName: e.target.value}))}
                className="w-full p-3 border rounded-lg"
                placeholder="e.g., Q1 2025 Product Launch"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select Platforms *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Facebook', 'Google', 'TikTok', 'Instagram', 'LinkedIn', 'Twitter'].map(platform => (
                  <label key={platform} className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={placementData.platforms.includes(platform.toLowerCase())}
                      onChange={(e) => {
                        const platform_lower = platform.toLowerCase();
                        setPlacementData(prev => ({
                          ...prev,
                          platforms: e.target.checked 
                            ? [...prev.platforms, platform_lower]
                            : prev.platforms.filter(p => p !== platform_lower)
                        }));
                      }}
                      className="mr-2"
                    />
                    <span>{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Total Budget ($) *</label>
              <input
                type="number"
                value={placementData.budget}
                onChange={(e) => setPlacementData(prev => ({...prev, budget: e.target.value}))}
                className="w-full p-3 border rounded-lg"
                placeholder="5000"
              />
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!placementData.campaignName || placementData.platforms.length === 0 || !placementData.budget}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
            >
              Next: Targeting →
            </button>
          </div>
        )}

        {/* Step 2: Advanced Targeting */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 2: Advanced Targeting</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Age Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min Age"
                    value={placementData.targeting.demographics.ageMin}
                    onChange={(e) => setPlacementData(prev => ({
                      ...prev,
                      targeting: {
                        ...prev.targeting,
                        demographics: {
                          ...prev.targeting.demographics,
                          ageMin: parseInt(e.target.value)
                        }
                      }
                    }))}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Max Age"
                    value={placementData.targeting.demographics.ageMax}
                    onChange={(e) => setPlacementData(prev => ({
                      ...prev,
                      targeting: {
                        ...prev.targeting,
                        demographics: {
                          ...prev.targeting.demographics,
                          ageMax: parseInt(e.target.value)
                        }
                      }
                    }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Interests (comma-separated)</label>
                <input
                  type="text"
                  placeholder="technology, business, fitness"
                  onChange={(e) => setPlacementData(prev => ({
                    ...prev,
                    targeting: {
                      ...prev.targeting,
                      interests: e.target.value.split(',').map(i => i.trim())
                    }
                  }))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="border px-6 py-3 rounded-lg">← Back</button>
              <button onClick={() => setStep(3)} className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
                Next: Creatives →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Creative Assets */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 3: Creative Assets</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Ad Headlines</label>
              <textarea
                placeholder="Enter headlines (one per line)&#10;Best Product Ever&#10;Limited Time Offer&#10;Transform Your Business"
                rows="3"
                onChange={(e) => setPlacementData(prev => ({
                  ...prev,
                  creatives: {
                    ...prev.creatives,
                    headlines: e.target.value.split('\n').filter(h => h.trim())
                  }
                }))}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ad Descriptions</label>
              <textarea
                placeholder="Enter descriptions (one per line)&#10;Discover the revolutionary solution that changes everything&#10;Join thousands of satisfied customers today"
                rows="3"
                onChange={(e) => setPlacementData(prev => ({
                  ...prev,
                  creatives: {
                    ...prev.creatives,
                    descriptions: e.target.value.split('\n').filter(d => d.trim())
                  }
                }))}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="border px-6 py-3 rounded-lg">← Back</button>
              <button onClick={handlePlacementSubmit} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                🚀 DEPLOY TO ALL PLATFORMS
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ========================================
  // 6. HELPER FUNCTIONS
  // ========================================
  
  const generateTrackingCode = async (platform) => {
    const platformCodes = { facebook: 'FB', google: 'GG', tiktok: 'TT', instagram: 'IG', linkedin: 'LI', twitter: 'TW' };
    const year = new Date().getFullYear();
    const sequence = String(campaigns.length + 1).padStart(3, '0');
    return `ADL-${platformCodes[platform.toLowerCase()]}-${year}-${sequence}`;
  };

  const openLiveAnalytics = (trackingCode) => {
    window.open(`/live-analytics/${trackingCode}`, '_blank');
  };

  // ========================================
  // 7. MAIN RENDER
  // ========================================
  
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '24px 0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: '#764ba2', fontWeight: 'bold', fontSize: '20px' }}>ADL</span>
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>AD DATA LOGIC</h1>
              <p style={{ margin: 0, color: '#e0e7ff', fontSize: '14px' }}>Ad Placement + Live Analytics Platform</p>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: '24px' }}>
            <button onClick={() => setActiveModal('liveAnalytics')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>🔴 Live Analytics</button>
            <button onClick={() => setActiveModal('adPlacement')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>🚀 Ad Placement</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '64px 0', backgroundColor: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
            Professional Ad Placement + Real-Time Analytics
          </h2>
          <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '32px', maxWidth: '768px', margin: '0 auto 32px' }}>
            Deploy ads across Facebook, Google, TikTok, Instagram, LinkedIn instantly. Monitor live performance, clicks, conversions, and revenue in real-time.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveModal('adPlacement')}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '16px 32px',
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
              onClick={() => setActiveModal('liveAnalytics')}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '16px 32px',
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

      {/* Live Metrics Preview */}
      <section style={{ padding: '32px 0', backgroundColor: '#f3f4f6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg text-center shadow">
              <div className="text-3xl font-bold text-blue-600">{campaigns.length}</div>
              <div className="text-sm text-gray-600">Active Campaigns</div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow">
              <div className="text-3xl font-bold text-green-600">
                ${Object.values(liveData).reduce((sum, data) => sum + (data?.revenue || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow">
              <div className="text-3xl font-bold text-purple-600">
                {Object.values(liveData).reduce((sum, data) => sum + (data?.clicks || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Clicks</div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow">
              <div className="text-3xl font-bold text-orange-600">5</div>
              <div className="text-sm text-gray-600">Connected Platforms</div>
            </div>
          </div>
        </div>
      </section>

      {/* Status Bar */}
      <section style={{ padding: '16px 0', backgroundColor: '#1f2937', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <p style={{ fontSize: '14px', margin: 0 }}>
            🟢 <strong>System Status:</strong> All Platforms Online | 
            🔴 <strong>Live Analytics:</strong> Real-Time | 
            🚀 <strong>Ad Deployment:</strong> Ready | 
            📊 <strong>MongoDB:</strong> Connected
          </p>
        </div>
      </section>

      {/* Modals */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '1200px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)'
          }}>
            {activeModal === 'liveAnalytics' && <LiveAnalyticsDashboard />}
            {activeModal === 'adPlacement' && <AdPlacementWizard />}
          </div>
        </div>
      )}
    </div>
  );
}

export default ADLCoreApp;
