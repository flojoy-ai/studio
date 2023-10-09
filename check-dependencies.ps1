
function check_dependencies {
  $conda_missing = "Conda was not found on your system." +
   "Please install it and rerun this script. You can download the latest version from the official website: https://docs.conda.io/projects/conda/en/latest/user-guide/install/windows.html" +
   " Alternatively you can provide path to conda executable in following pattern: ./flojoy -c <path/to/conda.exe>"
  $npm_missing = "Node.js/npm was not found. Please make sure you have installed Node.js version 16.0 or higher along with npm correctly. You can download Nodejs from here: https://nodejs.org/en/download"

  if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    error_msg "$npm_missing"
    exit 1
  }
  if ($conda_exec){
    return $conda_exec
  }
  if (!(Get-Command conda -ErrorAction SilentlyContinue)) {
    $conda_default_exec = Join-Path $env:USERPROFILE "miniconda3" "Scriptst" "conda.exe"
    if (-not (Test-Path $conda_default_exec)) {
      error_msg "$conda_missing"
      exit 1
    } else {
      return "$conda_default_exec"
    }
  } else {
    return "conda"
  }
}
