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
Write-Host "      ============================================================"  -ForegroundColor $general_color
Write-Host "     ||                  Welcome to Flojoy!                      ||" -ForegroundColor $general_color
Write-Host "     ||                                                          ||" -ForegroundColor $general_color
Write-Host "     ||         For Installation, Follow the Link Below          ||" -ForegroundColor $general_color
Write-Host "     ||       https://docs.flojoy.io/getting-started/install/    ||" -ForegroundColor $general_color
Write-Host "     ||                                                          ||" -ForegroundColor $general_color
Write-Host "      ============================================================" -ForegroundColor $general_color
Write-Host ""

$initNodePackages = $true
$initPythonPackages = $true
$initSubmodule = $true
$enableSentry = $true
$enableTelemetry = $false


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
  Write-Host "Usage: $0 -n -p -s -S -T"
  Write-Host  " -n: To NOT install npm packages"
  Write-Host  " -p: To NOT install python packages"
  Write-Host  " -s: To NOT update submodules"
  Write-Host  " -S: To NOT enable Sentry"
  Write-Host  " -T: To enable Telemetry"
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

& python write_python_metadata.py

feedback $? 'Jsonified Python functions and written to JS-readable directory' 'Error occurred while Jsonifying Python functions. Check errors printed above!'

# Generate Manifest

& python generate_manifest.py

feedback $? 'Successfully generated manifest for Python nodes to frontend' 'Failed to generate manifest for Python nodes. Check errors printed above!'

# Setup Sentry env var
if ( $enableSentry -eq $true ) {
  info_msg "Sentry will be enabled!"
  [System.Environment]::SetEnvironmentVariable('FLOJOY_ENABLE_SENTRY', 1)
} 
else {
  info_msg "Sentry will be disabled!"
  [System.Environment]::SetEnvironmentVariable('FLOJOY_ENABLE_SENTRY', 0)
}
# Setup Telemetry
if ( $enableTelemetry -eq $true ) {
  info_msg "Telemetry will be enabled!"
  [System.Environment]::SetEnvironmentVariable('FLOJOY_ENABLE_TELEMETRY', 1)
}
else {
  info_msg "Telemetry will be disabled!"
  [System.Environment]::SetEnvironmentVariable('FLOJOY_ENABLE_TELEMETRY', 0)
}


info_msg 'Checking if Memurai is running...'
& memurai-cli.exe ping 2>$1 > $null
$is_running = $LastExitCode

if ($is_running -eq 0) {
  success_msg 'Memurai is up and running...'
}
else {
  info_msg "Memurai is not running, trying to start Memurai service..."
  & memurai.exe --service-start > $null
  feedback $? 'Started Memurai successfully...' 'Failed to start Memurai. Please try running following command to start Memurai: "memurai.exe --service-start"'
}


# Check for rq-win package
& pip show rq-win 2>$1 > $null
$is_installed = $LastExitCode
if ($is_installed -ne 0) {
  info_msg 'Installing rq-win package to run RQ Worker on Windows...'
  $install_cmd = 'pip install git+https://github.com/michaelbrooks/rq-win.git#egg=rq-win'
  Invoke-Expression $install_cmd 2>$1 | Out-Null
  if ($LastExitCode -eq 0) {
    feedback $true 'Installed rq-win package successfully!' ''
  }
  else {
    feedback $false '' 'Failed to install rq-win package try running following command to install it manually: "pip install git+https://github.com/michaelbrooks/rq-win.git#egg=rq-win"'
  }
}


# Get Python scripts path
$python_scripts_path = & python .\get_script_dir.py
feedback $? 'Script path found for Python...' "Couldn't find script path for Python site-packages. Make sure you installed all required Python packages or run this script without -p argument to install packages automatically."
info_msg 'Checking if Python Scripts path is available in Path environment...'
$existingPath = [Environment]::GetEnvironmentVariable("Path", "User")
# Check if the path already exists in the variable
if ($existingPath -split ";" -contains $python_scripts_path) {
  feedback $true "The Python Scripts path is already present in the Path environment variable..." ""
}
else {
  info_msg "Adding Scipts path to Path environment..."
  setx path "$existingPath;$python_scripts_path" 2>$1 > $null
  feedback $? "Scripts path added successfully, Please restart PowerShell and run the script again to take effect." "Failed to add Scripts path please add following path to Path environment and run this script again. $python_scripts_path"
  Exit 0
}

# Start the project
info_msg 'Starting the project...'
& npm run start-project:win
