#!/bin/bash

rm -rf node_modules bun.lockb && pnpm install && pnpm run build
