import React from 'react';

function App() {
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
              <p style={{ margin: 0, color: '#e0e7ff', fontSize: '14px' }}>Tracker & Optimization Platform</p>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: '24px' }}>
            <a href="#dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</a>
            <a href="#upload" style={{ color: 'white', textDecoration: 'none' }}>Upload Ads</a>
            <a href="#analytics" style={{ color: 'white', textDecoration: 'none' }}>Analytics</a>
            <a href="#reports" style={{ color: 'white', textDecoration: 'none' }}>Reports</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '64px 0', backgroundColor: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
            Smart Ad Campaign Management & Optimization
          </h2>
          <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '32px', maxWidth: '768px', margin: '0 auto 32px' }}>
            Track, analyze, and optimize your advertising campaigns across Facebook, Google, TikTok, and more with AI-powered insights and real-time performance monitoring.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              backgroundColor: '#764ba2',
              color: 'white',
              padding: '12px 32px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              🚀 Start Tracking Ads
            </button>
            <button style={{
              border: '2px solid #764ba2',
              color: '#764ba2',
              backgroundColor: 'transparent',
              padding: '12px 32px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              📊 View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '64px 0', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <h3 style={{ fontSize: '30px', fontWeight: 'bold', textAlign: 'center', marginBottom: '48px', color: '#1f2937' }}>
            Core Features
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {[
              { icon: '📈', title: 'Real-Time Tracking', desc: 'Monitor ad performance across all platforms with live data updates and instant notifications.' },
              { icon: '🤖', title: 'AI Optimization', desc: 'Get intelligent suggestions to improve your ad copy, targeting, and budget allocation.' },
              { icon: '🔗', title: 'Multi-Platform', desc: 'Connect Facebook, Google Ads, TikTok, and more platforms in one unified dashboard.' },
              { icon: '📊', title: 'Advanced Analytics', desc: 'Deep insights with custom reports, ROI tracking, and performance forecasting.' },
              { icon: '⚡', title: 'Smart Automation', desc: 'Automate bid adjustments, budget reallocation, and campaign optimization.' },
              { icon: '🎯', title: 'ROI Maximization', desc: 'Maximize return on ad spend with data-driven optimization recommendations.' }
            ].map((feature, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{ fontSize: '30px', marginBottom: '16px' }}>{feature.icon}</div>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>{feature.title}</h4>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status Bar */}
      <section style={{ padding: '32px 0', backgroundColor: '#764ba2', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <p style={{ fontSize: '18px', margin: 0 }}>
            🟢 <strong>Status:</strong> Platform Active | <strong>API Health:</strong> All Systems Operational
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1f2937', color: 'white', padding: '32px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#764ba2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>ADL</span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>AD DATA LOGIC</span>
          </div>
          <div style={{ borderTop: '1px solid #374151', paddingTop: '16px' }}>
            <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
              © 2025 Leffler International Investments Pty Ltd | ABN 90124089345<br />
              Level 2, 222 Pitt Street, Sydney 2000, Australia<br />
              Office: 0478 965 828 | Email: leffleryd@gmail.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
