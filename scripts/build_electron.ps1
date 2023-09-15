Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Bypass

$currentDir = $PWD
Write-Host "current dir: $currentDir"

# Define the source file path (the file you want to unzip)
$sourceFilePath = Join-Path $currentDir "scripts/python-interpreter/win.zip"
Write-Host "Source file: $sourceFilePath"
# Define the destination folder where you want to extract the contents
$destinationFolder = Join-Path $currentDir "dist/python"

Write-Host "destination path: $destinationFolder"
# Check if the source file exists
if (Test-Path $sourceFilePath -PathType Leaf) {
    # Check if the destination folder exists; if not, create it
    if (-not (Test-Path $destinationFolder -PathType Container)) {
        New-Item -ItemType Directory -Path $destinationFolder -Force | Out-Null
    }

    # Unzip the file to the destination folder
    Expand-Archive -Path $sourceFilePath -DestinationPath $destinationFolder -Force

    Write-Host "File '$sourceFilePath' has been successfully unzipped to '$destinationFolder'."
} else {
    Write-Host "Source file '$sourceFilePath' does not exist."
}
