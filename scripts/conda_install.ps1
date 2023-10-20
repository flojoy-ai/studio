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
info_msg "Downloading latest miniconda executable..."
curl https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe -o miniconda.exe | Out-Null
info_msg "Installing miniconda on the machine..."
Start-Process .\miniconda.exe -ArgumentList "/S /InstallationType=JustMe" -Wait -ErrorAction SilentlyContinue
feedback $? "Miniconda installed successfully!" "Failed to install Miniconda"
Remove-Item miniconda.exe | Out-Null