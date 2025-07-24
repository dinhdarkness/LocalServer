@echo off
chcp 65001 >nul

echo ============================================================
echo 🚀 Local Server - Universal Runner (Windows)
echo ============================================================

REM Tìm Node.js
set NODE_CMD=

REM Kiểm tra Node.js trong PATH
where node >nul 2>&1
if %errorlevel% equ 0 (
    set NODE_CMD=node
    goto :found_node
)

REM Kiểm tra các đường dẫn phổ biến
if exist "C:\Program Files\nodejs\node.exe" (
    set NODE_CMD="C:\Program Files\nodejs\node.exe"
    goto :found_node
)

if exist "C:\Program Files (x86)\nodejs\node.exe" (
    set NODE_CMD="C:\Program Files (x86)\nodejs\node.exe"
    goto :found_node
)

if exist "%APPDATA%\npm\node.exe" (
    set NODE_CMD="%APPDATA%\npm\node.exe"
    goto :found_node
)

if exist "%USERPROFILE%\AppData\Roaming\npm\node.exe" (
    set NODE_CMD="%USERPROFILE%\AppData\Roaming\npm\node.exe"
    goto :found_node
)

REM Nếu không tìm thấy Node.js
echo ❌ Node.js không được tìm thấy!
echo.
echo 💡 Cách khắc phục:
echo 1. Cài đặt Node.js: https://nodejs.org/
echo 2. Thêm Node.js vào PATH
echo 3. Hoặc chỉ định đường dẫn Node.js thủ công
echo.
set /p manual_path="Nhập đường dẫn Node.js thủ công (hoặc Enter để thoát): "
if not "%manual_path%"=="" (
    if exist "%manual_path%" (
        set NODE_CMD="%manual_path%"
        goto :found_node
    ) else (
        echo ❌ Đường dẫn không hợp lệ!
        pause
        exit /b 1
    )
) else (
    pause
    exit /b 1
)

:found_node
echo ✅ Sử dụng Node.js: %NODE_CMD%
%NODE_CMD% --version
echo.

REM Kiểm tra dependencies
if not exist "node_modules" (
    echo 📦 Cài đặt dependencies...
    %NODE_CMD% npm install
    if %errorlevel% neq 0 (
        echo ❌ Không thể cài đặt dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies đã được cài đặt
    echo.
)

echo Chọn môi trường để chạy:
echo 1. 🏠 Development (localhost:23070)
echo 2. 🌐 Domain HTTP (ddarkness.io.vn - không port)
echo 3. 🔒 Domain HTTPS (ddarkness.io.vn - không port)
echo 4. 🖥️  VPS (14.225.211.126:23070)
echo 5. 🔒 VPS HTTPS (14.225.211.126:443)
echo 6. ⚙️  Tùy chỉnh
echo.
set /p choice="Nhập lựa chọn (1-6): "

if "%choice%"=="1" (
    echo.
    echo 🏠 Khởi động Development server...
    set NODE_ENV=development
    set PORT=23070
    %NODE_CMD% server.js
) else if "%choice%"=="2" (
    echo.
    echo 🌐 Khởi động Domain HTTP server...
    set NODE_ENV=production
    set PORT=80
    %NODE_CMD% server.js
) else if "%choice%"=="3" (
    echo.
    echo 🔒 Khởi động Domain HTTPS server...
    set NODE_ENV=production
    set PORT=443
    %NODE_CMD% server.js
) else if "%choice%"=="4" (
    echo.
    echo 🖥️ Khởi động VPS server...
    set NODE_ENV=production
    set PORT=23070
    %NODE_CMD% server.js
) else if "%choice%"=="5" (
    echo.
    echo 🔒 Khởi động VPS HTTPS server...
    set NODE_ENV=production
    set PORT=443
    %NODE_CMD% server.js
) else if "%choice%"=="6" (
    echo.
    set /p custom_port="Nhập port: "
    set /p custom_env="Nhập môi trường (development/production): "
    echo.
    echo ⚙️ Khởi động server với cấu hình tùy chỉnh...
    set NODE_ENV=%custom_env%
    set PORT=%custom_port%
    %NODE_CMD% server.js
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