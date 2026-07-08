#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJ_DIR="$(dirname "$SCRIPT_DIR")"

# kill any leftover processes on target ports
kill $(lsof -t -i:8000 -i:8001 -i:8002) 2>/dev/null || true

echo ">>> Starting l-projects-services..."

cd "$PROJ_DIR/l-projects-services"

# activate venv
source lservices/bin/activate

# export GITHUB_TOKEN for authenticated API calls (optional, but recommended)
if [ -z "${GITHUB_TOKEN}" ] && [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# start each service from its own directory
(cd projects && uvicorn main:app --reload --port 8001) &
(cd features && uvicorn main:app --reload --port 8002) &
(cd gateway && uvicorn main:app --reload --port 8000) &

echo ">>> Services started on ports 8001, 8002, 8000"
echo ">>> Starting l-projects (React frontend)..."

cd "$SCRIPT_DIR"
npm start
