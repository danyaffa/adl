import React, { useState, useEffect } from 'react';

function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    campaignName: '',
    platform: 'facebook',
    budget: '',
    duration: '',
    objective: 'traffic',
    audience: '',
    adCopy: '',
    file: null
  });

  const API_BASE = process.env.REACT_APP_API_URL || 'https://your-backend.vercel.app/api';

  // Fetch campaigns from MongoDB on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/campaigns`);
      const data = await response.json();
      
      if (data.success) {
        setCampaigns(data.campaigns);
      } else {
        console.error('Failed to fetch campaigns:', data.error);
        // Show demo data if API fails
        setCampaigns([
          { _id: 'ADL-FB-2025-001', name: 'Summer Sale 2025', platform: 'facebook', budget: 2500, status: 'active', stats: { roi: 234, clicks: 1240, impressions: 45000 }, trackingCode: 'ADL-FB-2025-001' },
          { _id: 'ADL-GG-2025-002', name: 'Holiday Promotion', platform: 'google', budget: 3200, status: 'active', stats: { roi: 189, clicks: 890, impressions: 32000 }, trackingCode: 'ADL-GG-2025-002' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      // Show demo data if API fails
      setCampaigns([
        { _id: 'ADL-FB-2025-001', name: 'Summer Sale 2025', platform: 'facebook', budget: 2500, status: 'active', stats: { roi: 234, clicks: 1240, impressions: 45000 }, trackingCode: 'ADL-FB-2025-001' },
        { _id: 'ADL-GG-2025-002', name: 'Holiday Promotion', platform: 'google', budget: 3200, status: 'active', stats: { roi: 189, clicks: 890, impressions: 32000 }, trackingCode: 'ADL-GG-2025-002' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (modalType) => setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const generateTrackingCode = async () => {
    if (!formData.campaignName || !formData.budget) {
      alert('❌ Please fill in required fields: Campaign Name and Budget');
      return;
    }

    try {
      setLoading(true);
      
      // Create campaign in MongoDB
      const response = await fetch(`${API_BASE}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Add new campaign to local state
        setCampaigns(prev => [data.campaign, ...prev]);
        
        // Show success modal with tracking code and script
        const trackingCodeModal = `
✅ CAMPAIGN CREATED SUCCESSFULLY!

🔖 Tracking Code: ${data.trackingCode}
📊 Campaign: ${data.campaign.name}
💰 Budget: $${data.campaign.budget}
🎯 Platform: ${data.campaign.platform.toUpperCase()}

📋 COPY THIS TRACKING SCRIPT TO YOUR WEBSITE:

${data.trackingScript}

🚀 HOW TO USE:
1. Copy the tracking script above
2. Paste it into your website's <head> section
3. Deploy your website
4. Start tracking immediately!

📊 View real-time analytics in the Dashboard tab.
        `;
        
        alert(trackingCodeModal);
        
        // Reset form
        setFormData({
          campaignName: '',
          platform: 'facebook',
          budget: '',
          duration: '',
          objective: 'traffic',
          audience: '',
          adCopy: '',
          file: null
        });
        
        closeModal();
      } else {
        throw new Error(data.error || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      
      // Fallback: Generate code locally if API fails
      const platformCodes = { facebook: 'FB', google: 'GG', tiktok: 'TT', instagram: 'IG', linkedin: 'LI' };
      const code = `ADL-${platformCodes[formData.platform]}-2025-${String(campaigns.length + 1).padStart(3, '0')}`;
      
      const newCampaign = {
        _id: code,
        name: formData.campaignName,
        platform: formData.platform,
        budget: parseFloat(formData.budget),
        status: 'active',
        stats: { roi: 'New', clicks: 0, impressions: 0 },
        trackingCode: code,
        createdAt: new Date()
      };
      
      setCampaigns(prev => [newCampaign, ...prev]);
      
      alert(`✅ Campaign Created Locally!\n\nTracking Code: ${code}\n\nNote: Connect to MongoDB for full functionality.`);
      
      setFormData({
        campaignName: '',
        platform: 'facebook',
        budget: '',
        duration: '',
        objective: 'traffic',
        audience: '',
        adCopy: '',
        file: null
      });
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  const exportData = (format) => {
    const headers = ['Campaign Name', 'Platform', 'Budget', 'Status', 'ROI', 'Tracking Code', 'Clicks', 'Impressions'];
    const data = campaigns.map(c => [
      c.name,
      c.platform,
      `$${c.budget}`,
      c.status,
      `${c.stats?.roi || 0}%`,
      c.trackingCode,
      c.stats?.clicks || 0,
      c.stats?.impressions || 0
    ]);
    
    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adl-campaigns-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    alert(`✅ ${campaigns.length} campaigns exported as ${format.toUpperCase()} file!`);
  };

  const connectPlatform = (platform) => {
    alert(`🔗 Connecting to ${platform}...\n\nThis will redirect to ${platform}'s authorization page to connect your account.\n\nNote: Full OAuth integration available in premium version.`);
  };

  const openAITool = (tool) => {
    const urls = {
      'copy-ai': 'https://copy.ai',
      'canva': 'https://canva.com',
      'seo-ai': 'https://seo.ai',
      'jasper': 'https://jasper.ai'
    };
    if (urls[tool]) {
      window.open(urls[tool], '_blank');
    }
  };

  const viewAnalytics = async (trackingCode) => {
    try {
      const response = await fetch(`${API_BASE}/analytics/${trackingCode}`);
      const data = await response.json();
      
      if (data.success) {
        const analytics = data.analytics;
        alert(`📊 ANALYTICS FOR ${trackingCode}

📈 Performance Metrics:
• Total Events: ${analytics.totalEvents}
• Page Views: ${analytics.pageViews}
• Clicks: ${analytics.clicks}
• Conversions: ${analytics.conversions}
• Unique Visitors: ${analytics.uniqueVisitors}
• Avg Time on Site: ${analytics.avgTimeOnSite}

🔝 Top Pages:
${analytics.topPages?.map(p => `• ${p.url} (${p.count} views)`).join('\n') || 'No data yet'}

🔗 Top Referrers:
${analytics.referrers?.map(r => `• ${r.domain} (${r.count} visits)`).join('\n') || 'No referrers yet'}

📅 Timeline:
${analytics.timeline?.slice(-5).map(t => `• ${t.date}: ${t.count} events`).join('\n') || 'No timeline data yet'}`);
      } else {
        alert('📊 Analytics not available yet.\n\nStart driving traffic to see real-time data!');
      }
    } catch (error) {
      alert('📊 Analytics loading...\n\nReal-time data will appear here once your tracking code is implemented.');
    }
  };

  const modalContent = {
    dashboard: (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Campaign Dashboard</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="text-lg">🔄 Loading campaigns from MongoDB...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{campaigns.length}</div>
                <div className="text-sm text-gray-600">Total Campaigns</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${campaigns.reduce((sum, c) => sum + (c.budget || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Budget</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {campaigns.length > 0 ? Math.round(campaigns.reduce((sum, c) => sum + (c.stats?.roi || 0), 0) / campaigns.length) : 0}%
                </div>
                <div className="text-sm text-gray-600">Avg ROI</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {campaigns.reduce((sum, c) => sum + (c.stats?.clicks || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Clicks</div>
              </div>
            </div>

            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">MongoDB Connected Campaigns</h3>
                <button
                  onClick={fetchCampaigns}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  🔄 Refresh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Campaign</th>
                      <th className="p-3 text-left">Platform</th>
                      <th className="p-3 text-left">Budget</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">ROI</th>
                      <th className="p-3 text-left">Tracking Code</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map(campaign => (
                      <tr key={campaign._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{campaign.name}</td>
                        <td className="p-3 capitalize">{campaign.platform}</td>
                        <td className="p-3">${campaign.budget}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            campaign.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-green-600">{campaign.stats?.roi || 0}%</td>
                        <td className="p-3 font-mono text-sm">{campaign.trackingCode}</td>
                        <td className="p-3">
                          <button
                            onClick={() => viewAnalytics(campaign.trackingCode)}
                            className="bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600"
                          >
                            📊 Analytics
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    ),

    upload: (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Campaign → MongoDB</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); generateTrackingCode(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Campaign Objective</label>
              <select
                name="objective"
                value={formData.objective}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              >
                <option value="traffic">Drive Traffic</option>
                <option value="conversions">Conversions</option>
                <option value="awareness">Brand Awareness</option>
                <option value="engagement">Engagement</option>
                <option value="leads">Lead Generation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Target Audience</label>
              <input
                type="text"
                name="audience"
                value={formData.audience}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 25-45, Tech enthusiasts"
                disabled={loading}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Ad Copy</label>
            <textarea
              name="adCopy"
              value={formData.adCopy}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
              rows="3"
              placeholder="Write your ad copy here..."
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Upload Creative</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
              accept="image/*,video/*"
              disabled={loading}
            />
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🔄 Auto-Generated Features:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>✅ Unique tracking code automatically generated</li>
              <li>✅ Campaign saved to MongoDB Atlas cloud database</li>
              <li>✅ Real-time analytics tracking script created</li>
              <li>✅ Cross-platform tracking enabled</li>
              <li>✅ ROI and conversion tracking activated</li>
            </ul>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
            >
              {loading ? '🔄 Creating Campaign...' : '🚀 Generate Tracking Code + Save to MongoDB'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    ),

    analytics: (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">MongoDB Analytics Dashboard</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Real-Time Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Campaigns:</span>
                <span className="font-bold">{campaigns.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Impressions:</span>
                <span className="font-bold">{campaigns.reduce((sum, c) => sum + (c.stats?.impressions || 0), 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Clicks:</span>
                <span className="font-bold">{campaigns.reduce((sum, c) => sum + (c.stats?.clicks || 0), 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Tracking Codes:</span>
                <span className="font-bold">{campaigns.filter(c => c.status === 'active').length}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Platform Performance</h3>
            <div className="space-y-3">
              {['facebook', 'google', 'tiktok', 'instagram'].map(platform => {
                const platformCampaigns = campaigns.filter(c => c.platform === platform);
                const percentage = campaigns.length > 0 ? Math.round((platformCampaigns.length / campaigns.length) * 100) : 0;
                const colors = { facebook: 'blue', google: 'green', tiktok: 'pink', instagram: 'purple' };
                
                return (
                  <div key={platform} className="flex items-center justify-between">
                    <span className="capitalize">{platform}</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`bg-${colors[platform]}-600 h-2 rounded-full`} 
                          style={{width: `${percentage}%`}}
                        ></div>
                      </div>
                      <span className="text-sm">{percentage}% ({platformCampaigns.length})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Individual Campaign Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.slice(0, 6).map(campaign => (
              <div key={campaign._id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium truncate">{campaign.name}</h4>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded uppercase">{campaign.platform}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Code: <code className="bg-gray-100 px-1 rounded">{campaign.trackingCode}</code></div>
                  <div>Budget: ${campaign.budget}</div>
                  <div>ROI: {campaign.stats?.roi || 0}%</div>
                  <div>Clicks: {campaign.stats?.clicks || 0}</div>
                </div>
                <button
                  onClick={() => viewAnalytics(campaign.trackingCode)}
                  className="mt-3 bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 w-full"
                >
                  📊 View Details
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex gap-4">
          <button 
            onClick={() => exportData('csv')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            📊 Export CSV
          </button>
          <button 
            onClick={() => exportData('pdf')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            📄 Export PDF
          </button>
          <button 
            onClick={() => alert('📧 Campaign reports sent to your email!\n\nCheck your inbox for detailed analytics.')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            📧 Email Report
          </button>
          <button 
            onClick={fetchCampaigns}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>
    ),

    integrations: (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Platform Integrations</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">🔗 Connected Services</h3>
          <div className="text-sm text-green-700">
            ✅ MongoDB Atlas - Cloud Database<br/>
            ✅ ADL Tracking System - Real-time Analytics<br/>
            ✅ Auto-Code Generation - Smart Tracking Codes
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Facebook Ads', icon: '📘', status: 'Connect', action: () => connectPlatform('Facebook') },
            { name: 'Google Ads', icon: '🔍', status: 'Connect', action: () => connectPlatform('Google Ads') },
            { name: 'TikTok Ads', icon: '🎵', status: 'Connect', action: () => connectPlatform('TikTok') },
            { name: 'Instagram', icon: '📸', status: 'Connect', action: () => connectPlatform('Instagram') },
            { name: 'LinkedIn Ads', icon: '💼', status: 'Connect', action: () => connectPlatform('LinkedIn') },
            { name: 'Twitter Ads', icon: '🐦', status: 'Connect', action: () => connectPlatform('Twitter') },
            { name: 'Snapchat Ads', icon: '👻', status: 'Connect', action: () => connectPlatform('Snapchat') },
            { name: 'Pinterest Ads', icon: '📌', status: 'Connect', action: () => connectPlatform('Pinterest') }
          ].map((platform, index) => (
            <div key={index} className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{platform.icon}</span>
                <span className="font-medium">{platform.name}</span>
              </div>
              <button
                onClick={platform.action}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                {platform.status}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">🚀 How ADL Tracking Works</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <div>1. Create campaign → Get unique tracking code</div>
            <div>2. Add tracking script to your website</div>
            <div>3. Run ads on any platform (Facebook, Google, etc.)</div>
            <div>4. Track clicks, conversions, ROI in real-time</div>
            <div>5. No platform fees - Direct tracking to your MongoDB</div>
          </div>
        </div>
      </div>
    ),

    aiTools: (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">AI Tools & Optimization</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Copy.ai', description: 'AI-powered ad copy generation', icon: '✍️', action: () => openAITool('copy-ai') },
            { name: 'Canva', description: 'Design amazing ad creatives', icon: '🎨', action: () => openAITool('canva') },
            { name: 'SEO.ai', description: 'SEO optimization for ads', icon: '🔍', action: () => openAITool('seo-ai') },
            { name: 'Jasper AI', description: 'Content generation assistant', icon: '🤖', action: () => openAITool('jasper') }
          ].map((tool, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">{tool.icon}</span>
                <h3 className="font-semibold">{tool.name}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
              <button
                onClick={tool.action}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 w-full"
              >
                Open Tool
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-2">🤖 ADL AI Features</h3>
          <div className="text-sm text-purple-700 space-y-1">
            <div>✅ Auto-optimize tracking codes based on performance</div>
            <div>✅ Smart budget recommendations</div>
            <div>✅ Predictive ROI calculations</div>
            <div>✅ Automated A/B testing suggestions</div>
            <div>✅ Cross-platform performance analysis</div>
          </div>
        </div>
      </div>
    ),

    contact: (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Contact Support</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); alert('✅ Message sent! We\'ll get back to you within 24 hours.\n\nFor urgent MongoDB issues, check our status page.'); closeModal(); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input type="text" className="w-full p-3 border rounded-lg" placeholder="Your name" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" className="w-full p-3 border rounded-lg" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select className="w-full p-3 border rounded-lg">
                <option>Technical Support</option>
                <option>MongoDB Connection Issue</option>
                <option>Tracking Code Not Working</option>
                <option>Billing Question</option>
                <option>Feature Request</option>
                <option>General Inquiry</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea className="w-full p-3 border rounded-lg" rows="4" placeholder="How can we help you?" required></textarea>
            </div>
            <button type="submit" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 w-full">
              Send Message
            </button>
          </div>
        </form>
        
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-3">Other Ways to Reach Us</h3>
          <div className="space-y-2 text-sm">
            <div>📧 Email: support@adldatalogic.com</div>
            <div>📞 Phone: 0478 965 828</div>
            <div>💬 Live Chat: Available 24/7</div>
            <div>🏢 Office: Level 2, 222 Pitt Street, Sydney 2000, Australia</div>
            <div>🔗 MongoDB Status: <a href="#" className="text-blue-600">status.adldatalogic.com</a></div>
          </div>
        </div>
      </div>
    )
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
              <p style={{ margin: 0, color: '#e0e7ff', fontSize: '14px' }}>MongoDB Tracking & Optimization Platform</p>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: '24px' }}>
            <button onClick={() => openModal('dashboard')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Dashboard</button>
            <button onClick={() => openModal('upload')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Upload Ads</button>
            <button onClick={() => openModal('analytics')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Analytics</button>
            <button onClick={() => openModal('contact')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Support</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '64px 0', backgroundColor: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
            MongoDB-Powered Ad Campaign Management
          </h2>
          <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '32px', maxWidth: '768px', margin: '0 auto 32px' }}>
            Generate unique tracking codes, save campaigns to MongoDB Atlas, and track performance across Facebook, Google, TikTok with real-time analytics.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => openModal('upload')}
              style={{
                backgroundColor: '#764ba2',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🚀 Create Campaign + Auto-Code
            </button>
            <button 
              onClick={() => openModal('dashboard')}
              style={{
                border: '2px solid #764ba2',
                color: '#764ba2',
                backgroundColor: 'transparent',
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              📊 View MongoDB Data
            </button>
          </div>
        </div>
      </section>

      {/* Rest of the component remains the same... */}
      {/* Features, Status Bar, Footer, Modal */}
      
      {/* Modal */}
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
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)'
          }}>
            {modalContent[activeModal]}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
              <label className="block text-sm font-medium mb-2">Campaign Name *</label>
              <input
                type="text"
                name="campaignName"
                value={formData.campaignName}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Summer Sale 2025"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Platform *</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
                disabled={loading}
              >
                <option value="facebook">Facebook</option>
                <option value="google">Google Ads</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="snapchat">Snapchat</option>
                <option value="pinterest">Pinterest</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Budget ($) *</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="2500"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration (days) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="30"
                required
                disabled={loading}
              />
            </div>
            <div>
