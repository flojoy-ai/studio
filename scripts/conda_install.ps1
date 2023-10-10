Write-Host "Downloading latest miniconda executable..."
curl https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe -o miniconda.exe | Out-Null
Write-Host "Installing conda on the machine..."
Start-Process .\miniconda.exe -ArgumentList /S -Wait -ErrorAction SilentlyContinue
Write-Host "Conda installed successfully!"
Remove-Item miniconda.exe | Out-Null