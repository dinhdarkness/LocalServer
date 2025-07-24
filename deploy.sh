#!/bin/bash

# Load NVM nếu có
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    echo "📦 Loading NVM..."
    source "$HOME/.nvm/nvm.sh"
    nvm use default >/dev/null 2>&1
fi

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js không được tìm thấy!"
    echo "Vui lòng cài đặt Node.js hoặc đảm bảo nó có trong PATH"
    echo ""
    echo "Cách khắc phục:"
    echo "1. Cài đặt Node.js: https://nodejs.org/"
    echo "2. Hoặc sử dụng nvm: nvm install node"
    echo "3. Hoặc thêm Node.js vào PATH"
    exit 1
fi

git pull
npm install
echo ""
echo "🔒 Khởi động HTTPS server cho Domain..."
echo "📍 URL: https://ddarkness.duckdns.org"
echo "🔧 Port: 443"
echo "🔐 SSL: Let's Encrypt Certificate"
echo ""
export NODE_ENV=production
export PORT=443
node server.js