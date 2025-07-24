# Local Server - File Management System

Hệ thống quản lý file với giao diện web, hỗ trợ upload file và xem cấu trúc thư mục.

## 🌟 Tính năng

- 📁 Xem cấu trúc thư mục dạng cây
- 📤 Upload file (hỗ trợ nhiều file cùng lúc)
- 📝 Tạo thư mục mới
- ✏️ Đổi tên file/thư mục
- 📊 Thống kê số lượng file và dung lượng
- 🎯 Chọn và xem thông tin file/thư mục
- 🌐 Hỗ trợ nhiều môi trường (localhost, local IP, VPS, domain)

## 🚀 Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd LocalServer

# Cài đặt dependencies
npm install
```

## 🔧 Cấu hình

### File config.js
File này chứa cấu hình cho các môi trường khác nhau:

```javascript
// Các host được phép truy cập
allowedHosts: [
    'localhost',
    '127.0.0.1',
    '14.225.211.126',        // VPS IP
    'ddarkness.duckdns.org'  // Domain
]
```

### Biến môi trường
- `NODE_ENV`: development/production
- `PORT`: Port để chạy server (mặc định: 23070)

## 🏃‍♂️ Chạy server

### 1. Development (Local)
```bash
# Chạy trên localhost
npm run dev

# Hoặc
NODE_ENV=development node server.js
```

### 2. Production (VPS/Domain)
```bash
# Chạy trên VPS với port 23070
npm run vps

# Chạy trên domain với port 80 (không cần nhập port)
npm run domain

# Chạy trên domain với port 443 (HTTPS - không cần nhập port)
npm run domain-https

# Chạy HTTPS với script chuyên dụng
npm run https

# Hoặc
NODE_ENV=production node server.js
```

### 3. Tùy chỉnh port
```bash
# Chạy với port tùy chỉnh
PORT=3000 NODE_ENV=production node server.js
```

### 4. Chuyển đổi môi trường nhanh
```bash
# Sử dụng script chuyển đổi
npm run switch

# Hoặc
./switch-env.sh
```

### 5. Chạy HTTPS
```bash
# Script HTTPS chuyên dụng
npm run https

# Hoặc
./start-https.sh
```

### 6. Script Universal (Khuyến nghị)
```bash
# Script tự động tìm Node.js và cài đặt dependencies
npm run run

# Linux/Mac
./run-server.sh

# Windows
run-server.bat
```

## 🌐 Truy cập

Sau khi khởi động server, bạn có thể truy cập qua các URL sau:

### 📝 Lưu ý về Domain URLs:
- **Port 80**: Truy cập trực tiếp `http://ddarkness.duckdns.org` (không cần nhập port)
- **Port 443**: Truy cập trực tiếp `https://ddarkness.duckdns.org` (không cần nhập port)
- **Port khác**: Cần nhập port `http://ddarkness.duckdns.org:23070`

### 🔒 SSL Certificate:
- Sử dụng Let's Encrypt certificate đã cấu hình
- Tự động detect SSL certificate tại `/etc/letsencrypt/live/ddarkness.duckdns.org/`
- Hỗ trợ HTTPS cho domain và VPS IP

### Development
- **Localhost**: http://localhost:23070
- **Local IP**: http://[local-ip]:23070

### Production
- **VPS IP**: http://14.225.211.126:23070
- **Domain (HTTP)**: http://ddarkness.duckdns.org
- **Domain (HTTPS)**: https://ddarkness.duckdns.org

## 📁 Cấu trúc thư mục

```
LocalServer/
├── public/
│   ├── index.html      # Giao diện chính
│   ├── script.js       # Logic JavaScript
│   └── styles.css      # CSS styling
├── hot-update/         # Thư mục upload file
├── server.js           # Server Express
├── config.js           # Cấu hình môi trường
├── package.json        # Dependencies
└── README.md           # Hướng dẫn
```

## 🔒 Bảo mật

### CORS Configuration
- **Development**: Cho phép tất cả origin (`*`)
- **Production**: Chỉ cho phép các host được cấu hình

### File Upload
- Giới hạn file size: 50MB
- Hỗ trợ nhiều file cùng lúc
- Tự động tạo thư mục nếu chưa tồn tại

## 🛠️ API Endpoints

### GET `/api/tree`
Lấy cấu trúc thư mục
```json
{
  "success": true,
  "data": {
    "root": "hot-update",
    "path": "/path/to/hot-update",
    "items": [...]
  }
}
```

### POST `/api/upload`
Upload file
```json
{
  "uploadPath": "optional/subfolder",
  "file": "file_data"
}
```

### POST `/api/folder`
Tạo thư mục mới
```json
{
  "folderPath": "optional/path",
  "folderName": "new_folder"
}
```

### PUT `/api/rename`
Đổi tên file/thư mục
```json
{
  "oldPath": "path/to/old_name",
  "newName": "new_name"
}
```

## 📝 Logs

Server sẽ hiển thị thông tin chi tiết khi khởi động:

```
============================================================
🚀 Server đã khởi động thành công!
============================================================
📍 Môi trường: development
🔧 Port: 23070
📁 Thư mục gốc: /path/to/LocalServer

🌐 Các URL có thể truy cập:
   • Localhost: http://localhost:23070
   • Local IP: http://192.168.1.100:23070
   • VPS IP: http://14.225.211.126:23070
   • Domain (HTTP): http://ddarkness.duckdns.org
   • Domain (HTTPS): https://ddarkness.duckdns.org

✅ Server sẵn sàng nhận kết nối!
============================================================
```

## 🔧 Troubleshooting

### Port đã được sử dụng
```bash
# Kiểm tra port đang sử dụng
lsof -i :23070

# Kill process nếu cần
kill -9 <PID>
```

### Permission denied
```bash
# Chạy với quyền admin (Linux/Mac)
sudo npm run vps

# Hoặc thay đổi port
PORT=8080 npm run vps
```

### SSL Certificate issues
```bash
# Kiểm tra SSL certificate
ls -la /etc/letsencrypt/live/ddarkness.duckdns.org/

# Chạy với quyền admin để đọc SSL files
sudo npm run domain-https

# Hoặc chạy HTTP nếu SSL không khả dụng
npm run domain
```

### Node.js not found
```bash
# Sử dụng script universal (tự động tìm Node.js)
npm run run

# Hoặc cài đặt Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node

# Hoặc tải từ https://nodejs.org/
```

### CORS errors
Kiểm tra file `config.js` và đảm bảo domain được thêm vào `allowedHosts`.

## 📄 License

ISC License 