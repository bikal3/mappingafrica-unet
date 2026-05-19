# Start the demo: FastAPI backend + open browser
# Run from the assignment3/ directory:
#   cd assignment3; .\demo\start.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$apiDir = Join-Path $scriptDir "api"
$frontendDir = Join-Path $scriptDir "frontend"

Write-Host "`n=== Satellite Segmentation Demo ===" -ForegroundColor Cyan

# Start backend
Write-Host "`nStarting FastAPI backend on http://localhost:8000 ..." -ForegroundColor Green
$backend = Start-Process -FilePath "conda" -ArgumentList "run -n torch-env uvicorn main:app --reload --host 0.0.0.0 --port 8000" -WorkingDirectory $apiDir -PassThru -NoNewWindow

Start-Sleep -Seconds 3

# Start Vite dev server
Write-Host "Starting Vite dev server on http://localhost:5173 ..." -ForegroundColor Green
$frontend = Start-Process -FilePath "conda" -ArgumentList "run npm run dev" -WorkingDirectory $frontendDir -PassThru -NoNewWindow

Start-Sleep -Seconds 2

Write-Host "`n  Backend : http://localhost:8000" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop both servers.`n" -ForegroundColor Yellow

try {
    Wait-Process -Id $frontend.Id
} finally {
    Stop-Process -Id $backend.Id -ErrorAction SilentlyContinue
    Stop-Process -Id $frontend.Id -ErrorAction SilentlyContinue
}
