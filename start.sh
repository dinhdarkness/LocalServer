#!/bin/bash

# Script khởi chạy Directory Tree Viewer
# Tác giả: AI Assistant
# Ngày tạo: $(date)

# Màu sắc cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Hàm in thông báo với màu
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Directory Tree Viewer${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Kiểm tra Node.js
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js không được cài đặt. Vui lòng cài đặt Node.js trước."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_message "Node.js version: $NODE_VERSION"
}

# Kiểm tra npm
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm không được cài đặt. Vui lòng cài đặt npm trước."
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_message "npm version: $NPM_VERSION"
}

# Cài đặt dependencies nếu cần
install_dependencies() {
    if [ ! -d "node_modules" ]; then
        print_message "Cài đặt dependencies..."
        npm install
        if [ $? -ne 0 ]; then
            print_error "Không thể cài đặt dependencies"
            exit 1
        fi
        print_message "Dependencies đã được cài đặt thành công"
    else
        print_message "Dependencies đã tồn tại"
    fi
}

# Khởi chạy server
start_server() {
    print_message "Khởi chạy server..."
    
    # Chạy server trong background
    npm run setup &
    SERVER_PID=$!
    
    # Đợi server khởi động
    sleep 3
    
    # Kiểm tra xem server có chạy không
    if kill -0 $SERVER_PID 2>/dev/null; then
        print_message "Server đã khởi chạy thành công (PID: $SERVER_PID)"
        return 0
    else
        print_error "Không thể khởi chạy server"
        return 1
    fi
}

# Mở trình duyệt
open_browser() {
    local port=${1:-23071}
    local url="https://localhost:$port"
    
    print_message "Mở trình duyệt tại: $url"
    
    # Xác định hệ điều hành và mở trình duyệt phù hợp
    case "$(uname -s)" in
        Darwin*)    # macOS
            open "$url"
            ;;
        Linux*)     # Linux
            if command -v xdg-open &> /dev/null; then
                xdg-open "$url"
            elif command -v gnome-open &> /dev/null; then
                gnome-open "$url"
            else
                print_warning "Không thể tự động mở trình duyệt. Vui lòng mở thủ công: $url"
            fi
            ;;
        CYGWIN*|MINGW32*|MSYS*|MINGW*)  # Windows
            start "$url"
            ;;
        *)
            print_warning "Hệ điều hành không được hỗ trợ. Vui lòng mở thủ công: $url"
            ;;
    esac
}

# Hàm cleanup khi thoát
cleanup() {
    print_message "Đang dừng server..."
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null
        print_message "Server đã được dừng"
    fi
    exit 0
}

# Bắt sự kiện thoát
trap cleanup SIGINT SIGTERM

# Hàm chính
main() {
    print_header
    
    # Kiểm tra môi trường
    check_node
    check_npm
    
    # Cài đặt dependencies
    install_dependencies
    
    # Khởi chạy server
    if start_server; then
        # Mở trình duyệt
        open_browser
        
        print_message "Ứng dụng đã sẵn sàng!"
        print_message "Nhấn Ctrl+C để dừng server"
        
        # Giữ script chạy
        wait $SERVER_PID
    else
        print_error "Không thể khởi chạy ứng dụng"
        exit 1
    fi
}

# Chạy hàm chính
main 