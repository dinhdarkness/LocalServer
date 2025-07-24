// Cấu hình cho các môi trường khác nhau
const config = {
    development: {
        port: 23070,
        allowedHosts: [
            'localhost',
            '127.0.0.1',
            '14.225.211.126',
            'ddarkness.duckdns.org'
        ],
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            headers: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
        },
        upload: {
            maxFileSize: 50 * 1024 * 1024, // 50MB
            uploadDir: 'hot-update'
        }
    },
    production: {
        port: process.env.PORT || 23070,
        allowedHosts: [
            'localhost',
            '127.0.0.1',
            '14.225.211.126',
            'ddarkness.duckdns.org'
        ],
        cors: {
            origin: function(origin, callback) {
                // Cho phép requests không có origin (mobile apps, etc.)
                if (!origin) return callback(null, true);
                
                const allowedHosts = config.production.allowedHosts;
                const isAllowed = allowedHosts.some(host => 
                    origin.includes(host) || origin.includes('localhost')
                );
                
                if (isAllowed) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            headers: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
        },
        upload: {
            maxFileSize: 50 * 1024 * 1024, // 50MB
            uploadDir: 'hot-update'
        }
    }
};

// Lấy cấu hình theo môi trường
const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env];

module.exports = {
    config: currentConfig,
    env,
    isDevelopment: env === 'development',
    isProduction: env === 'production'
}; 