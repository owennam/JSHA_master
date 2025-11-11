@echo off
echo ====================================
echo JSHA 결제 시스템 시작
echo ====================================
echo.

echo [1/2] 백엔드 서버 시작 중...
start "JSHA Payment Server" cmd /k "cd server && npm install && npm start"

timeout /t 3 /nobreak > nul

echo [2/2] 프론트엔드 클라이언트 시작 중...
start "JSHA Client" cmd /k "npm run dev"

echo.
echo ====================================
echo 모든 서비스가 시작되었습니다!
echo 백엔드: http://localhost:3001
echo 프론트엔드: http://localhost:5173
echo ====================================
echo.
pause
