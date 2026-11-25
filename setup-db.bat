@echo off
cd /d "%~dp0"
title StayEase - Database Reset ^& Seed
echo ======================================================================
echo    STAYEASE - RESET ^& SEED SQLITE DATABASE VIA PRISMA
echo ======================================================================
echo.
cd server
call npm run prisma:push
call npm run prisma:seed
cd ..
echo.
echo Database synchronized and seeded successfully!
pause
