const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const os = require('os');
const https = require('https');
const http = require('http');
const { config, env, isDevelopment } = require('./config');

const app = express();
const PORT = config.port;

// Lấy local IP
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    return 'localhost';
}

const LOCAL_IP = getLocalIP();

// Cấu hình SSL cho HTTPS
function getSSLConfig() {
    if (!config.ssl || !config.ssl.enabled) {
        return null;
    }
    
    const certPath = config.ssl.certPath;
    const keyPath = config.ssl.keyPath;
    
    try {
        if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
            console.log('🔒 SSL certificate đã được tìm thấy');
            return {
                cert: fs.readFileSync(certPath),
                key: fs.readFileSync(keyPath)
            };
        } else {
            console.log('⚠️  SSL certificate không tìm thấy tại:', certPath);
        }
    } catch (error) {
        console.log('⚠️  Không thể đọc SSL certificate:', error.message);
    }
    
    return null;
}

// Middleware để parse JSON
app.use(express.json());

// CORS middleware cho phép truy cập từ các domain khác nhau
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const host = req.headers.host;
    
    // Cho phép tất cả origin trong development
    if (isDevelopment) {
        res.header('Access-Control-Allow-Origin', '*');
    } else {
        // Trong production, chỉ cho phép các host được cấu hình
        if (config.allowedHosts.some(allowedHost => host.includes(allowedHost))) {
            res.header('Access-Control-Allow-Origin', origin || '*');
        }
    }
    
    res.header('Access-Control-Allow-Methods', config.cors.methods.join(', '));
    res.header('Access-Control-Allow-Headers', config.cors.headers.join(', '));
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

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
        fileSize: config.upload.maxFileSize
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
        const hot_update_path = path.join(rootPath, config.upload.uploadDir);
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
        
        const uploadPath = path.join(process.cwd(), config.upload.uploadDir, req.body.uploadPath || '');
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

// Khởi động server
function startServer() {
    const sslConfig = getSSLConfig();
    
    if (PORT == 443 && sslConfig) {
        // Khởi động HTTPS server
        const httpsServer = https.createServer(sslConfig, app);
        httpsServer.listen(PORT, '0.0.0.0', () => {
            console.log('='.repeat(60));
            console.log('🚀 HTTPS Server đã khởi động thành công!');
            console.log('='.repeat(60));
            console.log(`📍 Môi trường: ${env}`);
            console.log(`🔧 Port: ${PORT}`);
            console.log(`🔒 SSL: Đã bật`);
            console.log(`📁 Thư mục gốc: ${process.cwd()}`);
            console.log('');
            console.log('🌐 Các URL có thể truy cập:');
            console.log(`   • Localhost: https://localhost:${PORT}`);
            console.log(`   • Local IP: https://${LOCAL_IP}:${PORT}`);
            console.log(`   • VPS IP: https://14.225.211.126:${PORT}`);
            console.log(`   • Domain: https://ddarkness.duckdns.org`);
            console.log('');
            console.log('✅ HTTPS Server sẵn sàng nhận kết nối!');
            console.log('='.repeat(60));
        });
    } else {
        // Khởi động HTTP server
        const httpServer = http.createServer(app);
        httpServer.listen(PORT, '0.0.0.0', () => {
            console.log('='.repeat(60));
            console.log('🚀 HTTP Server đã khởi động thành công!');
            console.log('='.repeat(60));
            console.log(`📍 Môi trường: ${env}`);
            console.log(`🔧 Port: ${PORT}`);
            console.log(`🔒 SSL: ${sslConfig ? 'Có sẵn (chạy HTTP)' : 'Không có'}`);
            console.log(`📁 Thư mục gốc: ${process.cwd()}`);
            console.log('');
            console.log('🌐 Các URL có thể truy cập:');
            console.log(`   • Localhost: http://localhost:${PORT}`);
            console.log(`   • Local IP: http://${LOCAL_IP}:${PORT}`);
            console.log(`   • VPS IP: http://14.225.211.126:${config.vpsPort || PORT}`);
            
            // Hiển thị domain URL tùy theo port
            if (PORT == 80) {
                console.log(`   • Domain: http://ddarkness.duckdns.org`);
            } else if (PORT == 443 && !sslConfig) {
                console.log(`   • Domain: http://ddarkness.duckdns.org:${PORT} (SSL không khả dụng)`);
            } else {
                console.log(`   • Domain: http://ddarkness.duckdns.org:${PORT}`);
            }
            console.log('');
            console.log('✅ HTTP Server sẵn sàng nhận kết nối!');
            console.log('='.repeat(60));
        });
    }
}

// Khởi động server
startServer(); 