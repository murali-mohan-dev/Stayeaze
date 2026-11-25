@echo off
cd /d "%~dp0"
title StayEase - Luxury Hotel Reservation System
echo ======================================================================
echo    STAYEASE - SMART HOTEL ROOM RESERVATION SYSTEM
echo ======================================================================
echo.

if not exist "server\dev.db" (
    echo Database not initialized. Running setup and seeding...
    call npm run setup
)

echo Starting Backend Server and Frontend Client...
echo Client: http://localhost:3000
echo Server: http://localhost:5000
echo.

start http://localhost:3000
npm run dev
pause
