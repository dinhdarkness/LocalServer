const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔐 Đang tạo SSL certificate...');

// Tạo thư mục ssl nếu chưa có
const sslDir = path.join(__dirname, 'ssl');
if (!fs.existsSync(sslDir)) {
    fs.mkdirSync(sslDir);
    console.log('✅ Đã tạo thư mục ssl/');
}

// Tạo file config cho OpenSSL
const opensslConfig = `
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = VN
ST = HoChiMinh
L = HoChiMinh
O = LocalServer
OU = IT
CN = localhost

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = 127.0.0.1
IP.1 = 127.0.0.1
IP.2 = 192.168.1.37
IP.3 = 0.0.0.0
`;

const configPath = path.join(sslDir, 'openssl.conf');
fs.writeFileSync(configPath, opensslConfig);
console.log('✅ Đã tạo OpenSSL config');

// Tạo private key
console.log('📝 Đang tạo private key...');
try {
    execSync(`openssl genrsa -out ${path.join(sslDir, 'private-key.pem')} 2048`, { stdio: 'inherit' });
    console.log('✅ Đã tạo private key');
} catch (error) {
    console.error('❌ Lỗi khi tạo private key:', error.message);
    process.exit(1);
}

// Tạo certificate signing request (CSR)
console.log('📋 Đang tạo CSR...');
try {
    execSync(`openssl req -new -key ${path.join(sslDir, 'private-key.pem')} -out ${path.join(sslDir, 'certificate.csr')} -config ${configPath}`, { stdio: 'inherit' });
    console.log('✅ Đã tạo CSR');
} catch (error) {
    console.error('❌ Lỗi khi tạo CSR:', error.message);
    process.exit(1);
}

// Tạo self-signed certificate với SAN
console.log('🔒 Đang tạo self-signed certificate...');
try {
    execSync(`openssl x509 -req -in ${path.join(sslDir, 'certificate.csr')} -signkey ${path.join(sslDir, 'private-key.pem')} -out ${path.join(sslDir, 'certificate.pem')} -days 365 -extensions v3_req -extfile ${configPath}`, { stdio: 'inherit' });
    console.log('✅ Đã tạo self-signed certificate');
} catch (error) {
    console.error('❌ Lỗi khi tạo certificate:', error.message);
    process.exit(1);
}

// Xóa file CSR và config không cần thiết
try {
    fs.unlinkSync(path.join(sslDir, 'certificate.csr'));
    fs.unlinkSync(configPath);
    console.log('✅ Đã xóa file tạm');
} catch (error) {
    console.log('⚠️ Không thể xóa file tạm');
}

console.log('\n🎉 SSL certificate đã được tạo thành công!');
console.log('📁 Files được tạo trong thư mục ssl/:');
console.log('   - private-key.pem (Private key)');
console.log('   - certificate.pem (Certificate)');
console.log('\n🌐 Certificate hỗ trợ các domain/IP:');
console.log('   - localhost');
console.log('   - 127.0.0.1');
console.log('   - 192.168.1.37');
console.log('   - 0.0.0.0');
console.log('\n🚀 Bây giờ bạn có thể chạy server với SSL:');
console.log('   npm start');
console.log('\n⚠️ Lưu ý: Đây là self-signed certificate, trình duyệt sẽ cảnh báo bảo mật.');
console.log('   Bạn có thể bỏ qua cảnh báo này trong môi trường development.'); 