@echo off
echo 🚀 Adding real-time data to AI-CRM Database...
echo.

cd /d "%~dp0server"
node addRealtimeData.js

echo.
echo ✅ Data added successfully!
echo 📊 Refresh your dashboard at http://localhost:3003
echo.
pause