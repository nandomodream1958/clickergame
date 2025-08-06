#!/bin/bash

# Get the total number of commits
COMMIT_COUNT=$(git rev-list --count HEAD)

# Define the version string format
VERSION_STRING="v.dev-${COMMIT_COUNT}"

# Target file
TARGET_FILE="index.html"

# Use sed to replace the content of the version paragraph
# This works on both macOS and Linux
sed -i.bak "s|<p id=\"version\">.*</p>|<p id=\"version\">${VERSION_STRING}</p>|" "${TARGET_FILE}"

# Remove the backup file created by sed
rm "${TARGET_FILE}.bak"

echo "Version updated to ${VERSION_STRING} in ${TARGET_FILE}"

