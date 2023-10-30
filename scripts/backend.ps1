Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Bypass

function info_msg {
  param (
    $message
  )
  Write-Host ":info: $message"
}

function feedback {
  param (
    $is_successful,
    $message,
    $help_message
  )
  if ($is_successful -eq $true) {
    info_msg "$message"
  }
  else {
    Write-Host "$help_message"
    exit 1 
  }
}

function enableLibmamba {
  param (
    $conda_exec
  )
  # Get solver from config
  $solver = @(Invoke-Expression "$conda_exec config --show solver")
  
  # Check if "libmamba" is there as solver
  if ($solver -like "*libmamba*") {
    info_msg "Libmamba is already set as solver for conda."
  }
  else {
    info_msg "Updating Conda and configuring libmamba as the solver."
    Invoke-Expression "$conda_exec update -n base conda -y "| Out-Null
    Invoke-Expression "$conda_exec install -n base conda-libmamba-solver -y" | Out-Null
    Invoke-Expression "$conda_exec config --set solver libmamba" | Out-Null
    feedback $? "Libmamba is set as solver for conda..." "Failed to set libmamba as solver for conda!"
  }
}

$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path

$flojoyEnv = "flojoy-studio"
$envYml = Join-Path $currentDir "environment.yml"
$condaScript = Join-Path $currentDir "conda_install.ps1"

info_msg "Looking for conda installation..."
# Check if conda is found on PATH
if (!(Get-Command conda -ErrorAction SilentlyContinue)) {
  # Look for conda installation in default installation path
  $condaDefaultExec = Join-Path $env:USERPROFILE "miniconda3" "Scripts" "conda.exe"
  if (-not (Test-Path $condaDefaultExec)) {
    info_msg "Conda installation was not found..."
    #  install conda
    Invoke-Expression "$condaScript"
    $condaExec = "$condaDefaultExec"

  }
  else {
    info_msg "Conda installation is found!"
    $condaExec = "$condaDefaultExec"
  }
}
else {
  info_msg "Conda installation is found!"
  $condaExec = "conda"
}
# Get envs and expressions to activate conda on current PowerShell
$_conda_expressions = @(Invoke-Expression "$condaExec shell.powershell hook")

# Iterate through the list of strings and execute each as a command
foreach ($_expression in $_conda_expressions) {
  if ($_expression) {
    Invoke-Expression $_expression
  }
}

enableLibmamba $condaExec

$env_list = @(conda env list)
$isEnvExists = $env_list | Select-String -Pattern "$flojoyEnv "
if ($isEnvExists) {
  info_msg "$flojoyEnv env found!"
  $updated = Test-Path -PathType Leaf (Join-Path $currentDir ".updated_env")
  if ($updated -eq $false) {
    info_msg "Updating $flojoyEnv env..."
    conda env update --file "$envYml" --name $flojoyEnv | Out-Null
    New-Item -ItemType File (Join-Path $currentDir ".updated_env") -ErrorAction SilentlyContinue | Out-Null
  }
}
else {
  # Environment doesn't exist, create it
  info_msg "$flojoyEnv env not found, creating env with conda..."
  conda env create --file "$envYml" --name $flojoyEnv | Out-Null
  New-Item -ItemType File (Join-Path $currentDir ".updated_env") -ErrorAction SilentlyContinue  | Out-Null
}
conda activate $flojoyEnv
feedback $? "Env $flojoyEnv is activated!" "Failed to activate $flojoyEnv env, try relunching app!"

Set-Location $currentDir
$installedDeps = Test-Path -PathType Leaf (Join-Path $currentDir ".installed_deps")
if ($installedDeps -eq $false) {
  info_msg "Installing python dependencies...It can take up to few minutes for first time, hang tight..."
  & poetry install
  feedback $? "Package installation completed!" "Error occured while installing python deps with poetry!"
  New-Item -ItemType File (Join-Path $currentDir ".installed_deps") -ErrorAction SilentlyContinue | Out-Null
}

info_msg "Starting backend..."
$Env:ELECTRON_MODE = "packaged"
& python .\manage.py
