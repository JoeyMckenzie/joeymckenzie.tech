#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <arg1> <arg2>"
  exit 1
fi

# Assign arguments to variables
key="$1"
value="$2"

# Check if the key already exists in the file
if grep -q "^$key=" .env; then
  # Replace the existing key-value pair
  sed -i "s/^$key=.*/$key=$value/" .env
else
  # Append the new key-value pair to the end of the file
  echo "$key=$value" >> .env
fi
