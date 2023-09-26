Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Bypass

$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path

$appData = $env:APPDATA
$flojoyDir = Join-Path $appData ".flojoy"
$mambaDir = Join-Path $flojoyDir "mamba"
$pythonExecutable = Join-Path $mambaDir "python.exe"
$mambaInstaller = Join-Path $currentDir "mamba/mamba.exe"
$venvName = "404fc545_flojoy"
$venvDir = Join-Path $flojoyDir "flojoy_root_venv"
$venvPath = Join-Path $flojoyDir "flojoy_root_venv" $venvName


Write-Host "flojoy dir: $flojoyDir"
if ( -not (Test-Path $flojoyDir)) {
  Write-Output "Flojoy directory doesn't exist, Creating $flojoyDir ..."
  New-Item -ItemType Directory $flojoyDir | Out-Null
}
Set-Location $flojoyDir
Write-Output "Location set to $flojoyDir"

if (-not (Test-Path $pythonExecutable -PathType Leaf)) {
  if (Test-Path $mambaDir) {
    Remove-Item -Path $mambaDir -Force | Out-Null
  }
  Write-Host "Installing mamba to local directory..."
  # Start the installation
  Start-Process -FilePath $mambaInstaller -ArgumentList "/InstallationType=JustMe", "/RegisterPython=0", "/S", "/D=$mambaDir" -Wait
  # Check if the installation was successful
  if (Test-Path $mambaDir) {
    Write-Host "Mamba has been successfully installed in $mambaDir."
  }
  else {
    Write-Host "Mamba installation failed."
    exit 1
  }
}

if (-not (Test-Path $venvDir)) {
  Write-Output "$venvDir doesn't exist.."
  New-Item -ItemType Directory -Force $venvDir | Out-Null
  Write-Output "Created virtual env directory: $venvDir"
}
Set-Location $venvDir
if (-not (Test-Path $venvPath)) {
  Write-Output "Virtual env not found, creating a virtual env at $venvDir"
  Invoke-Expression "$pythonExecutable -m venv $venvName"
  Write-Output "Virtual env created: $venvName"
}
& .\$venvName\Scripts\Activate.ps1
Write-Output "Virtual env $venvName is activated!"

Set-Location $currentDir
Write-Output "Installing pip dependencies..."
& python -m pip install -r .\requirements.txt

Write-Output "Package installation completed, starting backend..."
$Env:ELECTRON_MODE = "packaged"
& python .\manage.py
