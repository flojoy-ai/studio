#!/bin/bash

download_and_rename() {
    url="$1"
    distro_suffix="$2"

    echo "Downloading $url"

    curl -Ls "$url" | tar -xvj bin/micromamba

    DESTINATION="$(pwd)/bin/micromamba-$distro_suffix"
    mv "$(pwd)/bin/micromamba" "$DESTINATION"
    chmod +x "$DESTINATION"
}

MICROMAMBA_URL="https://micro.mamba.pm/api/micromamba"

# Linux Intel (x86_64)
download_and_rename "$MICROMAMBA_URL/linux-64/latest" "Linux-x86_64"

# Linux ARM64
download_and_rename "$MICROMAMBA_URL/linux-aarch64/latest" "Linux-arm64" 

# Linux Power
download_and_rename "$MICROMAMBA_URL/linux-ppc64le/latest" "Linux-ppc64le" 

# macOS Intel (x86_64)
download_and_rename "$MICROMAMBA_URL/osx-64/latest" "Darwin-x86_64"

# macOS Silicon/M1 (ARM64)
download_and_rename "$MICROMAMBA_URL/osx-arm64/latest" "Darwin-arm64" 
