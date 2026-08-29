#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
BACKEND_URL="http://127.0.0.1:8000"
FRONTEND_URL="http://127.0.0.1:5173"
FORCE_BUILD=false
BACKEND_PID=""
FRONTEND_PID=""

log_info() {
  printf '[INFO] %s\n' "$*"
}

log_warn() {
  printf '[WARN] %s\n' "$*" >&2
}

log_error() {
  printf '[ERROR] %s\n' "$*" >&2
}

usage() {
  printf 'Usage: %s [--build] [--help]\n\n' "$(basename -- "$0")"
  printf '  --build  Force Composer and npm dependency installation before launch.\n'
  printf '  --help   Show this help message.\n\n'
  printf 'Without --build, missing backend/vendor or frontend/node_modules folders\n'
  printf 'are installed automatically. Existing dependencies are reused.\n'
}

cleanup() {
  local pid

  for pid in "$FRONTEND_PID" "$BACKEND_PID"; do
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
      kill -TERM "$pid" 2>/dev/null || true
    fi
  done

  for pid in "$FRONTEND_PID" "$BACKEND_PID"; do
    if [[ -n "$pid" ]]; then
      wait "$pid" 2>/dev/null || true
    fi
  done
}

handle_shutdown() {
  log_info "Stopping frontend and backend servers..."
  exit 0
}

require_command() {
  local command_name="$1"

  if ! command -v "$command_name" >/dev/null 2>&1; then
    log_error "Required command is not installed: $command_name"
    exit 1
  fi
}

port_is_in_use() {
  local port="$1"

  command -v lsof >/dev/null 2>&1 &&
    lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
}

install_backend_dependencies() {
  log_info "Installing backend Composer packages..."
  (
    cd "$BACKEND_DIR"
    composer install --no-interaction --prefer-dist
  )
}

install_frontend_dependencies() {
  log_info "Installing frontend node modules..."
  (
    cd "$FRONTEND_DIR"
    npm install
  )
}

open_project() {
  if command -v open >/dev/null 2>&1; then
    open "$FRONTEND_URL"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$FRONTEND_URL" >/dev/null 2>&1 || true
  else
    log_warn "Could not open a browser automatically. Open $FRONTEND_URL manually."
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --build)
      FORCE_BUILD=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      log_error "Unknown option: $1"
      usage >&2
      exit 1
      ;;
  esac
done

[[ -f "$BACKEND_DIR/composer.json" ]] || {
  log_error "Backend project not found at $BACKEND_DIR"
  exit 1
}

[[ -f "$FRONTEND_DIR/package.json" ]] || {
  log_error "Frontend project not found at $FRONTEND_DIR"
  exit 1
}

require_command php
require_command composer
require_command node
require_command npm

if [[ "$FORCE_BUILD" == true || ! -d "$BACKEND_DIR/vendor" ]]; then
  install_backend_dependencies
else
  log_info "Backend dependencies already exist; skipping Composer install."
fi

if [[ "$FORCE_BUILD" == true || ! -d "$FRONTEND_DIR/node_modules" ]]; then
  install_frontend_dependencies
else
  log_info "Frontend dependencies already exist; skipping npm install."
fi

if port_is_in_use 8000; then
  log_error "Backend port 8000 is already in use. Stop that process and run this script again."
  exit 1
fi

if port_is_in_use 5173; then
  log_error "Frontend port 5173 is already in use. Stop that process and run this script again."
  exit 1
fi

trap cleanup EXIT
trap handle_shutdown INT TERM

log_info "Starting Symfony API at $BACKEND_URL ..."
(
  cd "$BACKEND_DIR"
  exec php -S 127.0.0.1:8000 -t public public/index.php
) &
BACKEND_PID=$!

log_info "Starting Vite frontend at $FRONTEND_URL ..."
(
  cd "$FRONTEND_DIR"
  exec npm run dev
) &
FRONTEND_PID=$!

sleep 1

if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
  log_error "The backend server failed to start."
  exit 1
fi

if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
  log_error "The frontend server failed to start."
  exit 1
fi

open_project

log_info "Project is running. Press Ctrl+C to stop both servers."

while kill -0 "$BACKEND_PID" 2>/dev/null && kill -0 "$FRONTEND_PID" 2>/dev/null; do
  sleep 1
done

log_error "One of the development servers stopped unexpectedly."
exit 1
