Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Bypass

$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path

$appData = $env:APPDATA
$flojoyDir = Join-Path $appData ".flojoy"
$venvName = "404fc545_flojoy"
$venvDir = Join-Path $flojoyDir "flojoy_root_venv"
$venvPath = Join-Path $flojoyDir "flojoy_root_venv" $venvName


$py_missing = "Python version ^3.10 was not found on your system. Please install it or make global python version to ^3.10. You can download the sepcific version from the official website: https://www.python.org/downloads/"
$pip_missing = "Pip was not found. Pip version 20.0 or higher is required for this project. You can find guidelines on this here: https://packaging.python.org/en/latest/tutorials/installing-packages/#ensure-you-can-run-pip-from-the-command-line"
$npm_missing = "Node.js/npm was not found. Please make sure you have installed Node.js version 16.0 or higher along with npm correctly. You can download Nodejs from here: https://nodejs.org/en/download"

if (Get-Command python -ErrorAction SilentlyContinue) {
  if (!(python -c "import sys; exit(0) if sys.version_info >= (3,10) and sys.version_info < (3,11) else exit(1)" 2>&1).Count -eq 0) {
    Write-Output "$py_missing"
    exit 1
  }
}
else {
  Write-Output "$py_missing"
  exit 1
}

if (!(python -m pip --version 2-ge$null)) {
  Write-Output "$pip_missing"
  exit 1
}

$MINIMUM_PIP_VERSION = "20.0"
$PIP_VERSION = (python -m pip --version | Select-String -Pattern '\d+(\.\d+)+').Matches.Value

if (!([version]$PIP_VERSION -ge [version]$MINIMUM_PIP_VERSION)) {
  Write-Output "An older version of pip was found. Pip version 20.0 or higher is required for this project. To upgrade run following command: 'pip install --upgrade pip' or 'python3 -m pip install --upgrade pip'"
  exit 1
}

if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Output "$npm_missing"
  exit 1
}



Write-Host "flojoy dir: $flojoyDir"
if ( -not (Test-Path $flojoyDir)) {
  Write-Output "Flojoy directory doesn't exist, Creating $flojoyDir ..."
  New-Item -ItemType Directory $flojoyDir | Out-Null
}
Set-Location $flojoyDir
Write-Output "Location set to $flojoyDir"
if (-not (Test-Path $venvDir)) {
  Write-Output "$venvDir doesn't exist.."
  New-Item -ItemType Directory -Force $venvDir
  Write-Output "Created virtual env directory: $venvDir"
}
Set-Location $venvDir
if (-not (Test-Path $venvPath)) {
  Write-Output "Virtual env not found, creating a virtual env at $venvDir"
  & python.exe -m venv $venvName
  Write-Output "Virtual env created: $venvName"
}
& .\$venvName\Scripts\Activate.ps1
Write-Output "Virtual env $venvName is activated!"

Set-Location $currentDir
Write-Output "Installing pip dependencies..."
& pip install -r requirements.txt

Write-Output "Package installation completed, starting backend..."
$Env:ELECTRON_MODE = "packaged"
& python .\manage.py