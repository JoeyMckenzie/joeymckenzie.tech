#!/bin/bash

set -e

echo "Installing bun..."

curl -fsSL https://bun.sh/install | bash
export PATH="/opt/buildhome/.bun/bin:$PATH"

echo "Bun successfully downloaded! Building site..."

bun install
bun --bun run build

echo "Site successfully built!"
