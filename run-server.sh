#!/bin/bash

# Script universal để chạy Local Server
# Hỗ trợ nhiều cách tìm Node.js

echo "============================================================"
echo "🚀 Local Server - Universal Runner"
echo "============================================================"

# Load NVM nếu có
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    echo "📦 Loading NVM..."
    source "$HOME/.nvm/nvm.sh"
    nvm use default >/dev/null 2>&1
fi

# Tìm Node.js trong nhiều vị trí khác nhau
NODE_PATHS=(
    "node"
    "/usr/bin/node"
    "/usr/local/bin/node"
    "/opt/homebrew/bin/node"
    "/usr/local/node/bin/node"
    "$HOME/.nvm/versions/node/*/bin/node"
    "$HOME/.node/bin/node"
)

NODE_CMD=""

# Tìm Node.js
for path in "${NODE_PATHS[@]}"; do
    if command -v "$path" &> /dev/null; then
        NODE_CMD="$path"
        break
    fi
    
    # Xử lý wildcard paths
    if [[ "$path" == *"*"* ]]; then
        for expanded_path in $path; do
            if [ -x "$expanded_path" ]; then
                NODE_CMD="$expanded_path"
                break 2
            fi
        done
    fi
done

# Nếu không tìm thấy Node.js
if [ -z "$NODE_CMD" ]; then
    echo "❌ Node.js không được tìm thấy!"
    echo ""
    echo "🔍 Đã tìm kiếm tại:"
    for path in "${NODE_PATHS[@]}"; do
        echo "   • $path"
    done
    echo ""
    echo "💡 Cách khắc phục:"
    echo "1. Cài đặt Node.js: https://nodejs.org/"
    echo "2. Sử dụng nvm:"
    echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "   nvm install node"
    echo "3. Thêm Node.js vào PATH trong ~/.bashrc hoặc ~/.zshrc"
    echo "4. Hoặc chỉ định đường dẫn Node.js thủ công"
    echo ""
    read -p "Nhập đường dẫn Node.js thủ công (hoặc Enter để thoát): " manual_path
    if [ -n "$manual_path" ] && [ -x "$manual_path" ]; then
        NODE_CMD="$manual_path"
    else
        exit 1
    fi
fi

echo "✅ Sử dụng Node.js: $NODE_CMD"
echo "📦 Version: $($NODE_CMD --version)"
echo ""

# Kiểm tra dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Cài đặt dependencies..."
    $NODE_CMD npm install
    if [ $? -ne 0 ]; then
        echo "❌ Không thể cài đặt dependencies"
        exit 1
    fi
    echo "✅ Dependencies đã được cài đặt"
    echo ""
fi

# Menu chọn môi trường
echo "Chọn môi trường để chạy:"
echo "1. 🏠 Development (localhost:23070)"
echo "2. 🌐 Domain HTTP (ddarkness.io.vn - không port)"
echo "3. 🔒 Domain HTTPS (ddarkness.io.vn - không port)"
echo "4. 🖥️  VPS (14.225.211.126:23070)"
echo "5. 🔒 VPS HTTPS (14.225.211.126:443)"
echo "6. ⚙️  Tùy chỉnh"
echo ""
read -p "Nhập lựa chọn (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🏠 Khởi động Development server..."
        export NODE_ENV=development
        export PORT=23070
        $NODE_CMD server.js
        ;;
    2)
        echo ""
        echo "🌐 Khởi động Domain HTTP server..."
        export NODE_ENV=production
        export PORT=80
        $NODE_CMD server.js
        ;;
    3)
        echo ""
        echo "🔒 Khởi động Domain HTTPS server..."
        export NODE_ENV=production
        export PORT=443
        $NODE_CMD server.js
        ;;
    4)
        echo ""
        echo "🖥️ Khởi động VPS server..."
        export NODE_ENV=production
        export PORT=23070
        $NODE_CMD server.js
        ;;
    5)
        echo ""
        echo "🔒 Khởi động VPS HTTPS server..."
        export NODE_ENV=production
        export PORT=443
        $NODE_CMD server.js
        ;;
    6)
        echo ""
        read -p "Nhập port: " custom_port
        read -p "Nhập môi trường (development/production): " custom_env
        echo ""
        echo "⚙️ Khởi động server với cấu hình tùy chỉnh..."
        export NODE_ENV=$custom_env
        export PORT=$custom_port
        $NODE_CMD server.js
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