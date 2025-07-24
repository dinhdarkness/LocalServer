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

echo "✅ Node.js version: $(node --version)"
echo "============================================================"
echo "🚀 Local Server - File Management System"
echo "============================================================"
echo ""
echo "Chọn môi trường để chạy:"
echo "1. Development (localhost)"
echo "2. Production (VPS/Domain)"
echo "3. VPS với port 23070"
echo "4. Domain với port 80 (không cần nhập port)"
echo "5. Domain với port 443 (HTTPS)"
echo "6. Tùy chỉnh port"
echo ""
read -p "Nhập lựa chọn (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🏃‍♂️ Khởi động server ở chế độ Development..."
        export NODE_ENV=development
        node server.js
        ;;
    2)
        echo ""
        echo "🏃‍♂️ Khởi động server ở chế độ Production..."
        export NODE_ENV=production
        node server.js
        ;;
    3)
        echo ""
        echo "🏃‍♂️ Khởi động server trên VPS..."
        export NODE_ENV=production
        export PORT=23070
        node server.js
        ;;
    4)
        echo ""
        echo "🏃‍♂️ Khởi động server trên Domain (HTTP - không cần port)..."
        export NODE_ENV=production
        export PORT=80
        node server.js
        ;;
    5)
        echo ""
        echo "🏃‍♂️ Khởi động server trên Domain (HTTPS - không cần port)..."
        export NODE_ENV=production
        export PORT=443
        node server.js
        ;;
    6)
        echo ""
        read -p "Nhập port tùy chỉnh: " custom_port
        read -p "Nhập môi trường (development/production): " custom_env
        echo ""
        echo "🏃‍♂️ Khởi động server với cấu hình tùy chỉnh..."
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