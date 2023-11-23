Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Bypass

# Run all services required by Flojoy Studio

$success_color = 'Green'
$warning_color = 'Yellow'
$error_color = 'Red'
$info_color = 'Cyan'
$general_color = 'Magenta'
$info_mark = '👉'
$check_mark = '✔'
$alert_mark = '⚠️'
$error_mark = '❌'

function success_msg {
  param (
    $message
  )
  Write-Host "$check_mark $message " -ForegroundColor $success_color
  Write-Host ""
}

function info_msg {
  param (
    $message
  )
  Write-Host "$info_mark $message " -ForegroundColor $info_color
  Write-Host ""
}

function warning_msg {
  param (
    $message
  )
  Write-Host "$alert_mark $message " -ForegroundColor $warning_color
  Write-Host ""
}

function error_msg {
  param (
    $message
  )
  Write-Host "$error_mark $message " -ForegroundColor $error_color
  Write-Host ""
  Write-Host ""
}

Write-Host ""
Write-Host ""
Write-Host "      ==============================================================="  -ForegroundColor $general_color
Write-Host "     ||                     Welcome to Flojoy!                      ||" -ForegroundColor $general_color
Write-Host "     ||                                                             ||" -ForegroundColor $general_color
Write-Host "     ||           For Installation, Follow the Link Below           ||" -ForegroundColor $general_color
Write-Host "     ||       https://docs.flojoy.ai/getting-started/install/       ||" -ForegroundColor $general_color
Write-Host "     ||                                                             ||" -ForegroundColor $general_color
Write-Host "      ===============================================================" -ForegroundColor $general_color
Write-Host ""

$initNodePackages = $true
$initPythonPackages = $true
$enableSentry = $true
$enableTelemetry = $false
$isDebugMode = $false
$isRemoteMode = $false



# Gives Feedback if the command run is successful or failed, if failed it exits the execution.

function feedback {
  param (
    $is_successful,
    $message,
    $help_message
  )
  if ($is_successful -eq $true) {
    success_msg $message
  }
  else {
    error_msg $help_message
    exit
  }
}

# Help function
function helpFunction {
  Write-Host ""
  Write-Host "Usage: $0 -n -p -S -T -d -r"
  Write-Host  " -n: To NOT install npm packages"
  Write-Host  " -p: To NOT install python packages"
  Write-Host  " -S: To NOT enable Sentry"
  Write-Host  " -T: To enable Telemetry"
  Write-Host  " -d: To enable debug mode"
  Write-Host  " -r: To start studio in remote mode without electron"
}

# Assign command-line arguments to a variable
$arguments = $args

# Parse command-line arguments
$index = 0
while ($arguments) {
  $key = $arguments[$index]

  if ($index -eq $arguments.Length) {
    break
  }
  if ($key -ceq "-n") {
    $initNodePackages = $false
    $index = $index + 1
    continue
  }
  elseif ($key -ceq "-p") {
    $initPythonPackages = $false
    $index = $index + 1
    continue

  }
  elseif ($key -ceq "-S") {
    $enableSentry = $false
    $index = $index + 1
    continue
  }
  elseif ($key -ceq "-r") {
    $isRemoteMode = $true
    $index = $index + 1
    continue
  }
  elseif ($key -ceq "-T") {
    $enableTelemetry = $true
    $index = $index + 1
    continue
  }
  elseif ($key -ceq "-d") {
    $isDebugMode = $true
    $index = $index + 1
    continue
  }
  else {
    Write-Host "Unknown option: $key"
    helpFunction
    exit 1
  }
}

$CWD = $PWD

function createFlojoyDirectoryWithYmlFile {
  $FOLDER = "$HOME/.flojoy"
  $FILE = "$HOME/.flojoy/flojoy.yaml"
  if (Test-Path $FOLDER) {
    if (Test-Path $FILE) {
      info_msg "$FILE exists."
      Set-Content $FILE "PATH: $CWD"
      feedback $? "Updated file path in flojoy.yaml file." "Couldn't update file path in flojoy.yaml file, check the permission or sign in as root user"
    }
    else {
      info_msg "file flojoy.yaml in directory $FOLDER does not exist."
      New-Item $FILE -ItemType File | Out-Null
      Set-Content $FILE "PATH: $CWD"
      feedback $? "Successfully created flojoy.yaml file in $FOLDER directory." "Couldn't create flojoy.yaml file in $FOLDER directory, check the permission or sign in as root user"
    }
  }
  else {
    info_msg "directory ~/.flojoy/flojoy.yaml does not exist."
    New-Item -ItemType Directory $FOLDER | Out-Null
    New-Item $FILE -ItemType File | Out-Null
    Set-Content $FILE "PATH: $CWD"
    feedback $? "Created new $FOLDER directory with flojoy.yaml file." "Failed to create file in the home directory, check the permission or sign in as root user"
  }

  $CREDENTIALS_FILE = "$FOLDER/credentials.txt"
  if (-not (Test-Path $CREDENTIALS_FILE)) {
    New-Item $CREDENTIALS_FILE -ItemType File | Out-Null
  }
}


createFlojoyDirectoryWithYmlFile


# Check if Conda or NPM is missing.
. ./check-dependencies.ps1

# Call the function to check for dependencies
check-dependencies

if (!(python -c "import pipx" 2>&1).Count -eq 0) {
  & python -m pip install --user pipx
  & python -m pipx ensurepath
  $existing_path="$env:PATH"
  $env:PATH="$HOME/.local/bin:$existing_path"
}
$poetry_path = "$HOME/.local/bin/poetry"

if(!(Test-Path "$poetry_path")){
  python -m pipx install poetry --force
}

# Install Python packages

if ($initPythonPackages) {
  info_msg "Flag -p is not provided, Python packages will be installed with Poetry!"
  Set-Location $CWD
  Invoke-Expression "$poetry_path install"
  feedback $? 'Python packages installed successfully!' "Python package installation failed! check error details printed above."
}

# Install Node packages

if ($initNodePackages) {
  if (!(Get-Command pnpm -ErrorAction SilentlyContinue)) {
    & npm install --global pnpm | Out-Null
  }
  info_msg "Argument -n is not provided, Node packages will be installed from package.json"
  & pnpm install
  feedback $? 'Installed Node packages successfully.' 'Node packages installation failed! check error details printed above.'
}

# Setup Sentry env var
if ( $enableSentry -eq $true ) {
  info_msg "Sentry will be enabled!"
  $Env:FLOJOY_ENABLE_SENTRY = 1
}
else {
  info_msg "Sentry will be disabled!"
  $Env:FLOJOY_ENABLE_SENTRY = 0
}
# Setup Telemetry
if ( $enableTelemetry -eq $true ) {
  info_msg "Telemetry will be enabled!"
  $Env:FLOJOY_ENABLE_TELEMETRY = 1
}
else {
  info_msg "Telemetry will be disabled!"
  $Env:FLOJOY_ENABLE_TELEMETRY = 0
}
# setup deploy environment
if ( $isRemoteMode -eq $true ) {
  info_msg "Electron will be disabled!"
  $Env:DEPLOY_ENV = "remote"
  $blocksDir = Join-Path $CWD "PYTHON/blocks"
  if (-not (Test-Path $blocksDir)) {
    info_msg "Cloning blocks repo for remote mode..."
    git clone https://github.com/flojoy-ai/blocks.git "$blocksDir" | Out-Null
    $blocksRegistryPath = "$HOME/.flojoy/blocks_path.txt"
    # register blocks path to blocks_path.txt file
    if (Test-Path $blocksRegistryPath) {
        Set-Content -Path $blocksRegistryPath -Value "$blocksDir" -NoNewline | Out-Null
      } else {
        New-Item -Path $blocksRegistryPath -ItemType "file" | Out-Null
        Set-Content -Path $blocksRegistryPath -Value "$blocksDir" -NoNewline | Out-Null
    }
  } else {
    Set-Location "$blocksDir"
    git stash
    git pull
  }
}
else {
  $Env:DEPLOY_ENV = "local"
}
Set-Location "$CWD"
# set deploy status to dev
$Env:DEPLOY_STATUS = "dev"

# Start the project
info_msg 'Starting the project...'
if ($isDebugMode -eq $true) {
  info_msg "Debug mode will be enabled!"
  $Env:FASTAPI_LOG = "debug"
  $startProjectCmd = "pnpm run start-project:win:debug"
}
else {
  $Env:FASTAPI_LOG = "info"
  $startProjectCmd = "pnpm run start-project:win"

}

Invoke-Expression $startProjectCmd
