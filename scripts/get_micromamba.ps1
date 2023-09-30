Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Bypass

$tempDir = Join-Path $PWD "bin/.temp"
if (-not (Test-Path $tempDir)) {
  New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
}

Invoke-Webrequest -URI https://micro.mamba.pm/api/micromamba/win-64/latest -OutFile "$tempDir/micromamba.tar.bz2"

tar xf "$tempDir/micromamba.tar.bz2" -C $tempDir

Move-Item -Force "$tempDir\Library\bin\micromamba.exe" "bin/micromamba.exe"

Remove-Item $tempDir -Force -Recurse