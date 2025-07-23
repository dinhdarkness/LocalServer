const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 23070;
const HTTPS_PORT = process.env.HTTPS_PORT || 23071;

// Middleware để parse JSON
app.use(express.json());
app.use(express.static('public'));

// Cấu hình multer cho upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = path.join(process.cwd(), 'hot-update');
        
        // Nếu có uploadPath trong body, thêm vào đường dẫn gốc
        if (req.body.uploadPath && req.body.uploadPath.trim()) {
            uploadPath = path.join(uploadPath, req.body.uploadPath.trim());
        }
        
        // Tạo thư mục nếu không tồn tại
        if (!fs.existsSync(uploadPath)) {
            try {
                fs.mkdirSync(uploadPath, { recursive: true });
            } catch (error) {
                return cb(new Error(`Không thể tạo thư mục: ${uploadPath}`));
            }
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // Giới hạn 50MB
    }
});

// Hàm đệ quy để lấy cấu trúc thư mục
function getDirectoryTree(dirPath, basePath = '') {
    const items = [];
    
    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            const relativePath = path.join(basePath, entry.name);
            
            if (entry.isDirectory()) {
                const children = getDirectoryTree(fullPath, relativePath);
                items.push({
                    name: entry.name,
                    type: 'directory',
                    path: relativePath,
                    children: children
                });
            } else {
                items.push({
                    name: entry.name,
                    type: 'file',
                    path: relativePath,
                    size: fs.statSync(fullPath).size
                });
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error.message);
    }
    
    return items.sort((a, b) => {
        // Sắp xếp: thư mục trước, sau đó đến file
        if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });
}

// API endpoint để lấy cấu trúc thư mục
app.get('/api/tree', (req, res) => {
    try {
        const rootPath = process.cwd();
        const hot_update_path = path.join(rootPath, 'public', 'hot-update');
        const tree = getDirectoryTree(hot_update_path);
        
        res.json({
            success: true,
            data: {
                root: path.basename(hot_update_path),
                path: hot_update_path,
                items: tree
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// API tạo thư mục mới
app.post('/api/folder', (req, res) => {
    try {
        const { folderPath, folderName } = req.body;
        const fullPath = path.join(process.cwd(), folderPath || '', folderName);
        
        if (fs.existsSync(fullPath)) {
            return res.status(400).json({
                success: false,
                error: 'Thư mục đã tồn tại'
            });
        }
        
        fs.mkdirSync(fullPath, { recursive: true });
        
        res.json({
            success: true,
            message: 'Thư mục đã được tạo thành công',
            path: fullPath
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// API đổi tên thư mục/file
app.put('/api/rename', (req, res) => {
    try {
        const { oldPath, newName } = req.body;
        const fullOldPath = path.join(process.cwd(), oldPath);
        const fullNewPath = path.join(process.cwd(), path.dirname(oldPath), newName);
        
        if (!fs.existsSync(fullOldPath)) {
            return res.status(404).json({
                success: false,
                error: 'Thư mục/file không tồn tại'
            });
        }
        
        if (fs.existsSync(fullNewPath)) {
            return res.status(400).json({
                success: false,
                error: 'Tên mới đã tồn tại'
            });
        }
        
        fs.renameSync(fullOldPath, fullNewPath);
        
        res.json({
            success: true,
            message: 'Đổi tên thành công',
            newPath: path.join(path.dirname(oldPath), newName)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// API upload file
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Không có file được upload'
            });
        }
        
        const uploadPath = path.join(process.cwd(), 'hot-update', req.body.uploadPath || '');
        const relativePath = uploadPath ? path.join(uploadPath, req.file.originalname) : req.file.originalname;
        console.log(relativePath);
        res.json({
            success: true,
            message: 'File đã được upload thành công',
            file: {
                name: req.file.originalname,
                size: req.file.size,
                path: relativePath
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Có lỗi xảy ra khi upload file'
        });
    }
});

// Error handler cho multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'File quá lớn. Giới hạn 50MB'
            });
        }
        return res.status(400).json({
            success: false,
            error: `Lỗi upload: ${error.message}`
        });
    }
    
    if (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Có lỗi xảy ra'
        });
    }
    
    next();
});

// Route chính
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Kiểm tra SSL certificate
let sslOptions;
try {
    sslOptions = {
        key: fs.readFileSync(path.join(__dirname, 'ssl', 'private-key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'ssl', 'certificate.pem'))
    };
} catch (error) {
    console.log('⚠️  SSL certificate không tìm thấy. Chạy "npm run ssl" để tạo certificate.');
    console.log('🚀 Khởi động server HTTP thông thường...');
    
    // Khởi động HTTP server thông thường
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🔗 HTTP Server đang chạy tại:`);
        console.log(`   - http://localhost:${PORT}`);
        console.log(`   - http://192.168.1.37:${PORT}`);
        console.log(`📁 Cấu trúc thư mục gốc: ${process.cwd()}`);
    });
    return;
}

// Tạo HTTPS server
const httpsServer = https.createServer(sslOptions, app);

// Tạo HTTP server để redirect sang HTTPS
const httpApp = express();
httpApp.use((req, res) => {
    const host = req.headers.host;
    const newHost = host.replace(':23070', ':23071');
    res.redirect(`https://${newHost}${req.url}`);
});

const httpServer = http.createServer(httpApp);

// Khởi động cả HTTP và HTTPS server
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🔗 HTTP Server đang chạy tại:`);
    console.log(`   - http://localhost:${PORT}`);
    console.log(`   - http://192.168.1.37:${PORT}`);
    console.log(`   (Redirect sang HTTPS)`);
});

httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
    console.log(`🔒 HTTPS Server đang chạy tại:`);
    console.log(`   - https://localhost:${HTTPS_PORT}`);
    console.log(`   - https://192.168.1.37:${HTTPS_PORT}`);
    console.log(`📁 Cấu trúc thư mục gốc: ${process.cwd()}`);
    console.log(`⚠️  Lưu ý: Sử dụng self-signed certificate, trình duyệt có thể cảnh báo bảo mật`);
}); 