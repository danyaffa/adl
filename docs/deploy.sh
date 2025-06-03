#!/bin/bash

# ADL Deployment Script
# This script helps deploy ADL to various platforms

echo "🚀 ADL Deployment Script"
echo "========================"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Function to deploy to Vercel
deploy_vercel() {
    echo "📦 Deploying to Vercel..."
    
    # Check if vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm i -g vercel
    fi
    
    # Deploy
    vercel --prod
    
    echo "✅ Deployed to Vercel!"
    echo "⚠️  Don't forget to add MONGODB_URI in Vercel dashboard"
}

# Function to deploy to Railway
deploy_railway() {
    echo "📦 Deploying to Railway..."
    
    # Check if railway CLI is installed
    if ! command -v railway &> /dev/null; then
        echo "Installing Railway CLI..."
        npm i -g @railway/cli
    fi
    
    # Login and deploy
    railway login
    railway up
    
    echo "✅ Deployed to Railway!"
}

# Function to deploy to Netlify (frontend only)
deploy_netlify() {
    echo "📦 Deploying frontend to Netlify..."
    
    # Create dist folder
    mkdir -p dist
    cp index.html dist/
    cp -r public/* dist/
    
    # Check if netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        echo "Installing Netlify CLI..."
        npm i -g netlify-cli
    fi
    
    # Deploy
    netlify deploy --prod --dir=dist
    
    echo "✅ Frontend deployed to Netlify!"
    echo "⚠️  Remember to deploy backend separately"
}

# Function to setup MongoDB
setup_mongodb() {
    echo "🗄️  MongoDB Setup Instructions:"
    echo "1. Go to https://mongodb.com/cloud/atlas"
    echo "2. Create a free M0 cluster"
    echo "3. Create database: adl_tracking"
    echo "4. Create collections: campaigns, tracking_events, analytics_data"
    echo "5. Get your connection string and add to .env file"
    echo ""
    read -p "Press enter when MongoDB is ready..."
}

# Function to create app icons
create_icons() {
    echo "🎨 Creating app icons..."
    
    mkdir -p public/icons
    
    # Create a simple ADL icon using ImageMagick (if available)
    if command -v convert &> /dev/null; then
        # Create base icon
        convert -size 1024x1024 xc:white \
            -fill "#EF4444" -draw "rectangle 0,0 341,1024" \
            -fill "#F97316" -draw "rectangle 341,0 682,1024" \
            -fill "#3B82F6" -draw "rectangle 682,0 1024,1024" \
            -fill "black" -font Arial -pointsize 800 \
            -annotate +100+800 "ADL" \
            public/icons/icon-1024.png
        
        # Create other sizes
        convert public/icons/icon-1024.png -resize 512x512 public/icons/icon-512.png
        convert public/icons/icon-1024.png -resize 192x192 public/icons/icon-192.png
        
        echo "✅ Icons created!"
    else
        echo "⚠️  ImageMagick not found. Please create icons manually:"
        echo "   - 192x192px → public/icons/icon-192.png"
