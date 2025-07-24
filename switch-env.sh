#!/bin/bash

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

echo "✅ Node.js version: $(node --version)"
echo "============================================================"
echo "🔄 Local Server - Environment Switcher"
echo "============================================================"
echo ""
echo "Chọn môi trường để chuyển đổi:"
echo "1. 🏠 Development (localhost:23070)"
echo "2. 🌐 Domain HTTP (ddarkness.duckdns.org - không port)"
echo "3. 🔒 Domain HTTPS (ddarkness.duckdns.org - không port)"
echo "4. 🖥️  VPS (14.225.211.126:23070)"
echo "5. 🔒 VPS HTTPS (14.225.211.126:443)"
echo "6. ⚙️  Tùy chỉnh"
echo ""
read -p "Nhập lựa chọn (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🏠 Chuyển sang môi trường Development..."
        echo "📍 URL: http://localhost:23070"
        echo "🔧 Port: 23070"
        echo "🌍 CORS: Mở (cho phép tất cả)"
        echo ""
        export NODE_ENV=development
        export PORT=23070
        node server.js
        ;;
    2)
        echo ""
        echo "🌐 Chuyển sang môi trường Domain HTTP..."
        echo "📍 URL: http://ddarkness.duckdns.org"
        echo "🔧 Port: 80"
        echo "🌍 CORS: Hạn chế (chỉ domain được phép)"
        echo ""
        export NODE_ENV=production
        export PORT=80
        node server.js
        ;;
    3)
        echo ""
        echo "🔒 Chuyển sang môi trường Domain HTTPS..."
        echo "📍 URL: https://ddarkness.duckdns.org"
        echo "🔧 Port: 443"
        echo "🌍 CORS: Hạn chế (chỉ domain được phép)"
        echo "⚠️  Lưu ý: Cần SSL certificate"
        echo ""
        export NODE_ENV=production
        export PORT=443
        node server.js
        ;;
    4)
        echo ""
        echo "🖥️ Chuyển sang môi trường VPS..."
        echo "📍 URL: http://14.225.211.126:23070"
        echo "🔧 Port: 23070"
        echo "🌍 CORS: Hạn chế (chỉ VPS IP được phép)"
        echo ""
        export NODE_ENV=production
        export PORT=23070
        node server.js
        ;;
    5)
        echo ""
        echo "🔒 Chuyển sang môi trường VPS HTTPS..."
        echo "📍 URL: https://14.225.211.126:443"
        echo "🔧 Port: 443"
        echo "🔐 SSL: Let's Encrypt Certificate"
        echo ""
        export NODE_ENV=production
        export PORT=443
        node server.js
        ;;
    6)
        echo ""
        read -p "Nhập port: " custom_port
        read -p "Nhập môi trường (development/production): " custom_env
        echo ""
        echo "⚙️ Chuyển sang môi trường tùy chỉnh..."
        echo "🔧 Port: $custom_port"
        echo "🌍 Môi trường: $custom_env"
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
echo "✅ Server đã dừng." 