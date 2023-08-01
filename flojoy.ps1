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
Write-Host "     ||       https://docs.flojoy.io/getting-started/install/       ||" -ForegroundColor $general_color
Write-Host "     ||                                                             ||" -ForegroundColor $general_color
Write-Host "      ===============================================================" -ForegroundColor $general_color
Write-Host ""

$initNodePackages = $true
$initPythonPackages = $true
$initSubmodule = $true
$enableSentry = $true
$enableTelemetry = $false
$isDebugMode = $false


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
  Write-Host "Usage: $0 -n -p -s -S -T -v venv -d"
  Write-Host  " -n: To NOT install npm packages"
  Write-Host  " -p: To NOT install python packages"
  Write-Host  " -s: To NOT update submodules"
  Write-Host  " -S: To NOT enable Sentry"
  Write-Host  " -T: To enable Telemetry"
  Write-Host  " -v: To use virtual env"
  Write-Host  " -d: To enable debug mode"
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
  elseif ($key -ceq "-s") {
    $initSubmodule = $false
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
  elseif ($key -ceq "-v") {
    $venvPath = $arguments[$index + 1]
    $index = $index + 2
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

  $CREDENTIALS_FILE = "$FOLDER/credentials"
  if (-not (Test-Path $CREDENTIALS_FILE)) {
    warning_msg " Warning: Credentials are not set for your project! You can set credentials by creating a file named 'credentials' in the directory '~/.flojoy' and adding your credentials to the file."
  }
  else {
    $FRONTIER_API_KEY_PATTERN = "FRONTIER_API_KEY:"
    $FRONTIER_API_KEY = Select-String $CREDENTIALS_FILE -Pattern $FRONTIER_API_KEY_PATTERN -Quiet
    if (-not $FRONTIER_API_KEY) {
      warning_msg " Warning: Frontier API key not set for your project! To set Frontier API key, simply follow this pattern in the '~/.flojoy/credentials' file: FRONTIER_API_KEY:<your key>"
    }
  }
}

createFlojoyDirectoryWithYmlFile

if ($venvPath) {
  info_msg "Venv path is given, will use: $venvPath"
  & $venvPath\Scripts\activate
}

if ($initSubmodule -eq $true) {
  # Update submodules
  & git submodule update --init --recursive > $null
  feedback $? 'Updated submodules successfully' 'Failed to update submodules, check if git is installed correctly and configured with your github account.'
}


# Check if Python, Pip, or npm is missing.
. ./check-dependencies.ps1

# Call the function to check for dependencies
$missing_dependencies = check_dependencies

# If there are missing dependencies, print the list of them
if ($missing_dependencies) {
  error_msg "$missing_dependencies"
  exit 1
}

function check_and_install_py_pckg() {
  param (
    $pckg_name,
    $pip_cmd
  )
  & pip show $pckg_name 2>$1 > $null
  $is_installed = $LastExitCode
  if ($is_installed -ne 0) {
    $install_cmd = "python -m $pip_cmd install $pckg_name"
    Invoke-Expression $install_cmd 2>$1 | Out-Null
  }
}

# Install Python packages

if ($initPythonPackages) {
  info_msg "Flag -p is not provided, Python packages will be installed from requirements.txt file"
  Set-Location $CWD
  check_and_install_py_pckg "pipwin" "pip"
  check_and_install_py_pckg "matplotlib==3.5.2" "pipwin" 
  $pip_cmd = "python -m pip install -r requirements.txt"
  Invoke-Expression $pip_cmd
  feedback $? 'Python packages installed successfully!' "Python package installation failed! check error details printed above."
}

# Install Node packages

if ($initNodePackages) {
  info_msg "Argument -n is not provided, Node packages will be installed from package.json"
  & npm install
  feedback $? 'Installed Node packages successfully.' 'Node packages installation failed! check error details printed above.'
}

# jsonify python functions

& python .\scripts\write_python_metadata.py

feedback $? 'Jsonified Python functions and written to JS-readable directory' 'Error occurred while Jsonifying Python functions. Check errors printed above!'

# Generate Manifest

& python .\PYTHON\generate_manifest.py

feedback $? 'Successfully generated manifest for Python nodes to frontend' 'Failed to generate manifest for Python nodes. Check errors printed above!'


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

# Start the project
info_msg 'Starting the project...'
if ($isDebugMode -eq $true) {
  info_msg "Debug mode will be enabled!"
  $Env:DEBUG = $true
  $startProjectCmd = "npm run start-project:win:debug"
}
else {
  $Env:DEBUG = $false
  $startProjectCmd = "npm run start-project:win"

}
Invoke-Expression $startProjectCmd
