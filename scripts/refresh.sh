#!/bin/bash

rm -rf node_modules bun.lockb && bun install && bun run build
