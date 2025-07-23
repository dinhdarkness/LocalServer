# Directory Tree Viewer

Ứng dụng web hiển thị cấu trúc cây thư mục của server với giao diện đẹp và dễ sử dụng.

## Tính năng

- 🌳 Hiển thị cấu trúc cây thư mục đầy đủ
- 📁 Phân biệt thư mục và file với icon khác nhau
- 📊 Thống kê số lượng thư mục, file và tổng dung lượng
- 🔄 Làm mới dữ liệu theo thời gian thực
- 📂 Mở rộng/thu gọn tất cả thư mục
- 🆕 **Tạo thư mục mới** với đường dẫn tùy chỉnh
- 📤 **Upload file** vào thư mục bất kỳ
- ✏️ **Đổi tên** thư mục và file
- 🖱️ **Context menu** (click chuột phải) cho các thao tác nhanh
- 🔔 **Toast notifications** cho thông báo
- 🎨 Giao diện hiện đại với hiệu ứng đẹp mắt
- 📱 Responsive design cho mobile và desktop
- ⚡ Tương tác mượt mà với animation

## Cài đặt

### Cách 1: Sử dụng script tự động (Khuyến nghị)

**macOS/Linux:**
```bash
./start.sh
```

**Windows:**
```cmd
start.bat
```

### Cách 2: Thủ công

1. Cài đặt dependencies:
```bash
npm install
```

2. Khởi chạy server:
```bash
npm start
```

Hoặc chạy ở chế độ development với nodemon:
```bash
npm run dev
```

3. Mở trình duyệt và truy cập:
```
http://localhost:23070
```

## Cấu trúc dự án

```
LocalServer/
├── server.js              # Server Express
├── package.json           # Dependencies và scripts
├── start.sh               # Script khởi chạy (macOS/Linux)
├── start.bat              # Script khởi chạy (Windows)
├── public/                # Static files
│   ├── index.html         # Trang chính
│   ├── styles.css         # CSS styles
│   └── script.js          # JavaScript logic
└── README.md              # Hướng dẫn sử dụng
```

## API Endpoints

### GET /api/tree
Trả về cấu trúc cây thư mục hiện tại.

**Response:**
```json
{
  "success": true,
  "data": {
    "root": "LocalServer",
    "path": "/path/to/current/directory",
    "items": [
      {
        "name": "folder-name",
        "type": "directory",
        "path": "folder-name",
        "children": [...]
      },
      {
        "name": "file-name.js",
        "type": "file",
        "path": "file-name.js",
        "size": 1024
      }
    ]
  }
}
```

### POST /api/folder
Tạo thư mục mới.

**Request:**
```json
{
  "folderPath": "optional/path",
  "folderName": "new-folder"
}
```

### PUT /api/rename
Đổi tên thư mục hoặc file.

**Request:**
```json
{
  "oldPath": "path/to/old-name",
  "newName": "new-name"
}
```

### POST /api/upload
Upload file vào thư mục.

**Request:** FormData với:
- `file`: File cần upload
- `uploadPath`: Đường dẫn thư mục đích (optional)

## Tính năng giao diện

- **Header**: Tiêu đề và các nút điều khiển
- **Info Panel**: Hiển thị thông tin thư mục gốc và thời gian cập nhật
- **Tree Container**: Hiển thị cấu trúc cây thư mục với khả năng scroll
- **Stats Panel**: Thống kê tổng quan về thư mục và file

## Các nút điều khiển

- **Tạo thư mục**: Tạo thư mục mới với đường dẫn tùy chỉnh
- **Upload file**: Upload file vào thư mục bất kỳ
- **Làm mới**: Tải lại cấu trúc thư mục từ server
- **Mở rộng tất cả**: Hiển thị tất cả thư mục con
- **Thu gọn tất cả**: Ẩn tất cả thư mục con

## Tương tác

- Click vào thư mục để mở/đóng
- Icon thư mục thay đổi khi mở/đóng
- **Click chuột phải** để mở context menu với các tùy chọn:
  - Đổi tên thư mục/file
  - Upload file vào thư mục (chỉ cho thư mục)
- Hover effect trên các item
- Loading spinner khi tải dữ liệu
- Toast notifications cho thông báo thành công/lỗi
- Modal dialogs cho các thao tác phức tạp

## Công nghệ sử dụng

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JavaScript + CSS3
- **Icons**: Font Awesome
- **Styling**: CSS Grid + Flexbox + CSS Variables

## Lưu ý bảo mật

Ứng dụng này hiển thị toàn bộ cấu trúc thư mục của server. Hãy đảm bảo:
- Chỉ chạy trong môi trường an toàn
- Không expose ra internet nếu không cần thiết
- Kiểm soát quyền truy cập thư mục

## License

MIT License 