@echo off
echo ============================================================
echo 🚀 Local Server - File Management System
echo ============================================================
echo.
echo Chọn môi trường để chạy:
echo 1. Development (localhost)
echo 2. Production (VPS/Domain)
echo 3. VPS với port 23070
echo 4. Domain với port 80 (không cần nhập port)
echo 5. Domain với port 443 (HTTPS)
echo 6. Tùy chỉnh port
echo.
set /p choice="Nhập lựa chọn (1-6): "

if "%choice%"=="1" (
    echo.
    echo 🏃‍♂️ Khởi động server ở chế độ Development...
    set NODE_ENV=development
    node server.js
) else if "%choice%"=="2" (
    echo.
    echo 🏃‍♂️ Khởi động server ở chế độ Production...
    set NODE_ENV=production
    node server.js
) else if "%choice%"=="3" (
    echo.
    echo 🏃‍♂️ Khởi động server trên VPS...
    set NODE_ENV=production
    set PORT=23070
    node server.js
) else if "%choice%"=="4" (
    echo.
    echo 🏃‍♂️ Khởi động server trên Domain (HTTP - không cần port)...
    set NODE_ENV=production
    set PORT=80
    node server.js
) else if "%choice%"=="5" (
    echo.
    echo 🏃‍♂️ Khởi động server trên Domain (HTTPS - không cần port)...
    set NODE_ENV=production
    set PORT=443
    node server.js
) else if "%choice%"=="6" (
    echo.
    set /p custom_port="Nhập port tùy chỉnh: "
    set /p custom_env="Nhập môi trường (development/production): "
    echo.
    echo 🏃‍♂️ Khởi động server với cấu hình tùy chỉnh...
    set NODE_ENV=%custom_env%
    set PORT=%custom_port%
    node server.js
) else (
    echo.
    echo ❌ Lựa chọn không hợp lệ!
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Server đã dừng.
pause 