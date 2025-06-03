#!/bin/bash

# ADL Tracking System - Production Deployment Script
echo "🚀 Starting ADL Tracking System Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    print_warning "Creating .env template..."
    
    cat << EOF > .env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/adl_tracking

# JWT Secret (CHANGE THIS!)
JWT_SECRET=$(openssl rand -base64 64)

# Server Configuration
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    
    print_warning "Please update .env file with your MongoDB Atlas credentials before continuing!"
    exit 1
fi

print_header "SYSTEM REQUIREMENTS CHECK"

# Check Node.js version
NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -eq 0 ]; then
    print_status "Node.js version: $NODE_VERSION"
else
    print_error "Node.js not found! Please install Node.js 18+ first."
    exit 1
fi

# Check npm version
NPM_VERSION=$(npm --version 2>/dev/null)
if [ $? -eq 0 ]; then
    print_status "npm version: $NPM_VERSION"
else
    print_error "npm not found!"
    exit 1
fi

# Check if MongoDB URI is configured
MONGODB_URI=$(grep "MONGODB_URI=" .env | cut -d '=' -f2)
if [[ $MONGODB_URI == *"username:password"* ]]; then
    print_error "Please configure your MongoDB Atlas URI in .env file!"
    exit 1
fi

print_header "INSTALLING DEPENDENCIES"

# Install backend dependencies
print_status "Installing backend dependencies..."
npm install

# Create frontend directory structure if it doesn't exist
if [ ! -d "frontend" ]; then
    print_status "Creating frontend structure..."
    mkdir -p frontend/src frontend/public
    
    # Create frontend package.json
    cat << EOF > frontend/package.json
{
  "name": "adl-tracking-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF
    
    # Copy the React app code
    cp -r src/* frontend/src/ 2>/dev/null || true
fi

# Install frontend dependencies
if [ -d "frontend" ]; then
    print_status "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

print_header "BUILDING APPLICATION"

# Build frontend for production
if [ -d "frontend" ]; then
    print_status "Building frontend for production..."
    cd frontend && npm run build && cd ..
    
    # Copy build files to backend public directory
    rm -rf backend/public
    cp -r frontend/build backend/public
    print_status "Frontend build copied to backend/public"
fi

print_header "DATABASE SETUP"

# Test MongoDB connection
print_status "Testing MongoDB Atlas connection..."
node -e "
const { MongoClient } = require('mongodb');
require('dotenv').config();

MongoClient.connect(process.env.MONGODB_URI)
  .then(client => {
    console.log('✅ MongoDB Atlas connection successful!');
    client.close();
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    process.exit(1);
  });
"

if [ $? -ne 0 ]; then
    print_error "MongoDB Atlas connection failed! Please check your MONGODB_URI in .env"
    exit 1
fi

print_header "SECURITY SETUP"

# Generate secure JWT secret if not set
JWT_SECRET=$(grep "JWT_SECRET=" .env | cut -d '=' -f2)
if [ ${#JWT_SECRET} -lt 32 ]; then
    print_warning "Generating secure JWT secret..."
    NEW_JWT_SECRET=$(openssl rand -base64 64)
    sed -i "s|JWT_SECRET=.*|JWT_SECRET=$NEW_JWT_SECRET|" .env
    print_status "JWT secret updated"
fi

print_header "PM2 SETUP"

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2 globally..."
    npm install -g pm2
fi

# Create PM2 ecosystem file
cat << EOF > ecosystem.config.js
module.exports = {
  apps: [{
    name: 'adl-tracking-server',
    script: 'backend/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Start application with PM2
print_status "Starting application with PM2..."
pm2 delete adl-tracking-server 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup

print_header "NGINX SETUP (OPTIONAL)"

# Create Nginx configuration template
cat << EOF > nginx.conf.template
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL Configuration (replace with your certificates)
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # Proxy to Node.js application
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Static files caching
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

print_status "Nginx configuration template created: nginx.conf.template"

print_header "FIREWALL SETUP"

# Basic UFW firewall setup
if command -v ufw &> /dev/null; then
    print_status "Setting up basic firewall rules..."
    ufw --force enable
    ufw allow ssh
    ufw allow 80
    ufw allow 443
    ufw allow 3001
    print_status "Firewall configured"
fi

print_header "HEALTH CHECK"

# Wait for server to start
sleep 5

# Test server health
print_status "Testing server health..."
HEALTH_RESPONSE=$(curl -s http://localhost:3001/api/health 2>/dev/null)
if [[ $HEALTH_RESPONSE == *"healthy"* ]]; then
    print_status "✅ Server is healthy and running!"
else
    print_warning "⚠️  Server health check failed. Check logs:"
    pm2 logs adl-tracking-server --lines 10
fi

print_header "DEPLOYMENT COMPLETE"

print_status "🎉 ADL Tracking System deployed successfully!"
echo ""
print_status "📊 Application Details:"
echo "   • Server URL: http://localhost:3001"
echo "   • Health Check: http://localhost:3001/api/health"
echo "   • PM2 Status: pm2 status"
echo "   • View Logs: pm2 logs adl-tracking-server"
echo ""
print_status "🔧 Next Steps:"
echo "   1. Configure your domain DNS to point to this server"
echo "   2. Set up SSL certificates (Let's Encrypt recommended)"
echo "   3. Configure Nginx reverse proxy using nginx.conf.template"
echo "   4. Update FRONTEND_URL in .env with your domain"
echo "   5. Test tracking pixels and conversions"
echo ""
print_status "💡 Useful Commands:"
echo "   • Restart: pm2 restart adl-tracking-server"
echo "   • Stop: pm2 stop adl-tracking-server"
echo "   • Monitor: pm2 monit"
echo "   • Update: git pull && npm run deploy"
echo ""
print_status "🔒 Security Notes:"
echo "   • JWT secret has been generated automatically"
echo "   • Change default passwords in .env"
echo "   • Enable HTTPS in production"
echo "   • Regularly update dependencies: npm audit"

print_header "DEPLOYMENT SUCCESS"
