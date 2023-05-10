function check_dependencies {
  $py_missing="Python version 3.10 or higher was not found on your system. Please install it and rerun this script. You can download the latest version from the official website: https://www.python.org/downloads/"
  $pip_missing="Pip was not found. Pip version 20.0 or higher is required for this project. You can find guidelines on this here: https://packaging.python.org/en/latest/tutorials/installing-packages/#ensure-you-can-run-pip-from-the-command-line"
  $npm_missing="Node.js/npm was not found. Please make sure you have installed Node.js version 16.0 or higher along with npm correctly. You can download Nodejs from here: https://nodejs.org/en/download"

    if (Get-Command python -ErrorAction SilentlyContinue) {
      if (!(python -c "import sys; exit(0) if sys.version_info >= (3,10) else exit(1)" 2>&1).Count -eq 0) {
        return "$py_missing"
        exit 1
      }
    } else {
      return "$py_missing"
      exit 1
    }

    if (!(python -m pip --version 2-ge$null)) {
      return "$pip_missing"
      exit 1
  }

    $MINIMUM_PIP_VERSION = "20.0"
    $PIP_VERSION = (python -m pip --version | Select-String -Pattern '\d+(\.\d+)+').Matches.Value

    if (!([version]$PIP_VERSION -ge [version]$MINIMUM_PIP_VERSION)) {
      return "An older version of pip was found. Pip version 20.0 or higher is required for this project. To upgrade run following command: 'pip install --upgrade pip' or 'python3 -m pip install --upgrade pip'"
      exit 1
    }

    if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
      return "$npm_missing"
      exit 1
    }

    $MEMURAI_CMD = Get-Command memurai.exe -ErrorAction SilentlyContinue

    if (!$MEMURAI_CMD) {
        return "Memurai is not installed on your machine which is an alternative to Redis for Windows and required for this project. Please download and install it to run this project. It can be downloaded from here: https://www.memurai.com/get-memurai"
        exit 1
    }
    return ''
}
