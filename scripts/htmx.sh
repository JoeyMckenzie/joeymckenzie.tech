#!/bin/bash

# Check for the required argument
DIRECTORY="assets/js"
FILE="htmx.min.js"

# Check if the directory exists, and create it if it doesn't
if [ ! -d "$DIRECTORY" ]; then
  mkdir -p "$DIRECTORY"
  echo "Directory '$DIRECTORY' created."
fi

# Check if the file exists, and create it if it doesn't
if [ ! -f "$DIRECTORY/$FILE" ]; then
  touch "$DIRECTORY/$FILE"
  echo "File '$DIRECTORY/$FILE' created."
fi

URL="https://unpkg.com/htmx.org/dist/htmx.min.js"
DEST_FILE="assets/js/htmx.min.js"

curl -L -o "$DEST_FILE" "$URL"

if [ $? -eq 0 ]; then
  echo "Download successful! File saved as $DEST_FILE"
else
  echo "Download failed"
  exit 1
fi
