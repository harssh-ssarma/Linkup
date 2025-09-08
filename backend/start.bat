@echo off
echo 🚀 Starting Linkup Backend Server...
echo.

cd /d "%~dp0"

REM Activate virtual environment
call .venv\Scripts\activate.bat

REM Start the server
python start_server.py

pause