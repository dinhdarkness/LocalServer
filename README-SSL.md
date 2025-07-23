# 🔐 Hướng dẫn sử dụng SSL cho LocalServer

## Cài đặt SSL

### Bước 1: Tạo SSL Certificate
```bash
npm run ssl
```

Script này sẽ:
- Tạo thư mục `ssl/`
- Tạo private key (`private-key.pem`)
- Tạo self-signed certificate (`certificate.pem`)
- Certificate có hiệu lực 365 ngày

### Bước 2: Khởi động server với SSL
```bash
npm start
```

Hoặc chạy cả hai bước cùng lúc:
```bash
npm run setup
```

## Cách hoạt động

### HTTP Server (Port 23070)
- Redirect tất cả traffic sang HTTPS
- Không xử lý request trực tiếp

### HTTPS Server (Port 23071)
- Xử lý tất cả request với SSL encryption
- Sử dụng self-signed certificate

## Truy cập

- **HTTPS**: https://localhost:23071
- **HTTP**: http://localhost:23070 (sẽ redirect sang HTTPS)

## Cảnh báo bảo mật

Khi truy cập lần đầu, trình duyệt sẽ hiển thị cảnh báo bảo mật vì đây là self-signed certificate:

### Chrome/Edge
1. Click "Advanced"
2. Click "Proceed to localhost (unsafe)"

### Firefox
1. Click "Advanced"
2. Click "Accept the Risk and Continue"

### Safari
1. Click "Show Details"
2. Click "visit this website"
3. Click "Visit Website" trong popup

## Tùy chỉnh

### Thay đổi port
```javascript
// Trong server.js
const HTTPS_PORT = process.env.HTTPS_PORT || 23071;
```

### Thay đổi thông tin certificate
```javascript
// Trong generate-ssl.js
-subj "/C=VN/ST=HoChiMinh/L=HoChiMinh/O=LocalServer/OU=IT/CN=localhost"
```

### Thay đổi thời hạn certificate
```javascript
// Trong generate-ssl.js
-days 365
```

## Troubleshooting

### Lỗi "openssl command not found"
- Cài đặt OpenSSL trên hệ thống
- macOS: `brew install openssl`
- Ubuntu: `sudo apt-get install openssl`
- Windows: Tải từ https://slproweb.com/products/Win32OpenSSL.html

### Lỗi "ENOENT: no such file or directory"
- Chạy `npm run ssl` trước khi `npm start`
- Kiểm tra thư mục `ssl/` đã được tạo

### Certificate expired
- Xóa thư mục `ssl/`
- Chạy lại `npm run ssl`

## Bảo mật

⚠️ **Lưu ý quan trọng**:
- Self-signed certificate chỉ phù hợp cho development
- Không sử dụng cho production
- Certificate được lưu trong thư mục `ssl/` - không commit lên git
- Thêm `ssl/` vào `.gitignore`

## Production

Để sử dụng trong production:
1. Mua SSL certificate từ CA (Let's Encrypt, Comodo, etc.)
2. Thay thế files trong thư mục `ssl/`
3. Cập nhật `sslOptions` trong `server.js` 