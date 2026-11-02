@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Can cai Node.js 18+ & pause & exit /b 1)
where py >nul 2>nul || (echo Can cai Python 3.10+ & pause & exit /b 1)
if not exist .venv (py -m venv .venv)
.venv\Scripts\python.exe -m pip install -r requirements.txt || (pause & exit /b 1)
if not defined EVENT_TOKEN set EVENT_TOKEN=phatphap-local-only-CHANGE-THIS-TOKEN-9328
start "Phat Phap LIVE Server" cmd /k "set EVENT_TOKEN=%EVENT_TOKEN%&& node server.js"
timeout /t 3 /nobreak >nul
start "Phat Phap LIVE Control" http://127.0.0.1:3000
.venv\Scripts\python.exe tiktok_bridge.py
pause
