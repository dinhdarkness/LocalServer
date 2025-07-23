@echo off
chcp 65001 >nul
title Directory Tree Viewer

echo ================================
echo   Directory Tree Viewer
echo ================================
echo.

:: Kiểm tra Node.js
echo [INFO] Kiểm tra Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js không được cài đặt. Vui lòng cài đặt Node.js trước.
    pause
    exit /b 1
)

:: Kiểm tra npm
echo [INFO] Kiểm tra npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm không được cài đặt. Vui lòng cài đặt npm trước.
    pause
    exit /b 1
)

:: Cài đặt dependencies nếu cần
if not exist "node_modules" (
    echo [INFO] Cài đặt dependencies...
    npm install
    if errorlevel 1 (
        echo [ERROR] Không thể cài đặt dependencies
        pause
        exit /b 1
    )
    echo [INFO] Dependencies đã được cài đặt thành công
) else (
    echo [INFO] Dependencies đã tồn tại
)

:: Khởi chạy server
echo [INFO] Khởi chạy server...
start /B npm start

:: Đợi server khởi động
timeout /t 3 /nobreak >nul

:: Mở trình duyệt
echo [INFO] Mở trình duyệt...
start http://localhost:23070

echo [INFO] Ứng dụng đã sẵn sàng!
echo [INFO] Nhấn Ctrl+C để dừng server
echo.

:: Giữ cửa sổ mở
pause 