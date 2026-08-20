#!/usr/bin/env bash
# Start the demo: FastAPI backend + Vite dev server.
# Run from anywhere:
#   ./demo/start.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$SCRIPT_DIR/api"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
ENV_NAME="${CONDA_ENV:-torch-env}"

pids=()

cleanup() {
  for pid in "${pids[@]:-}"; do
    # `conda run` wraps the real server, so kill its children first —
    # otherwise uvicorn keeps holding port 8000 after we exit.
    pkill -P "$pid" 2>/dev/null || true
    kill "$pid" 2>/dev/null || true
  done
}
trap cleanup EXIT INT TERM

if ! command -v conda >/dev/null 2>&1; then
  echo "conda not found on PATH. See the Prerequisites section of README.md." >&2
  exit 1
fi

printf '\n=== Satellite Segmentation Demo ===\n\n'

echo "Starting FastAPI backend on http://localhost:8000 ..."
(cd "$API_DIR" && conda run -n "$ENV_NAME" --no-capture-output \
  uvicorn main:app --reload --host 0.0.0.0 --port 8000) &
pids+=($!)

sleep 3

echo "Starting Vite dev server on http://localhost:5173 ..."
(cd "$FRONTEND_DIR" && conda run -n "$ENV_NAME" --no-capture-output npm run dev) &
pids+=($!)

sleep 2

printf '\n  Backend : http://localhost:8000\n'
printf '  Frontend: http://localhost:5173\n'
printf '\nPress Ctrl+C to stop both servers.\n\n'

wait
