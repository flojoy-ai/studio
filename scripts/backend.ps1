Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Bypass

function feedback {
  param (
    $is_successful,
    $message,
    $help_message
  )
  if ($is_successful -eq $true) {
    Write-Host "$message"
  }
  else {
    Write-Host "$help_message"
    exit 1 
  }
}

$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path

$appData = $env:APPDATA
$flojoyDir = Join-Path $appData ".flojoy"
$mambaDir = Join-Path $flojoyDir "mamba"
$mambaHookScript = Join-Path $mambaDir "condabin" "mamba_hook.ps1"
$mambaExecutable = Join-Path $currentDir "bin/micromamba.exe"
$venvName = "flojoy_root"
$venvDir = Join-Path $mambaDir "envs" $venvName
$venvExecutable = Join-Path $venvDir "python.exe"
$isMamabaInstalled = Get-Command micromamba -ErrorAction SilentlyContinue

Write-Host "flojoy dir: $flojoyDir"
if ( -not (Test-Path $flojoyDir)) {
  Write-Output "Flojoy directory doesn't exist, Creating $flojoyDir ..."
  New-Item -ItemType Directory $flojoyDir | Out-Null
}
Set-Location $flojoyDir
Write-Output "Location set to $flojoyDir"

if (-not (Test-Path $venvExecutable -PathType Leaf)) {
  if (Test-Path $venvDir) {
    Remove-Item -Path $venvDir -Force | Out-Null
  }
  if ($isMamabaInstalled) {
    Write-Host "Existing Micromamba executable found..."
    Write-Host "Creating $venvName env..."
    & micromamba create -n $venvName conda-forge::python=3.10 -r "$mambaDir" -y
    feedback $? "Micromamba env $venvName created successfully." "Micromamba env creation failed."
  }
  else {
    Write-Host "Micromamba is not found..."
    Write-Host "Creating $venvName env..."
    Invoke-Expression "$mambaExecutable create -n $venvName conda-forge::python=3.10 -r $mambaDir -y"
    feedback $? "Micromamba env $venvName created successfully." "Micromamba env creation failed."
  }
}
if (!($isMamabaInstalled)) {
  Invoke-Expression "$mambaExecutable shell init -s powershell -p $mambaDir" | Out-Null
  $Env:MAMBA_ROOT_PREFIX = $mambaDir
  $Env:MAMBA_EXE = $mambaExecutable
  Invoke-Expression "$mambaHookScript"
}
else {
  $Env:MAMBA_ROOT_PREFIX = $mambaDir
}
& micromamba activate $venvName

feedback $? "Env $venvName is activated!" "Failed to activate $venvName env!"

Set-Location $currentDir
Write-Output "Installing pip dependencies..."
& python -m pip install -r .\requirements.txt

Write-Output "Package installation completed, starting backend..."
$Env:ELECTRON_MODE = "packaged"
& python .\manage.py
