#!/usr/bin/env sh

# Various install scripts for tools used throughout the project

# The shuttle examples require protoc, so install it as a dependency (assumes we're running on linux)

ARCH="linux-x86_64"
VERSION="22.2"

curl -OL "https://github.com/protocolbuffers/protobuf/releases/download/v$VERSION/protoc-$VERSION-$ARCH.zip"; \
    sudo unzip -o "protoc-$VERSION-$ARCH.zip" bin/protoc "include/*" -d /usr/local; \
    rm -f "protoc-$VERSION-$ARCH.zip"