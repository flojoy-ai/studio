
function check_dependencies {
  $py_missing="Python version ~3.11 was not found on your system. Please install it and rerun this script. You can download the latest version from the official website: https://www.python.org/downloads/"
  $npm_missing = "Node.js/npm was not found. Please make sure you have installed Node.js version 16.0 or higher along with npm correctly. You can download Nodejs from here: https://nodejs.org/en/download"

  if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    error_msg "$npm_missing"
    exit 1
  }
  if (Get-Command python -ErrorAction SilentlyContinue) {
    if (!(python -c "import sys; exit(0) if sys.version_info >= (3,11) else exit(1)" -ErrorAction SilentlyContinue | Out-Null).Count -eq 0) {
      error_msg "$py_missing"
      exit 1
    }
  } else {
    error_msg "$py_missing"
    exit 1
  }
}
