#!/bin/bash

# 🎨 Dark Pool DEX UI Startup Script
# This script sets up and starts the beautiful trading interface

set -e

echo "🎨 =================================================="
echo "         DARK POOL DEX - UI STARTUP"
echo "         Beautiful Privacy-First Trading Interface"
echo "=================================================="

# Check if we're in the right directory
if [ ! -d "dark-pool-ui" ]; then
    echo "❌ dark-pool-ui directory not found!"
    echo "   Please run this script from the project root"
    exit 1
fi

cd dark-pool-ui

echo ""
echo "📦 Installing UI Dependencies..."
echo "================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "🔄 Installing npm packages..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🚀 Starting Development Server..."
echo "================================="

echo "🌊 Features included:"
echo "  • Modern React 18 with TypeScript"
echo "  • RainbowKit wallet integration"
echo "  • Beautiful dark theme with glassmorphism"
echo "  • Real-time order book with privacy"
echo "  • ZK proof visualization modal"
echo "  • Transaction status tracking"
echo "  • Responsive design for all devices"
echo ""

echo "🔗 The interface will connect to your deployed contracts:"
echo "  • Dark CoW Hook: 0xe5148998c5469511dF5740F3eB01766f0945d088"
echo "  • Order Service Manager: 0x1291Be112d480055DaFd8a610b7d1e203891C274"
echo "  • Pool Manager: 0xc351628EB244ec633d5f21fBD6621e1a683B1181"
echo ""

echo "⚡ Starting on http://localhost:3000..."
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm start
