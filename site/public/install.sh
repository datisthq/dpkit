#!/bin/sh

# This script installs dpkit.
#
# Quick install: `curl https://dpkit.dev/install.sh | sh`
#
# Acknowledgments:
#   - eget (https://github.com/zyedidia/eget

set -e -u

# Program

echo "Program: dp"

# Version

githubLatestTag() {
  finalUrl=$(curl "https://github.com/$1/releases/latest" -s -L -I -o /dev/null -w '%{url_effective}')
  printf "%s\n" "${finalUrl##*v}"
}

version=$(githubLatestTag datisthq/dpkit)
echo "Version: $version"

# Platform

platform=''
machine=$(uname -m)

if [ "${GETEGET_PLATFORM:-x}" != "x" ]; then
  platform="$GETEGET_PLATFORM"
else
  case "$(uname -s | tr '[:upper:]' '[:lower:]')" in
    "linux")
      case "$machine" in
        "arm64"* | "aarch64"* ) platform='linux-arm64' ;;
        *"64") platform='linux-x64' ;;
      esac
      ;;
    "darwin")
      case "$machine" in
        "arm64"* | "aarch64"* ) platform='macos-arm64' ;;
        *"64") platform='macos-x64' ;;
      esac
      ;;
    "msys"*|"cygwin"*|"mingw"*|*"_nt"*|"win"*)
      case "$machine" in
        *"64") platform='windows-x64' ;;
      esac
      ;;
  esac
fi

if [ "x$platform" = "x" ]; then
  cat << 'EOM'
/=====================================\\
|      COULD NOT DETECT PLATFORM      |
\\=====================================/
Uh oh! We couldn't automatically detect your operating system.
To continue with installation, please choose from one of the following values:
- linux-x64
- linux-arm64
- macos-x64
- macos-arm64
- windows-x64
Export your selection as the DPKIT_PLATFORM environment variable, and then
re-run this script.
For example:
  $ export DPKIT_PLATFORM=linux-x64
  $ curl https://dpkit.dev/install.sh | sh
EOM
  exit 1
else
  echo "Platform: $platform"
fi

# Download

archive="dp-$version-$platform.zip"
source="https://github.com/datisthq/dpkit/releases/download/v$version/$archive"
echo "Downloading: $source"
wget -qL --show-progress "https://github.com/datisthq/dpkit/releases/download/v$version/$archive" -O $archive

# Extract

echo "Extracting: $archive"
unzip -nqj $archive

# Remove

echo "Removing: $archive"
unlink $archive

# Done

echo 'Done: run it with "./dp"'
