@echo off
setlocal

echo =====================================================
echo   ModaVitrin - E-Ticaret Platformu
echo =====================================================
echo.

cd /d "%~dp0"

REM Node kurulu mu kontrol et
where node >nul 2>nul
if errorlevel 1 (
    echo [HATA] Node.js bulunamadi!
    echo Lutfen https://nodejs.org adresinden Node.js yukleyin.
    pause
    exit /b 1
)

REM node_modules yoksa kur
if not exist "node_modules\" (
    echo [1/3] Bagimliliklar kuruluyor... ilk calistirmada birkac dakika surebilir
    call npm install
    if errorlevel 1 (
        echo [HATA] npm install basarisiz oldu.
        pause
        exit /b 1
    )
) else (
    echo [1/3] Bagimliliklar zaten kurulu.
)

REM Veritabani yoksa olustur ve seed et
if not exist "prisma\dev.db" (
    echo [2/3] Veritabani olusturuluyor...
    call npx prisma migrate deploy
    if errorlevel 1 (
        echo [HATA] Migration basarisiz oldu.
        pause
        exit /b 1
    )
    echo Demo veriler yukleniyor...
    call npm run seed
) else (
    echo [2/3] Veritabani hazir.
)

echo [3/3] Site baslatiliyor...
echo.
echo =====================================================
echo   Site adresi:   http://localhost:3000
echo   Admin paneli:  http://localhost:3000/admin
echo.
echo   Demo hesaplar:
echo     Admin    -  admin@modavitrin.com     / admin123
echo     Musteri  -  musteri@example.com      / musteri123
echo =====================================================
echo.
echo Siteyi durdurmak icin bu pencereyi kapatin veya Ctrl+C'ye basin.
echo.

REM Tarayiciyi 5 saniye sonra ac
start "" /b cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:3000"

call npm run dev

endlocal
