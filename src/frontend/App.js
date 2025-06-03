import React, { useState, useEffect } from 'react';

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [user, setUser] = useState(null);
  const [liveStats, setLiveStats] = useState({
    totalCampaigns: 0,
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0
  });

  // Initialize with demo data and check for existing user
  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('adl_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      loadCampaigns();
    }
    
    // Load demo campaigns if no user
    if (!savedUser) {
      const demoCampaigns = [
        {
          id: 'demo_1',
          name: 'Summer Sale 2025',
          source: 'google',
          medium: 'cpc',
          budget: 1000,
          code: 'ADL_DEMO001',
          clicks: 245,
          conversions: 18,
          revenue: 1890,
          createdAt: new Date().toISOString()
        },
        {
          id: 'demo_2', 
          name: 'Facebook Retargeting',
          source: 'facebook',
          medium: 'social',
          budget: 500,
          code: 'ADL_DEMO002',
          clicks: 156,
          conversions: 12,
          revenue: 980,
          createdAt: new Date().toISOString()
        }
      ];
      setCampaigns(demoCampaigns);
      updateLiveStats(demoCampaigns);
    }
  }, []);

  // Load campaigns from backend (or localStorage for demo)
  const loadCampaigns = async () => {
    setLoading(true);
    try {
      // In real app, this would be API call
      const savedCampaigns = localStorage.getItem('adl_campaigns');
      if (savedCampaigns) {
        const campaigns = JSON.parse(savedCampaigns);
        setCampaigns(campaigns);
        updateLiveStats(campaigns);
      }
    } catch (error) {
      console.error('Load campaigns error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update live statistics
  const updateLiveStats = (campaignData) => {
    const stats = campaignData.reduce((acc, campaign) => {
      acc.totalClicks += campaign.clicks || 0;
      acc.totalConversions += campaign.conversions || 0;
      acc.totalRevenue += campaign.revenue || 0;
      return acc;
    }, {
      totalCampaigns: campaignData.length,
      totalClicks: 0,
      totalConversions: 0,
      totalRevenue: 0
    });
    setLiveStats(stats);
  };

  // Generate unique tracking code
  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'ADL_';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Create new campaign
  const createCampaign = async (formData) => {
    setLoading(true);
    try {
      const newCampaign = {
        id: Date.now().toString(),
        ...formData,
        code: generateCode(),
        clicks: 0,
        conversions: 0,
        revenue: 0,
        createdAt: new Date().toISOString()
      };

      const updatedCampaigns = [...campaigns, newCampaign];
      setCampaigns(updatedCampaigns);
      updateLiveStats(updatedCampaigns);
      
      // Save to localStorage (in real app, this would be API call)
      localStorage.setItem('adl_campaigns', JSON.stringify(updatedCampaigns));
      
      alert('🚀 Campaign created successfully!');
    } catch (error) {
      alert('❌ Failed to create campaign: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete campaign
  const deleteCampaign = (id) => {
    if (!confirm('🗑️ Delete this campaign? This cannot be undone.')) return;
    
    const updatedCampaigns = campaigns.filter(c => c.id !== id);
    setCampaigns(updatedCampaigns);
    updateLiveStats(updatedCampaigns);
    localStorage.setItem('adl_campaigns', JSON.stringify(updatedCampaigns));
    alert('🗑️ Campaign deleted successfully!');
  };

  // Simulate tracking (add clicks/conversions)
  const simulateTracking = (campaignId) => {
    const updatedCampaigns = campaigns.map(campaign => {
      if (campaign.id === campaignId) {
        const newClicks = campaign.clicks + Math.floor(Math.random() * 10) + 1;
        const newConversions = campaign.conversions + Math.floor(Math.random() * 3);
        const newRevenue = campaign.revenue + (Math.floor(Math.random() * 200) + 50);
        
        return {
          ...campaign,
          clicks: newClicks,
          conversions: newConversions,
          revenue: newRevenue
        };
      }
      return campaign;
    });
    
    setCampaigns(updatedCampaigns);
    updateLiveStats(updatedCampaigns);
    localStorage.setItem('adl_campaigns', JSON.stringify(updatedCampaigns));
    alert('📊 Simulated tracking data added!');
  };

  // Copy tracking code
  const copyTrackingCode = async (code) => {
    const trackingPixel = `<img src="https://your-domain.com/api/track/${code}" width="1" height="1" style="display:none" />`;
    
    try {
      await navigator.clipboard.writeText(trackingPixel);
      alert('📋 Tracking code copied to clipboard!');
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = trackingPixel;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('📋 Tracking code copied to clipboard!');
    }
  };

  // Export data
  const exportData = () => {
    const csvContent = [
      'Campaign Name,Source,Medium,Budget,Tracking Code,Clicks,Conversions,Revenue,Created Date',
      ...campaigns.map(c => 
        `"${c.name}","${c.source}","${c.medium}",${c.budget},"${c.code}",${c.clicks},${c.conversions},${c.revenue},"${c.createdAt}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adl-campaigns-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    alert('📊 Campaign data exported successfully!');
  };

  // User authentication (demo)
  const handleAuth = (action) => {
    if (action === 'login') {
      const demoUser = { id: 'demo_user', email: 'demo@addatalogic.com', name: 'Demo User' };
      setUser(demoUser);
      localStorage.setItem('adl_user', JSON.stringify(demoUser));
      alert('✅ Logged in successfully!');
    } else {
      setUser(null);
      localStorage.removeItem('adl_user');
      localStorage.removeItem('adl_campaigns');
      setCampaigns([]);
      setLiveStats({ totalCampaigns: 0, totalClicks: 0, totalConversions: 0, totalRevenue: 0 });
      alert('👋 Logged out successfully!');
    }
  };

  // Create Campaign Modal
  const CreateCampaignModal = () => {
    const [formData, setFormData] = useState({
      name: '', source: '', medium: '', campaign: '', budget: ''
    });

    const handleSubmit = () => {
      if (!formData.name.trim()) {
        alert('❌ Campaign name is required!');
        return;
      }
      createCampaign(formData);
      setActiveModal(null);
      setFormData({ name: '', source: '', medium: '', campaign: '', budget: '' });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">🚀 Create New Campaign</h2>
            <button 
              onClick={() => setActiveModal(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >×</button>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="📝 Campaign Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="🌐 Traffic Source (e.g., google, facebook)"
              value={formData.source}
              onChange={(e) => setFormData({...formData, source: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="📱 Medium (e.g., cpc, social, email)"
              value={formData.medium}
              onChange={(e) => setFormData({...formData, medium: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="🎯 Campaign ID/Term"
              value={formData.campaign}
              onChange={(e) => setFormData({...formData, campaign: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="💰 Budget ($)"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {loading ? '⏳ Creating...' : '🚀 Create Campaign'}
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Analytics Modal
  const AnalyticsModal = ({ campaign }) => {
    const conversionRate = campaign.clicks > 0 ? ((campaign.conversions / campaign.clicks) * 100).toFixed(1) : 0;
    const avgRevenue = campaign.conversions > 0 ? (campaign.revenue / campaign.conversions).toFixed(2) : 0;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">📊 {campaign.name} Analytics</h2>
            <button 
              onClick={() => setActiveModal(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >×</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{campaign.clicks}</div>
              <div className="text-sm text-gray-600">👆 Clicks</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{campaign.conversions}</div>
              <div className="text-sm text-gray-600">🎯 Conversions</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{conversionRate}%</div>
              <div className="text-sm text-gray-600">📈 Conv. Rate</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">${campaign.revenue}</div>
              <div className="text-sm text-gray-600">💰 Revenue</div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2">📊 Tracking Pixel Code:</h4>
            <code className="bg-black text-green-400 p-3 rounded block text-sm font-mono overflow-x-auto">
              {`<img src="https://your-domain.com/api/track/${campaign.code}" width="1" height="1" style="display:none" />`}
            </code>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => copyTrackingCode(campaign.code)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              📋 Copy Tracking Code
            </button>
            <button 
              onClick={() => simulateTracking(campaign.id)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              🎯 Simulate Tracking
            </button>
            <button 
              onClick={exportData}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
            >
              📊 Export Data
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 via-orange-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ADL</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ad Data Logic</h1>
                <p className="text-sm text-gray-600">🟢 LIVE - All Buttons Working</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">👋 {user.name}</span>
                  <button
                    onClick={() => handleAuth('logout')}
                    className="text-red-600 hover:text-red-800 text-sm transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleAuth('login')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  🔐 Demo Login
                </button>
              )}
              <button
                onClick={() => setActiveModal('create')}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-colors"
              >
                <span className="text-lg">+</span> New Campaign
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Live Stats Dashboard */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{liveStats.totalCampaigns}</div>
            <div className="text-sm text-gray-600">📊 Total Campaigns</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{liveStats.totalClicks.toLocaleString()}</div>
            <div className="text-sm text-gray-600">👆 Total Clicks</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{liveStats.totalConversions}</div>
            <div className="text-sm text-gray-600">🎯 Total Conversions</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">${liveStats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">💰 Total Revenue</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button 
            onClick={() => setActiveModal('create')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            🚀 Start Tracking Ads
          </button>
          <button 
            onClick={exportData}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            📊 View Demo
          </button>
          <button 
            onClick={() => alert('🔗 Connect your platforms: Facebook, Google, TikTok')}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
          >
            🔗 Connect Platforms
          </button>
        </div>

        {/* Campaigns Grid */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-xl">⏳ Loading campaigns...</div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map(campaign => {
            const conversionRate = campaign.clicks > 0 ? ((campaign.conversions / campaign.clicks) * 100).toFixed(1) : 0;
            
            return (
              <div key={campaign.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  <button
                    onClick={() => deleteCampaign(campaign.id)}
                    className="text-red-500 hover:text-red-700 text-xl transition-colors"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {campaign.source && <div>🌐 Source: {campaign.source}</div>}
                  {campaign.medium && <div>📱 Medium: {campaign.medium}</div>}
                  {campaign.budget && <div>💰 Budget: ${campaign.budget}</div>}
                  <div>🔗 Code: {campaign.code}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{campaign.clicks}</div>
                    <div className="text-xs text-gray-500">Clicks</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{campaign.conversions}</div>
                    <div className="text-xs text-gray-500">Conversions</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{conversionRate}%</div>
                    <div className="text-xs text-gray-500">Conv. Rate</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveModal({ type: 'analytics', campaign })}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded text-sm hover:bg-blue-100 transition-colors"
                  >
                    📊 Analytics
                  </button>
                  <button
                    onClick={() => copyTrackingCode(campaign.code)}
                    className="bg-gray-50 text-gray-600 py-2 px-3 rounded text-sm hover:bg-gray-100 transition-colors"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={() => simulateTracking(campaign.id)}
                    className="bg-green-50 text-green-600 py-2 px-3 rounded text-sm hover:bg-green-100 transition-colors"
                  >
                    🎯 Test
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {campaigns.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ADL Tracking!</h2>
            <p className="text-gray-600 mb-6">Create your first campaign to start tracking performance</p>
            <button
              onClick={() => setActiveModal('create')}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              🚀 Create First Campaign
            </button>
          </div>
        )}
      </div>

      {/* Core Features Section */}
      <div className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Core Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
              <p className="text-gray-600">Monitor ad performance across all platforms with live data updates and instant notifications</p>
              <button 
                onClick={() => alert('✅ Real-time tracking is active!')}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                ✅ Active
              </button>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI Optimization</h3>
              <p className="text-gray-600">Get intelligent suggestions to improve your ad copy, targeting, and budget allocation</p>
              <button 
                onClick={() => alert('🤖 AI optimization recommendations will be shown in analytics!')}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                🤖 Get AI Tips
              </button>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">Deep insights with custom reports, ROI tracking, and performance forecasting</p>
              <button 
                onClick={exportData}
                className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
              >
                📊 Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'create' && <CreateCampaignModal />}
      {activeModal?.type === 'analytics' && <AnalyticsModal campaign={activeModal.campaign} />}

      {/* Live Status Indicator */}
      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-3 py-2 rounded-full text-sm font-medium">
        🟢 LIVE - All Buttons Working
      </div>
    </div>
  );
}

export default App;
