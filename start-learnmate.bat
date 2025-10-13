@echo off
echo Starting LearnMate Application...
echo.

echo [1/3] Starting Backend Server...
start "LearnMate Backend" cmd /k "cd learnmate-backend && npm run dev"

echo [2/3] Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo [3/3] Starting Frontend...
start "LearnMate Frontend" cmd /k "cd learnmate-frontend && npm run dev"

echo.
echo LearnMate is starting up!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Make sure MongoDB is running before using the application.
echo.
pause
