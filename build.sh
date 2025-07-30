#!/bin/bash

# Install bun
curl -fsSL https://bun.sh/install | bash

# Add bun to PATH
export PATH="$HOME/.bun/bin:$PATH"

# Verify bun installation
bun --version

# Install dependencies and build
bun install --frozen-lockfile

bun run build

mv build/ dist
