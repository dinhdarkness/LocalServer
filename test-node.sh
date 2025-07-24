#!/bin/bash

echo "============================================================"
echo "🧪 Test Node.js Environment"
echo "============================================================"

echo "📋 Thông tin hệ thống:"
echo "   • Shell: $SHELL"
echo "   • User: $USER"
echo "   • Home: $HOME"
echo ""

echo "🔍 Kiểm tra PATH:"
echo "$PATH" | tr ':' '\n' | grep -E "(node|nvm)" | head -10
echo ""

echo "📦 Kiểm tra NVM:"
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    echo "   ✅ NVM script tồn tại: $HOME/.nvm/nvm.sh"
    
    echo "   📥 Loading NVM..."
    source "$HOME/.nvm/nvm.sh"
    
    echo "   🔧 NVM version: $(nvm --version 2>/dev/null || echo 'Không tìm thấy')"
    echo "   📦 Node version hiện tại: $(nvm current 2>/dev/null || echo 'Không tìm thấy')"
    echo "   📦 Node version mặc định: $(nvm alias default 2>/dev/null || echo 'Không tìm thấy')"
    
    echo "   🔄 Chuyển sang Node mặc định..."
    nvm use default >/dev/null 2>&1
else
    echo "   ❌ NVM script không tồn tại"
fi
echo ""

echo "🔍 Kiểm tra Node.js:"
if command -v node &> /dev/null; then
    echo "   ✅ Node.js tìm thấy: $(which node)"
    echo "   📦 Version: $(node --version)"
else
    echo "   ❌ Node.js không tìm thấy trong PATH"
fi
echo ""

echo "🔍 Kiểm tra trực tiếp NVM paths:"
NVM_PATHS=(
    "$HOME/.nvm/versions/node/*/bin/node"
    "$HOME/.nvm/current/bin/node"
)

for path in "${NVM_PATHS[@]}"; do
    for expanded_path in $path; do
        if [ -x "$expanded_path" ]; then
            echo "   ✅ Tìm thấy: $expanded_path"
            echo "   📦 Version: $($expanded_path --version)"
        fi
    done
done
echo ""

echo "🧪 Test chạy Node.js:"
if command -v node &> /dev/null; then
    echo "   ✅ Có thể chạy: node --version"
    node --version
else
    echo "   ❌ Không thể chạy node command"
fi
echo ""

echo "============================================================"
echo "✅ Test hoàn thành!"
echo "============================================================" 