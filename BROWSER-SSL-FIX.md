# 🔒 Hướng dẫn bỏ qua cảnh báo SSL trong trình duyệt

## 🚨 Vấn đề
Khi truy cập `https://192.168.1.37:23071/`, trình duyệt hiển thị cảnh báo:
> "It looks like the webpage at https://192.168.1.37:23071/ might be having issues, or it may have moved permanently to a new web address."

## ✅ Nguyên nhân
- Server đang hoạt động bình thường
- Vấn đề là do **self-signed certificate** không được trình duyệt tin tưởng
- Đây là hành vi bảo mật bình thường của trình duyệt

## 🔧 Cách khắc phục

### 🌐 **Chrome / Edge / Chromium**

1. Truy cập: `https://192.168.1.37:23071/`
2. Trang cảnh báo sẽ hiển thị
3. Click vào **"Advanced"** (Nâng cao)
4. Click vào **"Proceed to 192.168.1.37 (unsafe)"** (Tiếp tục đến 192.168.1.37 (không an toàn))
5. Trang web sẽ tải bình thường

### 🦊 **Firefox**

1. Truy cập: `https://192.168.1.37:23071/`
2. Trang cảnh báo sẽ hiển thị
3. Click vào **"Advanced"** (Nâng cao)
4. Click vào **"Accept the Risk and Continue"** (Chấp nhận rủi ro và tiếp tục)
5. Trang web sẽ tải bình thường

### 🍎 **Safari**

1. Truy cập: `https://192.168.1.37:23071/`
2. Trang cảnh báo sẽ hiển thị
3. Click vào **"Show Details"** (Hiển thị chi tiết)
4. Click vào **"visit this website"** (truy cập trang web này)
5. Trong popup, click **"Visit Website"** (Truy cập trang web)
6. Trang web sẽ tải bình thường

## 🧪 Test kết nối

Chạy lệnh sau để kiểm tra server:
```bash
node test-ssl.js
```

Kết quả mong đợi:
```
✅ HTTPS Status: 200
✅ Manifest Status: 200
✅ Manifest file is valid JSON
```

## 📱 **AssetsManagerEx**

Sau khi bỏ qua cảnh báo SSL, AssetsManagerEx sẽ hoạt động bình thường:
- URL: `https://192.168.1.37:23071/hot-update/flutter-remote-data/ktf1975/version.manifest`
- Status: ✅ Hoạt động

## ⚠️ Lưu ý quan trọng

1. **Chỉ bỏ qua cảnh báo trong môi trường development**
2. **Không sử dụng self-signed certificate cho production**
3. **Cảnh báo này là bảo mật bình thường**
4. **Server hoạt động hoàn toàn bình thường**

## 🔄 Các URL có thể truy cập

- **HTTPS**: https://192.168.1.37:23071/
- **HTTP**: http://192.168.1.37:23070/ (redirect sang HTTPS)
- **Localhost**: https://localhost:23071/

## 🎯 Kết luận

Server của bạn hoạt động hoàn toàn bình thường. Vấn đề chỉ là trình duyệt không tin tưởng self-signed certificate. Sau khi bỏ qua cảnh báo, mọi thứ sẽ hoạt động như mong đợi. 