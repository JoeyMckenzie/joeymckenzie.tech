#!/bin/bash

DIRECTORY="node_modules/preline/dist/"
FILE="preline.js"
PRELINE_JS="$DIRECTORY/$FILE"
ASSETS="assets/js"

cp $PRELINE_JS "$ASSETS/."
