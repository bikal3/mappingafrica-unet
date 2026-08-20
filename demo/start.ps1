# Start the demo: FastAPI backend + Vite dev server
# Run from anywhere:
#   .\demo\start.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$apiDir = Join-Path $scriptDir "api"
$frontendDir = Join-Path $scriptDir "frontend"
$envName = if ($env:CONDA_ENV) { $env:CONDA_ENV } else { "torch-env" }

if (-not (Get-Command conda -ErrorAction SilentlyContinue)) {
    Write-Error "conda not found on PATH. See the Prerequisites section of README.md."
    exit 1
}

function Stop-Tree($proc) {
    if ($null -ne $proc -and -not $proc.HasExited) {
        # /T takes the whole tree. `conda run` only wraps the real server, so
        # stopping the wrapper alone leaves uvicorn holding port 8000.
        taskkill /PID $proc.Id /T /F 2>$null | Out-Null
    }
}

Write-Host "`n=== Satellite Segmentation Demo ===" -ForegroundColor Cyan

Write-Host "`nStarting FastAPI backend on http://localhost:8000 ..." -ForegroundColor Green
$backend = Start-Process -FilePath "conda" `
    -ArgumentList "run -n $envName --no-capture-output uvicorn main:app --reload --host 0.0.0.0 --port 8000" `
    -WorkingDirectory $apiDir -PassThru -NoNewWindow

Start-Sleep -Seconds 3

Write-Host "Starting Vite dev server on http://localhost:5173 ..." -ForegroundColor Green
$frontend = Start-Process -FilePath "conda" `
    -ArgumentList "run -n $envName --no-capture-output npm run dev" `
    -WorkingDirectory $frontendDir -PassThru -NoNewWindow

Start-Sleep -Seconds 2

Write-Host "`n  Backend : http://localhost:8000" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop both servers.`n" -ForegroundColor Yellow

try {
    Wait-Process -Id $frontend.Id
} finally {
    Stop-Tree $backend
    Stop-Tree $frontend
}
