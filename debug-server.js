const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { config } = require('./config');

const app = express();

// Test SSL certificate
console.log('Testing SSL certificate...');
const certPath = config.ssl.certPath;
const keyPath = config.ssl.keyPath;

try {
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        console.log('✅ SSL certificate files exist');
        const cert = fs.readFileSync(certPath);
        const key = fs.readFileSync(keyPath);
        console.log('✅ SSL certificate files can be read');
        
        const httpsServer = https.createServer({ cert, key }, app);
        httpsServer.listen(443, '0.0.0.0', () => {
            console.log('✅ HTTPS Server started on port 443');
        });
    } else {
        console.log('❌ SSL certificate files not found');
        console.log('Cert path:', certPath, 'exists:', fs.existsSync(certPath));
        console.log('Key path:', keyPath, 'exists:', fs.existsSync(keyPath));
    }
} catch (error) {
    console.log('❌ Error reading SSL certificate:', error.message);
}
