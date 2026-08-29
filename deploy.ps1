$ErrorActionPreference = 'Stop'

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw 'Docker is not installed or not in PATH'
}

docker info | Out-Null

if (-not (Test-Path '.env')) {
    throw 'Missing .env. Copy .env.example to .env and set required values.'
}

docker compose build
docker compose up -d
docker compose ps
