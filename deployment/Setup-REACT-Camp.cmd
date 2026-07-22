@echo off
setlocal
title REACT Camp Classroom Setup
echo.
echo ============================================================
echo              REACT Camp Classroom Setup
echo ============================================================
echo.
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0Setup-REACT-Camp.ps1"
set "SETUP_EXIT=%ERRORLEVEL%"
echo.
if not "%SETUP_EXIT%"=="0" (
  echo Setup did not finish. Read the error above, then try again.
) else (
  echo This laptop is ready for REACT Camp.
)
echo.
pause
exit /b %SETUP_EXIT%

