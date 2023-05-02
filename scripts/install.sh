#!/usr/bin/env sh

ARCH="linux-x86_64"
VERSION="22.2"

curl -OL "https://github.com/protocolbuffers/protobuf/releases/download/v$VERSION/protoc-$VERSION-$ARCH.zip"; \
    sudo unzip -o "protoc-$VERSION-$ARCH.zip" bin/protoc "include/*" -d /usr/local; \
    rm -f "protoc-$VERSION-$ARCH.zip"