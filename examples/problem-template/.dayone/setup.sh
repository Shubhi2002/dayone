#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm ci --no-audit --no-fund >/dev/null 2>&1 || npm install --no-audit --no-fund
