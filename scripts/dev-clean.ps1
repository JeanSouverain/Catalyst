$ErrorActionPreference = 'SilentlyContinue'

# Kill processes listening on common Next.js dev ports.
$ports = @(3000, 3001, 3002)
foreach ($port in $ports) {
  $pids = @()
  $connections = Get-NetTCPConnection -LocalPort $port -State Listen
  if ($connections) {
    $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
  }

  if (-not $pids -or $pids.Count -eq 0) {
    $pids = netstat -ano |
      Select-String ":$port\s+.*LISTENING\s+(\d+)$" |
      ForEach-Object { ($_ -split '\s+')[-1] } |
      Sort-Object -Unique
  }

  foreach ($pid in $pids) {
    if ($pid -and $pid -ne '0') {
      taskkill /PID $pid /F | Out-Null
    }
  }
}

# Remove stale Next lock file if present.
$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$lockFile = Join-Path $projectRoot '.next\dev\lock'
if (Test-Path $lockFile) {
  Remove-Item $lockFile -Force
}

# Start Next.js dev server.
npm run dev:base
