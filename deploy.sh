#!/bin/bash

set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed or not in PATH" >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker daemon is not available" >&2
  exit 1
fi

if [ ! -f .env ]; then
  echo "Missing .env. Copy .env.example to .env and set required values." >&2
  exit 1
fi

if ! grep -q '^DB_ROOT_PASSWORD=' .env || ! grep -q '^DB_PASSWORD=' .env; then
  :
fi

docker compose build
docker compose up -d
docker compose ps
