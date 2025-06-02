import React, { useState, useEffect } from 'react';
import {
  Upload, BarChart3, Settings, Plus, Search, Globe, Zap, Target, TrendingUp,
  Bell, Shield, Lock, CreditCard, CheckCircle, ChevronDown, Menu,
  LayoutDashboard, Code, Layers, Activity, Clock, Sparkles
} from 'lucide-react';

const ADLApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [credits, setCredits] = useState(150);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ADL Logo Component
  const ADLLogo = ({ size = 'normal' }) => {
    const logoSize = size === 'large' ? 'w-16 h-16' : size === 'small' ? 'w-8 h-8' : 'w-12 h-12';
    return (
      <div className={`${logoSize} relative flex items-center justify-center`}>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          ADL
        </div>
      </div>
    );
  };

  // Initialize data
  useEffect(() => {
    setCampaigns([
      {
        id: 1, name: 'Summer Sale Campaign', platform: 'Facebook', status: 'Active',
        budget: 500, spent: 245, clicks: 1234, impressions: 45678, ctr: 2.7,
        created: '2024-06-01', adCode: 'ADL-FB-001', gtmCode: 'GTM-SUMMER-001', roi: 234
      },
      {
        id: 2, name: 'Product Launch', platform: 'Google', status: 'Paused',
        budget: 1000, spent: 789, clicks: 2341, impressions: 78901, ctr: 2.97,
        created: '2024-05-28', adCode: 'ADL-GG-002', gtmCode: 'GTM-LAUNCH-002', roi: 189
      },
      {
        id: 3, name: 'TikTok Viral Push', platform: 'TikTok', status: 'Active',
        budget: 300, spent: 156, clicks: 890, impressions: 23456, ctr: 3.8,
        created: '2024-05-30', adCode: 'ADL-TT-003', gtmCode: 'GTM-VIRAL-003', roi: 345
      }
    ]);

    setNotifications([
      { id: 1, text: 'Campaign "Summer Sale" exceeded 50% budget', type: 'warning', time: '2 hours ago', emoji: '⚠' },
      { id: 2, text: 'AI optimization suggestions available', type: 'info', time: '4 hours ago', emoji: '🤖' },
      { id: 3, text: 'TikTok campaign performing 25% above average', type: 'success', time: '6 hours ago', emoji: '🎉' }
    ]);
  }, []);

  // Sidebar
  const Sidebar = () => {
    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'campaigns', label: 'Campaigns', icon: Target },
      { id: 'create', label: 'Create Ad', icon: Plus },
      { id: 'wizard', label: 'AI Wizard', icon: Sparkles },
      { id: 'templates', label: 'Templates', icon: Layers },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'files', label: 'File Manager', icon: Upload },
      { id: 'tracking', label: 'Tracking Codes', icon: Code },
      { id: 'ai-tools', label: 'AI Tools', icon: Zap },
      { id: 'translator', label: 'Translator', icon: Globe },
      { id: 'settings', label: 'Settings', icon: Settings }
    ];

    return (
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} flex flex-col border-r`}>
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <ADLLogo />
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-blue-600 bg-clip-text text-transparent">
                  Ad Data Logic
                </h1>
                <p className="text-xs text-gray-600">Smart Ad Management Platform</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-600">💰 {credits} Credits</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Login Component
  const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showLegal, setShowLegal] = useState(false);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <ADLLogo size="large" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-blue-600 bg-clip-text text-transparent mt-4">
              Ad Data Logic
            </h1>
            <p className="text-gray-600 mt-2">🚀 Smart Ad Management Platform</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setUser({ email, name: 'John Doe' }); }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📧 Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🔒 Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              🚀 Sign In & Get Started
            </button>
          </form>

          {/* Legal Package */}
          <div className="mt-8">
            <button
              onClick={() => setShowLegal(!showLegal)}
              className="w-full p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="text-green-600" size={24} />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">🛡 Legal Protection Package</h3>
                    <p className="text-sm text-gray-600">Everything you need to launch safely</p>
                  </div>
                </div>
                <ChevronDown className={`transition-transform ${showLegal ? 'rotate-180' : ''}`} size={20} />
              </div>
            </button>

            {showLegal && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <ul className="text-sm space-y-2">
                  {[
                    '📄 App Privacy Policy',
                    '📜 Terms of Use Agreement', 
                    '⚖ End User License Agreement',
                    '🛡 App Disclaimer',
                    '📧 Developer Warranty Email',
                    '🔄 Automatic Legal Updates'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <CheckCircle className="text-green-500" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Company Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Leffler International Investments Pty Ltd | ABN 90124089345<br/>
              Level 2, 222 Pitt Street, Sydney 2000, Australia<br/>
              Office: 0478 965 828 | Email: leffleryd@gmail.com
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard
  const Dashboard = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
            <span>📊</span><span>Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your campaigns.</p>
        </div>
        <div className="flex space-x-4">
          <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Sparkles size={16} />
            <span>🤖 AI Wizard</span>
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus size={16} />
            <span>🚀 New Campaign</span>
          </button>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Active Campaigns', value: '12', change: '📈 +15% this month', icon: '🎯' },
          { title: 'Total Clicks', value: '45,678', change: '🚀 +8.2% CTR improvement', icon: '👆' },
          { title: 'Ad Spend', value: '$12,345', change: '⚠ +12% over budget', icon: '💰' },
          { title: 'ROI', value: '234%', change: '⭐ Above industry avg', icon: '📊' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="text-3xl">🤖</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🧠 AI Learning Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-800 mb-1">🎯 Audience Optimization</h4>
                <p className="text-sm text-gray-600">Your TikTok campaign could reach 23% more users by adjusting age targeting to 18-34.</p>
                <button className="mt-2 text-purple-600 text-sm font-medium hover:underline">Apply Suggestion →</button>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-800 mb-1">💡 Creative Enhancement</h4>
                <p className="text-sm text-gray-600">AI suggests adding urgency words to your Facebook ad copy for 15% better performance.</p>
                <button className="mt-2 text-purple-600 text-sm font-medium hover:underline">Enhance Copy →</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <Clock size={18} />
          <span>📋 Recent Campaigns</span>
        </h3>
        <div className="space-y-4">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${campaign.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <div>
                  <h4 className="font-medium text-gray-800 flex items-center space-x-2">
                    <span>{campaign.name}</span>
                    <span className="text-sm">
                      {campaign.platform === 'Facebook' ? '📘' :
                       campaign.platform === 'Google' ? '🔍' :
                       campaign.platform === 'TikTok' ? '🎵' : '📱'}
                    </span>
                  </h4>
                  <p className="text-sm text-gray-600">{campaign.platform} • {campaign.created} • Code: {campaign.adCode}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">${campaign.spent}</p>
                <p className="text-sm text-gray-600">ROI: {campaign.roi}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Company Footer */}
      <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
        <p className="text-xs text-gray-500">
          Leffler International Investments Pty Ltd | ABN 90124089345<br/>
          Level 2, 222 Pitt Street, Sydney 2000, Australia<br/>
          Office: 0478 965 828 | Email: leffleryd@gmail.com
        </p>
      </div>
    </div>
  );

  // Main App
  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                <Menu size={20} />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="🔍 Search campaigns, templates, files..."
                  className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-800">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                💰 {credits} Credits
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg flex items-center space-x-2">
                <CreditCard size={16} />
                <span>Buy Credits</span>
              </button>
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-auto">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default ADLApp;
