#!/bin/bash

echo "============================================================"
echo "🔒 Local Server - HTTPS Starter"
echo "============================================================"
echo ""
echo "Chọn cách chạy HTTPS:"
echo "1. 🔒 Domain HTTPS (ddarkness.duckdns.org - port 443)"
echo "2. 🔒 VPS HTTPS (14.225.211.126:443)"
echo "3. 🔒 Local HTTPS (localhost:443)"
echo "4. 🔒 Tùy chỉnh HTTPS port"
echo ""
read -p "Nhập lựa chọn (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🔒 Khởi động HTTPS server cho Domain..."
        echo "📍 URL: https://ddarkness.duckdns.org"
        echo "🔧 Port: 443"
        echo "🔐 SSL: Let's Encrypt Certificate"
        echo ""
        export NODE_ENV=production
        export PORT=443
        node server.js
        ;;
    2)
        echo ""
        echo "🔒 Khởi động HTTPS server cho VPS..."
        echo "📍 URL: https://14.225.211.126:443"
        echo "🔧 Port: 443"
        echo "🔐 SSL: Let's Encrypt Certificate"
        echo ""
        export NODE_ENV=production
        export PORT=443
        node server.js
        ;;
    3)
        echo ""
        echo "🔒 Khởi động HTTPS server cho Local..."
        echo "📍 URL: https://localhost:443"
        echo "🔧 Port: 443"
        echo "🔐 SSL: Let's Encrypt Certificate"
        echo ""
        export NODE_ENV=development
        export PORT=443
        node server.js
        ;;
    4)
        echo ""
        read -p "Nhập HTTPS port tùy chỉnh: " custom_port
        read -p "Nhập môi trường (development/production): " custom_env
        echo ""
        echo "🔒 Khởi động HTTPS server với port tùy chỉnh..."
        echo "🔧 Port: $custom_port"
        echo "🔐 SSL: Let's Encrypt Certificate"
        echo ""
        export NODE_ENV=$custom_env
        export PORT=$custom_port
        node server.js
        ;;
    *)
        echo ""
        echo "❌ Lựa chọn không hợp lệ!"
        echo ""
        exit 1
        ;;
esac

echo ""
echo "✅ HTTPS Server đã dừng." 