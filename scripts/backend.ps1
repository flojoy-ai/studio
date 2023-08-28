Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Bypass

$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Creating a venv..."
$appData = $env:APPDATA
$flojoyDir = Join-Path $appData ".flojoy"
$venvName = "404fc545_flojoy"
$venvDir = Join-Path $flojoyDir "flojoy_root_venv"
$venvPath = Join-Path $flojoyDir "flojoy_root_venv" $venvName


# Write-Host "flojoy dir: $flojoyDir venv: $venvPath"
if ( -not (Test-Path $flojoyDir)) 
{
  New-Item -ItemType Directory $flojoyDir | Out-Null
}
Set-Location $flojoyDir
if (-not (Test-Path $venvDir))
{
  New-Item -ItemType Directory -Force $venvDir
}
Set-Location $venvDir
if (-not (Test-Path $venvPath))
{
  & python.exe -m venv $venvName
}
& .\$venvName\Scripts\Activate.ps1
Write-Host "Venv is activated!"

Set-Location $currentDir
& pip install -r requirements.txt

python .\manage.py