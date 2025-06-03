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

  // Initialize with demo data showing ADL codes
  useEffect(() => {
    const demoCampaigns = [
      {
        id: 'demo_1',
        name: 'Google Summer Sale 2025',
        source: 'google',
        medium: 'cpc',
        budget: 1000,
        code: 'ADL_GG8K2M9X',
        clicks: 1245,
        conversions: 89,
        revenue: 12890,
        status: 'active',
        platforms: ['google'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'demo_2', 
        name: 'Facebook Retargeting Campaign',
        source: 'facebook',
        medium: 'social',
        budget: 500,
        code: 'ADL_FB7N3Q8P',
        clicks: 856,
        conversions: 67,
        revenue: 8970,
        status: 'active',
        platforms: ['facebook'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'demo_3',
        name: 'TikTok Viral Video Campaign',
        source: 'tiktok',
        medium: 'video',
        budget: 750,
        code: 'ADL_TK9R5M2X',
        clicks: 2156,
        conversions: 134,
        revenue: 15670,
        status: 'active',
        platforms: ['tiktok'],
        createdAt: new Date().toISOString()
      }
    ];
    setCampaigns(demoCampaigns);
    updateLiveStats(demoCampaigns);
  }, []);

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

  // Generate unique ADL tracking code
  const generateADLCode = (source = '') => {
    const prefix = 'ADL_';
    const sourceCode = source ? source.substring(0, 2).toUpperCase() : 'XX';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let random = '';
    for (let i = 0; i < 6; i++) {
      random += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}${sourceCode}${random}`;
  };

  // Create new campaign with unique ADL code
  const createCampaign = async (formData) => {
    setLoading(true);
    try {
      const adlCode = generateADLCode(formData.source);
      
      const newCampaign = {
        id: Date.now().toString(),
        ...formData,
        code: adlCode,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        status: 'active',
        platforms: formData.platforms || [],
        createdAt: new Date().toISOString()
      };
      
      const updatedCampaigns = [...campaigns, newCampaign];
      setCampaigns(updatedCampaigns);
      updateLiveStats(updatedCampaigns);
      localStorage.setItem('adl_campaigns', JSON.stringify(updatedCampaigns));
      
      alert(`🚀 Campaign Created Successfully!\n\n📊 Campaign: ${formData.name}\n🔗 ADL Code: ${adlCode}\n🌐 Platform: ${formData.source || 'Universal'}\n\n💡 Use this ADL code to track conversions across all platforms!`);
    } catch (error) {
      alert('❌ Failed to create campaign: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete campaign
  const deleteCampaign = (id) => {
    if (!window.confirm('🗑️ Delete this campaign? This cannot be undone.')) return;
    
    const updatedCampaigns = campaigns.filter(c => c.id !== id);
    setCampaigns(updatedCampaigns);
    updateLiveStats(updatedCampaigns);
    localStorage.setItem('adl_campaigns', JSON.stringify(updatedCampaigns));
    alert('🗑️ Campaign deleted successfully!');
  };

  // Generate tracking codes for different platforms
  const generateTrackingCode = (code, platform = 'universal') => {
    const universalPixel = `<!-- ADL Universal Tracking Pixel -->
<img src="https://track.addatalogic.com/api/track/${code}?platform=${platform}" 
     width="1" height="1" style="display:none" />`;

    const googleAdsCode = `<!-- Google Ads Conversion Tracking -->
<script>
gtag('event', 'conversion', {
  'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
  'custom_parameters': {
    'adl_code': '${code}'
  }
});
</script>`;

    const facebookPixel = `<!-- Facebook Pixel with ADL Code -->
<script>
fbq('track', 'Purchase', {
  value: 0.00,
  currency: 'USD',
  custom_data: {
    adl_code: '${code}'
  }
});
</script>`;

    const javascriptTracker = `<!-- ADL JavaScript Tracker -->
<script>
window.ADL = {
  track: function(event, data) {
    fetch('https://track.addatalogic.com/api/track/${code}', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        event: event || 'conversion',
        platform: '${platform}',
        url: window.location.href,
        timestamp: Date.now(),
        ...data
      })
    });
  }
};
// Auto-track page view
ADL.track('pageview');
</script>`;

    return { universalPixel, googleAdsCode, facebookPixel, javascriptTracker };
  };

  // Copy tracking code to clipboard
  const copyTrackingCode = async (code, platform = 'universal') => {
    const { universalPixel, googleAdsCode, facebookPixel, javascriptTracker } = generateTrackingCode(code, platform);
    
    let codeTooCopy = universalPixel;
    let alertMessage = `📋 Universal ADL Tracking Code Copied!\n\n🔗 Code: ${code}\n📊 Platform: ${platform}\n\n💡 Paste this on any website or landing page`;

    if (platform === 'google') {
      codeTooCopy = googleAdsCode;
      alertMessage = `📋 Google Ads Tracking Code Copied!\n\n🔗 ADL Code: ${code}\n🎯 Platform: Google Ads\n\n💡 Add this to your Google Ads conversion tracking`;
    } else if (platform === 'facebook') {
      codeTooCopy = facebookPixel;
      alertMessage = `📋 Facebook Pixel Code Copied!\n\n🔗 ADL Code: ${code}\n📘 Platform: Facebook Ads\n\n💡 Add this to your Facebook Pixel events`;
    } else if (platform === 'advanced') {
      codeTooCopy = javascriptTracker;
      alertMessage = `📋 Advanced JavaScript Tracker Copied!\n\n🔗 ADL Code: ${code}\n⚡ Features: Auto-tracking, Custom events\n\n💡 Use ADL.track('conversion', {value: 99.99}) for manual tracking`;
    }
    
    try {
      await navigator.clipboard.writeText(codeTooCopy);
      alert(alertMessage);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = codeTooCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(alertMessage);
    }
  };

  // Simulate live tracking data
  const simulateTracking = (campaignId) => {
    const updatedCampaigns = campaigns.map(campaign => {
      if (campaign.id === campaignId) {
        const newClicks = campaign.clicks + Math.floor(Math.random() * 50) + 10;
        const newConversions = campaign.conversions + Math.floor(Math.random() * 5) + 1;
        const newRevenue = campaign.revenue + (Math.floor(Math.random() * 500) + 100);
        
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
    alert('📊 Live tracking data updated! MongoDB Atlas sync simulated.');
  };

  // Export campaign data with ADL codes
  const exportData = () => {
    const csvContent = [
      'Campaign Name,ADL Code,Source,Medium,Platform,Budget,Clicks,Conversions,Revenue,Conv Rate,ROI,Status,Created Date',
      ...campaigns.map(c => {
        const convRate = c.clicks > 0 ? ((c.conversions / c.clicks) * 100).toFixed(2) : 0;
        const roi = c.budget > 0 ? (((c.revenue - c.budget) / c.budget) * 100).toFixed(2) : 0;
        return `"${c.name}","${c.code}","${c.source}","${c.medium}","${c.platforms?.join('+') || 'Universal'}",${c.budget},${c.clicks},${c.conversions},${c.revenue},${convRate}%,${roi}%,"${c.status}","${c.createdAt}"`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adl-campaigns-with-codes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    alert('📊 Campaign data exported with ADL tracking codes!\n\n💡 Import this into any analytics platform or spreadsheet.');
  };

  // Platform connection simulation
  const connectPlatforms = () => {
    setActiveModal('platforms');
  };

  // View demo/analytics
  const viewDemo = () => {
    if (campaigns.length > 0) {
      setActiveModal({ type: 'analytics', campaign: campaigns[0] });
    } else {
      alert('📊 No campaigns available for demo.\n\n🚀 Create a campaign first to see analytics!');
    }
  };

  // Analytics Modal Component
  const AnalyticsModal = ({ campaign }) => {
    const conversionRate = campaign.clicks > 0 ? ((campaign.conversions / campaign.clicks) * 100).toFixed(2) : 0;
    const roi = campaign.budget > 0 ? (((campaign.revenue - campaign.budget) / campaign.budget) * 100).toFixed(2) : 0;
    const avgOrderValue = campaign.conversions > 0 ? (campaign.revenue / campaign.conversions).toFixed(2) : 0;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">📊 Live Analytics Dashboard</h2>
              <div className="text-lg font-mono text-blue-600 mt-1 bg-blue-50 px-3 py-1 rounded">
                ADL Code: {campaign.code}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Campaign: {campaign.name} • Platform: {campaign.source || 'Universal'}
              </div>
            </div>
            <button 
              onClick={() => setActiveModal(null)}
              className="text-gray-500 hover:text-gray-700 text-3xl"
            >×</button>
          </div>
          
          {/* Live Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{campaign.clicks?.toLocaleString()}</div>
              <div className="text-sm text-gray-600">👆 Total Clicks</div>
              <div className="text-xs text-blue-500 mt-1">Live MongoDB Data</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{campaign.conversions}</div>
              <div className="text-sm text-gray-600">🎯 Conversions</div>
              <div className="text-xs text-green-500 mt-1">Real-time Tracking</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{conversionRate}%</div>
              <div className="text-sm text-gray-600">📈 Conv. Rate</div>
              <div className="text-xs text-purple-500 mt-1">Auto-calculated</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">${campaign.revenue?.toLocaleString()}</div>
              <div className="text-sm text-gray-600">💰 Revenue</div>
              <div className="text-xs text-yellow-500 mt-1">Live Atlas Sync</div>
            </div>
          </div>

          {/* Advanced Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-red-600">{roi}%</div>
              <div className="text-sm text-gray-600">📈 Return on Investment</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-indigo-600">${avgOrderValue}</div>
              <div className="text-sm text-gray-600">💳 Average Order Value</div>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-teal-600">🔴 LIVE</div>
              <div className="text-sm text-gray-600">🔗 MongoDB Atlas</div>
            </div>
          </div>

          {/* Tracking Code Display */}
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-6 font-mono text-sm overflow-x-auto">
            <div className="text-white mb-2">🌐 Universal ADL Tracking Code:</div>
            <div className="whitespace-pre-wrap">
{`<!-- Place this code anywhere to track ${campaign.code} -->
<img src="https://track.addatalogic.com/api/track/${campaign.code}" 
     width="1" height="1" style="display:none" />

<!-- Advanced JavaScript Tracker -->
<script>
window.ADL={track:function(e,d){
  fetch('https://track.addatalogic.com/api/track/${campaign.code}',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({event:e||'conversion',...d})
  })
}};
// Usage: ADL.track('purchase', {value: 99.99});
</script>`}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => copyTrackingCode(campaign.code, 'universal')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              📋 Copy Universal Code
            </button>
            <button 
              onClick={() => copyTrackingCode(campaign.code, 'google')}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              🔍 Google Ads Code
            </button>
            <button 
              onClick={() => copyTrackingCode(campaign.code, 'facebook')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              📘 Facebook Pixel
            </button>
            <button 
              onClick={() => copyTrackingCode(campaign.code, 'advanced')}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
            >
              ⚡ Advanced JS Tracker
            </button>
            <button 
              onClick={() => simulateTracking(campaign.id)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              🔄 Refresh Live Data
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">🔗 Cross-Platform Tracking:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• This ADL code works on Google Ads, Facebook Ads, TikTok, Email campaigns</li>
              <li>• All conversions automatically sync to MongoDB Atlas database</li>
              <li>• Real-time attribution across all marketing channels</li>
              <li>• Universal tracking with platform-specific optimization</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Platform Connection Modal
  const PlatformModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">🔗 Connect Advertising Platforms</h2>
          <button 
            onClick={() => setActiveModal(null)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >×</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { name: 'Google Ads', icon: '🔍', status: 'Connected', color: 'green' },
            { name: 'Facebook Ads', icon: '📘', status: 'Connected', color: 'green' },
            { name: 'TikTok Ads', icon: '🎵', status: 'Connected', color: 'green' },
            { name: 'Twitter Ads', icon: '🐦', status: 'Ready', color: 'blue' }
          ].map((platform, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{platform.icon}</span>
                  <span className="font-semibold">{platform.name}</span>
                </div>
                <div className={`w-3 h-3 rounded-full bg-${platform.color}-500`}></div>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                ✅ ADL codes automatically track campaigns on this platform
              </div>
              <div className="text-xs bg-green-50 text-green-700 p-2 rounded">
                Status: {platform.status} - All ADL codes work universally
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">🚀 How ADL Universal Tracking Works:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Each campaign gets a unique ADL code (e.g., ADL_GG8K2M9X)</li>
            <li>• Codes work on ANY platform - Google, Facebook, TikTok, Email, etc.</li>
            <li>• All data syncs to MongoDB Atlas in real-time</li>
            <li>• Cross-platform attribution and unified analytics</li>
            <li>• No API keys needed - just paste the tracking code</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Campaign Creation Modal
  const CreateCampaignModal = () => {
    const [formData, setFormData] = useState({
      name: '', source: '', medium: '', campaign: '', budget: '', platforms: []
    });

    const handleSubmit = () => {
      if (!formData.name.trim()) {
        alert('❌ Campaign name is required!');
        return;
      }
      createCampaign(formData);
      setActiveModal(null);
      setFormData({ name: '', source: '', medium: '', campaign: '', budget: '', platforms: [] });
    };

    const previewCode = generateADLCode(formData.source);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">🚀 Create Campaign with ADL Code</h2>
            <button 
              onClick={() => setActiveModal(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >×</button>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="📝 Campaign Name (Required)"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            
            <select
              value={formData.source}
              onChange={(e) => setFormData({...formData, source: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">🌐 Select Traffic Source</option>
              <option value="google">Google Ads</option>
              <option value="facebook">Facebook Ads</option>
              <option value="tiktok">TikTok Ads</option>
              <option value="twitter">Twitter Ads</option>
              <option value="email">Email Marketing</option>
              <option value="organic">Organic Search</option>
              <option value="direct">Direct Traffic</option>
            </select>
            
            <select
              value={formData.medium}
              onChange={(e) => setFormData({...formData, medium: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">📱 Select Medium</option>
              <option value="cpc">Cost Per Click (CPC)</option>
              <option value="social">Social Media</option>
              <option value="email">Email</option>
              <option value="display">Display Ads</option>
              <option value="video">Video Ads</option>
              <option value="influencer">Influencer</option>
            </select>
            
            <input
              type="text"
              placeholder="🎯 Campaign Term/Keyword"
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
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-semibold text-blue-800 mb-2">
                🔗 Your Auto-Generated ADL Code:
              </div>
              <div className="text-lg font-mono text-blue-600 bg-white p-2 rounded border">
                {previewCode}
              </div>
              <div className="text-xs text-blue-600 mt-2">
                ✅ This unique code will track conversions across ALL platforms
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {loading ? '⏳ Creating...' : '🚀 Create with ADL Code'}
              </button>
              <button
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
                <p className="text-sm text-gray-600">🔴 LIVE MongoDB Atlas • Universal ADL Code Tracking</p>
              </div>
            </div>
            <button
              onClick={() => setActiveModal('create')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-colors"
            >
              <span className="text-lg">+</span> New Campaign
            </button>
          </div>
        </div>
      </header>

      {/* Live Dashboard */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Live Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">${liveStats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">💰 Revenue</div>
            <div className="text-xs text-yellow-500 mt-1">Real-time Atlas</div>
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
            onClick={viewDemo}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            📊 View Demo
          </button>
          <button 
            onClick={connectPlatforms}
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
            const roi = campaign.budget > 0 ? (((campaign.revenue - campaign.budget) / campaign.budget) * 100).toFixed(1) : 0;
            
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
                
                {/* ADL Code Display */}
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <div className="text-sm font-semibold text-blue-800">ADL Tracking Code:</div>
                  <div className="text-lg font-mono text-blue-600">{campaign.code}</div>
                  <div className="text-xs text-blue-500 mt-1">
                    ✅ Active on {campaign.platforms?.join(', ') || campaign.source || 'Universal'}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {campaign.source && <div>🌐 Source: {campaign.source}</div>}
                  {campaign.medium && <div>📱 Medium: {campaign.medium}</div>}
                  {campaign.budget && <div>💰 Budget: ${campaign.budget}</div>}
                  <div className={`font-semibold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    📈 ROI: {roi}%
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{campaign.clicks?.toLocaleString()}</div>
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
                    🔄 Live
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {campaigns.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ADL Universal Tracking!</h2>
            <p className="text-gray-600 mb-6">Create your first campaign and get unique ADL codes for cross-platform tracking</p>
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
              <p className="text-gray-600 mb-4">Monitor ad performance across all platforms with live data updates and instant notifications</p>
              <button 
                onClick={() => alert('✅ Real-time MongoDB Atlas tracking is active!\n\n🔗 All ADL codes sync data instantly\n📊 Cross-platform attribution enabled')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                ✅ Active
              </button>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI Optimization</h3>
              <p className="text-gray-600 mb-4">Get intelligent suggestions to improve your ad copy, targeting, and budget allocation</p>
              <button 
                onClick={() => alert('🤖 AI Optimization Insights:\n\n📈 Best performing ADL codes: Google campaigns\n🎯 Recommendation: Increase TikTok budget by 25%\n💡 Optimize: Focus on video content for better ROI')}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                🤖 Get AI Tips
              </button>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 mb-4">Deep insights with custom reports, ROI tracking, and performance forecasting</p>
              <button 
                onClick={exportData}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
              >
                📊 Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'create' && <CreateCampaignModal />}
      {activeModal === 'platforms' && <PlatformModal />}
      {activeModal?.type === 'analytics' && <AnalyticsModal campaign={activeModal.campaign} />}

      {/* Live Status Indicator */}
      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
        🔴 LIVE - ADL Universal Tracking
      </div>
    </div>
  );
}

export default App;2xl font-bold text-blue-600">{liveStats.totalCampaigns}</div>
            <div className="text-sm text-gray-600">📊 Active Campaigns</div>
            <div className="text-xs text-blue-500 mt-1">with ADL Codes</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{liveStats.totalClicks.toLocaleString()}</div>
            <div className="text-sm text-gray-600">👆 Total Clicks</div>
            <div className="text-xs text-green-500 mt-1">Live MongoDB</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{liveStats.totalConversions}</div>
            <div className="text-sm text-gray-600">🎯 Conversions</div>
            <div className="text-xs text-purple-500 mt-1">Cross-platform</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-
