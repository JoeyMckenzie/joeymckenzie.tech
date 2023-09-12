#!/bin/bash

# Check for the required argument
DIRECTORY="node_modules"

# Check if the directory exists, install packages if it doesn't
if [ ! -d "$DIRECTORY" ]; then
  echo "Installing packages..."
  npm install
fi
