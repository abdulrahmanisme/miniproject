# Quick Start Script for Windows PowerShell

Write-Host "🚀 Starting Smart Attendance System..." -ForegroundColor Cyan
Write-Host ""

# Start Backend
Write-Host "📦 Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; Write-Host '🔧 Backend Server' -ForegroundColor Green; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '🎨 Frontend Server' -ForegroundColor Blue; npm run dev"

Write-Host ""
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "📍 Backend: http://localhost:4000" -ForegroundColor Cyan
Write-Host ""
Write-Host "👤 Demo Credentials:" -ForegroundColor Yellow
Write-Host "   Student: student@test.com / password123"
Write-Host "   Teacher: teacher@test.com / password123"
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
