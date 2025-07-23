const https = require('https');
const http = require('http');

console.log('🔍 Đang test SSL connection...\n');

// Test HTTPS
const testHTTPS = () => {
    console.log('📡 Testing HTTPS...');
    
    const options = {
        hostname: '192.168.1.37',
        port: 23071,
        path: '/',
        method: 'GET',
        rejectUnauthorized: false // Bỏ qua SSL verification cho test
    };

    const req = https.request(options, (res) => {
        console.log(`✅ HTTPS Status: ${res.statusCode}`);
        console.log(`📄 Content-Type: ${res.headers['content-type']}`);
        console.log(`📏 Content-Length: ${res.headers['content-length']}`);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            if (data.includes('Directory Tree Viewer')) {
                console.log('✅ HTML content loaded successfully');
            } else {
                console.log('⚠️ HTML content may be incomplete');
            }
        });
    });

    req.on('error', (e) => {
        console.error(`❌ HTTPS Error: ${e.message}`);
    });

    req.end();
};

// Test HTTP redirect
const testHTTP = () => {
    console.log('\n📡 Testing HTTP redirect...');
    
    const options = {
        hostname: '192.168.1.37',
        port: 23070,
        path: '/',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        console.log(`✅ HTTP Status: ${res.statusCode}`);
        if (res.statusCode === 301 || res.statusCode === 302) {
            console.log(`🔄 Redirect to: ${res.headers.location}`);
        }
    });

    req.on('error', (e) => {
        console.error(`❌ HTTP Error: ${e.message}`);
    });

    req.end();
};

// Test manifest file
const testManifest = () => {
    console.log('\n📡 Testing manifest file...');
    
    const options = {
        hostname: '192.168.1.37',
        port: 23071,
        path: '/hot-update/flutter-remote-data/ktf1975/version.manifest',
        method: 'GET',
        rejectUnauthorized: false
    };

    const req = https.request(options, (res) => {
        console.log(`✅ Manifest Status: ${res.statusCode}`);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const manifest = JSON.parse(data);
                console.log(`📋 Version: ${manifest.version}`);
                console.log(`🔗 Package URL: ${manifest.packageUrl}`);
                console.log('✅ Manifest file is valid JSON');
            } catch (e) {
                console.log('❌ Manifest file is not valid JSON');
            }
        });
    });

    req.on('error', (e) => {
        console.error(`❌ Manifest Error: ${e.message}`);
    });

    req.end();
};

// Run tests
testHTTPS();
setTimeout(testHTTP, 1000);
setTimeout(testManifest, 2000);

console.log('\n💡 Hướng dẫn bỏ qua cảnh báo bảo mật:');
console.log('🌐 Chrome/Edge: Click "Advanced" → "Proceed to 192.168.1.37 (unsafe)"');
console.log('🦊 Firefox: Click "Advanced" → "Accept the Risk and Continue"');
console.log('🍎 Safari: Click "Show Details" → "visit this website" → "Visit Website"'); 