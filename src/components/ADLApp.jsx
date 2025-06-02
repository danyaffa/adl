import React, { useState } from 'react';

const ADLApp = () => {
  const [user, setUser] = useState(null);

  const Login = () => {
    const [email, setEmail] = useState('');

    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6, #ec4899)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '2rem',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(to right, #ef4444, #f97316, #2563eb)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '0 auto 1rem'
            }}>
              ADL
            </div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #ef4444, #f97316, #2563eb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem'
            }}>
              Ad Data Logic
            </h1>
            <p style={{ color: '#6b7280' }}>🚀 Smart Ad Management Platform</p>
          </div>

          <form onSubmit={(e) => { 
            e.preventDefault(); 
            setUser({ email, name: 'John Doe' }); 
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '0.5rem' 
              }}>
                📧 Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(to right, #2563eb, #8b5cf6)',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🚀 Sign In & Get Started
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Leffler International Investments Pty Ltd | ABN 90124089345<br/>
              Level 2, 222 Pitt Street, Sydney 2000, Australia<br/>
              Office: 0478 965 828 | Email: leffleryd@gmail.com
            </p>
          </div>
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f9fafb',
      padding: '2rem' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span>📊</span>
            <span>ADL Dashboard</span>
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Welcome back! Here's what's happening with your campaigns.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {[
              { title: 'Active Campaigns', value: '12', icon: '🎯' },
              { title: 'Total Clicks', value: '45,678', icon: '👆' },
              { title: 'Ad Spend', value: '$12,345', icon: '💰' },
              { title: 'ROI', value: '234%', icon: '📊' }
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{ 
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      marginBottom: '0.25rem'
                    }}>
                      {stat.title}
                    </p>
                    <p style={{ 
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#1f2937'
                    }}>
                      {stat.value}
                    </p>
                  </div>
                  <div style={{ fontSize: '2.5rem' }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'linear-gradient(to right, #fef3ff, #eff6ff)',
            border: '1px solid #e879f9',
            borderRadius: '0.75rem',
            padding: '1.5rem'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>🤖</span>
              <span>AI Learning Recommendations</span>
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Your TikTok campaign could reach 23% more users by adjusting age targeting to 18-34.
            </p>
            <button style={{
              background: '#8b5cf6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Apply Suggestion →
            </button>
          </div>
        </div>

        <div style={{ 
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Leffler International Investments Pty Ltd | ABN 90124089345<br/>
            Level 2, 222 Pitt Street, Sydney 2000, Australia<br/>
            Office: 0478 965 828 | Email: leffleryd@gmail.com
          </p>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return <Login />;
  }

  return <Dashboard />;
};

export default ADLApp;
