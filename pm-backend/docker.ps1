#!/usr/bin/env pwsh
# Patient Management System - Docker Management Script

param(
    [Parameter(Position=0)]
    [ValidateSet('start', 'stop', 'restart', 'logs', 'build', 'clean', 'status', 'help')]
    [string]$Action = 'help',
    
    [Parameter(Position=1)]
    [string]$Service = ''
)

$ErrorActionPreference = "Stop"

function Show-Help {
    Write-Host @"
🐳 Patient Management System - Docker Manager

Usage: .\docker.ps1 [action] [service]

Actions:
  start      Start all services (detached)
  stop       Stop all services
  restart    Restart services
  logs       View logs (use Ctrl+C to exit)
  build      Rebuild services
  clean      Stop and remove all containers, volumes, and images
  status     Show status of all services
  help       Show this help message

Services (optional):
  auth-service
  patient-service
  billing-service
  analytics-service
  api-gateway
  postgres
  kafka
  zookeeper

Examples:
  .\docker.ps1 start              # Start all services
  .\docker.ps1 logs patient-service   # View patient service logs
  .\docker.ps1 build patient-service  # Rebuild patient service
  .\docker.ps1 restart api-gateway    # Restart API Gateway
  .\docker.ps1 clean              # Clean everything (nuclear option)

"@
}

function Start-Services {
    Write-Host "[+] Starting services..." -ForegroundColor Green
    if ($Service) {
        docker-compose up -d $Service
    } else {
        docker-compose up -d
    }
    Write-Host "[OK] Services started!" -ForegroundColor Green
    Write-Host "Run '.\docker.ps1 status' to check health" -ForegroundColor Cyan
}

function Stop-Services {
    Write-Host "[-] Stopping services..." -ForegroundColor Yellow
    if ($Service) {
        docker-compose stop $Service
    } else {
        docker-compose down
    }
    Write-Host "[OK] Services stopped!" -ForegroundColor Green
}

function Restart-Services {
    Write-Host "[*] Restarting services..." -ForegroundColor Yellow
    if ($Service) {
        docker-compose restart $Service
    } else {
        docker-compose restart
    }
    Write-Host "[OK] Services restarted!" -ForegroundColor Green
}

function Show-Logs {
    Write-Host "[i] Showing logs (Ctrl+C to exit)..." -ForegroundColor Cyan
    if ($Service) {
        docker-compose logs -f $Service
    } else {
        docker-compose logs -f
    }
}

function Build-Services {
    Write-Host "[>] Building services..." -ForegroundColor Yellow
    if ($Service) {
        docker-compose build --no-cache $Service
        docker-compose up -d $Service
    } else {
        docker-compose build --no-cache
        docker-compose up -d
    }
    Write-Host "[OK] Build complete!" -ForegroundColor Green
}

function Clean-All {
    Write-Host "[WARNING] This will remove all containers, volumes, and images!" -ForegroundColor Red
    $confirm = Read-Host "Are you sure? (yes/no)"
    
    if ($confirm -eq 'yes') {
        Write-Host "[CLEAN] Cleaning everything..." -ForegroundColor Yellow
        docker-compose down -v --rmi all
        Write-Host "[OK] Cleanup complete!" -ForegroundColor Green
    } else {
        Write-Host "[X] Cleanup cancelled" -ForegroundColor Yellow
    }
}

function Show-Status {
    Write-Host "[=] Service Status:" -ForegroundColor Cyan
    Write-Host ""
    docker-compose ps
    Write-Host ""
    Write-Host "[D] Volumes:" -ForegroundColor Cyan
    docker volume ls | Select-String "pm-backend"
    Write-Host ""
    Write-Host "[N] Networks:" -ForegroundColor Cyan
    docker network ls | Select-String "pm"
}

# Main execution
switch ($Action) {
    'start'   { Start-Services }
    'stop'    { Stop-Services }
    'restart' { Restart-Services }
    'logs'    { Show-Logs }
    'build'   { Build-Services }
    'clean'   { Clean-All }
    'status'  { Show-Status }
    'help'    { Show-Help }
    default   { Show-Help }
}
