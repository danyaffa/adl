import React, { useState, useEffect } from 'react';

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
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>🔴 LIVE ANALYTICS</h2>
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
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Impressions</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Clicks</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Revenue</th>
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
                      onClick={() => {
                        const analytics = `📊 Live Analytics for ${campaign.name}

🔴 Real-time data:
• Impressions: ${(liveData[campaign.id]?.impressions || 0).toLocaleString()}
• Clicks: ${(liveData[campaign.id]?.clicks || 0).toLocaleString()}
• Revenue: $${(liveData[campaign.id]?.revenue || 0).toLocaleString()}
• CTR: ${((liveData[campaign.id]?.clicks / liveData[campaign.id]?.impressions * 100) || 0).toFixed(2)}%`;
                        alert(analytics);
                      }}
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
          onClick={() => alert('📊 CSV Export Complete! File downloaded: adl-live-analytics.csv')}
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

      const successMessage = `🚀 SUCCESS! Campaign Deployed!

📊 Campaign: ${placementData.campaignName}
🔖 Tracking Code: ${newTrackingCode}
💰 Budget: $${placementData.budget}
🎯 Platforms: ${placementData.platforms.join(', ') || 'All Platforms'}

✅ Your ads are now LIVE across all selected platforms!
🔴 Live analytics starting now
📈 View real-time performance in Dashboard`;

      alert(successMessage);
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

export default App;
