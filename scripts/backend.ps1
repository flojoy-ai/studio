Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Bypass

$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path

$appData = $env:APPDATA
$flojoyDir = Join-Path $appData ".flojoy"
$venvName = "404fc545_flojoy"
$venvDir = Join-Path $flojoyDir "flojoy_root_venv"
$venvPath = Join-Path $flojoyDir "flojoy_root_venv" $venvName

Write-Host "flojoy dir: $flojoyDir"
if ( -not (Test-Path $flojoyDir)) 
{
  Write-Output "Creating $flojoyDir ..."
  New-Item -ItemType Directory $flojoyDir | Out-Null
}
Set-Location $flojoyDir
Write-Output "Location set to $flojoyDir"
if (-not (Test-Path $venvDir))
{
  Write-Output "$venvDir doesn't exist.."
  New-Item -ItemType Directory -Force $venvDir
  Write-Output "Created virtual env directory: $venvDir"
}
Set-Location $venvDir
if (-not (Test-Path $venvPath))
{
  Write-Output "Virtual env not found, creating a virtual env at $venvDir"
  & python.exe -m venv $venvName
  Write-Output "Virtual env created: $venvName"
}
& .\$venvName\Scripts\Activate.ps1
Write-Output "Virtual env $venvName is found and activated!"

Set-Location $currentDir
Write-Output "Installing pip dependencies..."
& pip install -r requirements.txt

Write-Output "Package installation completed, starting backend..."
& python .\manage.py