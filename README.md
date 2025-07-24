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

# Chạy trên domain với port 80
npm run domain

# Hoặc
NODE_ENV=production node server.js
```

### 3. Tùy chỉnh port
```bash
# Chạy với port tùy chỉnh
PORT=3000 NODE_ENV=production node server.js
```

## 🌐 Truy cập

Sau khi khởi động server, bạn có thể truy cập qua các URL sau:

### Development
- **Localhost**: http://localhost:23070
- **Local IP**: http://[local-ip]:23070

### Production
- **VPS IP**: http://14.225.211.126:23070
- **Domain**: http://ddarkness.duckdns.org:23070

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
   • Domain: http://ddarkness.duckdns.org:23070

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

### CORS errors
Kiểm tra file `config.js` và đảm bảo domain được thêm vào `allowedHosts`.

## 📄 License

ISC License 