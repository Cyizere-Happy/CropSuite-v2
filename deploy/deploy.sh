#!/usr/bin/env bash
#
# TreePulse landing-page deployment script.
#
# Runs on the server as the forced command for the CI SSH key
# (command="/opt/treepulse-landing/deploy.sh" in authorized_keys), so it must
# read and strictly validate the requested tag itself.
#
# Accepted request (via SSH_ORIGINAL_COMMAND, or as "$@" when run by hand):
#     deploy sha-<40 hex characters>
#
# It deploys ONLY the `treepulse-landing` service. It never prunes, never stops
# unrelated containers, and never touches the existing admin dashboard.

set -euo pipefail

# --- configuration -----------------------------------------------------------
APP_DIR="/opt/treepulse-landing"
COMPOSE_FILE="${APP_DIR}/compose.production.yml"
SERVICE="treepulse-landing"
IMAGE_REPO="ghcr.io/cyizere-happy/treepulse_landing_page"
HOST_PORT="3001"
ADMIN_URL="http://127.0.0.1/"          # existing admin dashboard (port 80)
HEALTH_TIMEOUT=90                       # seconds to wait for container health
STATE_DIR="${APP_DIR}/state"
CURRENT_FILE="${STATE_DIR}/current-image"
PREVIOUS_FILE="${STATE_DIR}/previous-image"

log()  { printf '[deploy] %s\n' "$*"; }
fail() { printf '[deploy][ERROR] %s\n' "$*" >&2; exit 1; }

# --- parse + validate the request -------------------------------------------
REQUEST="${SSH_ORIGINAL_COMMAND:-$*}"
REQUEST="$(printf '%s' "$REQUEST" | tr -s ' ' | sed -e 's/^ *//' -e 's/ *$//')"

read -r -a PARTS <<< "$REQUEST"
[ "${#PARTS[@]}" -eq 2 ] || fail "expected 'deploy sha-<40 hex>', got: '${REQUEST}'"
[ "${PARTS[0]}" = "deploy" ] || fail "unknown command: '${PARTS[0]}'"

TAG="${PARTS[1]}"
if ! printf '%s' "$TAG" | grep -Eq '^sha-[0-9a-f]{40}$'; then
  fail "tag must match 'sha-<40 hex>', got: '${TAG}'"
fi

IMAGE="${IMAGE_REPO}:${TAG}"
export TREEPULSE_IMAGE="$IMAGE"

log "requested image: ${IMAGE}"
[ -f "$COMPOSE_FILE" ] || fail "missing ${COMPOSE_FILE}"
mkdir -p "$STATE_DIR"

# --- record the currently running image for rollback -----------------------
PREV_IMAGE=""
if docker inspect "$SERVICE" >/dev/null 2>&1; then
  PREV_IMAGE="$(docker inspect --format '{{.Config.Image}}' "$SERVICE" 2>/dev/null || true)"
fi
[ -n "$PREV_IMAGE" ] && printf '%s\n' "$PREV_IMAGE" > "$PREVIOUS_FILE"
log "previous image: ${PREV_IMAGE:-<none>}"

# --- was the admin dashboard up before we started? -------------------------
ADMIN_WAS_UP=false
if curl -fsS -m 5 -o /dev/null "$ADMIN_URL" 2>/dev/null; then
  ADMIN_WAS_UP=true
  log "admin dashboard reachable before deploy"
else
  log "admin dashboard not reachable before deploy (will not gate on it)"
fi

rollback() {
  if [ -n "$PREV_IMAGE" ]; then
    log "rolling back to ${PREV_IMAGE}"
    TREEPULSE_IMAGE="$PREV_IMAGE" docker compose -f "$COMPOSE_FILE" up -d --no-deps "$SERVICE" || true
  fi
}

# --- pull + deploy ONLY this service ---------------------------------------
log "pulling ${IMAGE}"
docker pull "$IMAGE" || fail "docker pull failed for ${IMAGE}"

log "starting/updating ${SERVICE}"
docker compose -f "$COMPOSE_FILE" up -d --no-deps "$SERVICE" \
  || { rollback; fail "compose up failed"; }

# --- wait for container health -------------------------------------------------
log "waiting up to ${HEALTH_TIMEOUT}s for ${SERVICE} to become healthy"
deadline=$(( $(date +%s) + HEALTH_TIMEOUT ))
while :; do
  status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}nohealth{{end}}' "$SERVICE" 2>/dev/null || echo missing)"
  case "$status" in
    healthy) log "container healthy"; break ;;
    unhealthy) rollback; fail "container reported unhealthy" ;;
    missing) rollback; fail "container not found after start" ;;
  esac
  [ "$(date +%s)" -ge "$deadline" ] && { rollback; fail "timed out waiting for health (last status: ${status})"; }
  sleep 3
done

# --- verify the landing page from the host --------------------------------
log "checking http://127.0.0.1:${HOST_PORT}/"
if ! curl -fsS -m 10 -o /dev/null "http://127.0.0.1:${HOST_PORT}/"; then
  rollback
  fail "landing page did not respond on port ${HOST_PORT}"
fi

# --- verify we did not break the admin dashboard --------------------------
if [ "$ADMIN_WAS_UP" = true ]; then
  if ! curl -fsS -m 5 -o /dev/null "$ADMIN_URL"; then
    rollback
    fail "admin dashboard stopped responding after deploy — rolled back"
  fi
  log "admin dashboard still responding"
fi

# --- success --------------------------------------------------------------
printf '%s\n' "$IMAGE" > "$CURRENT_FILE"
log "SUCCESS: ${SERVICE} is running ${IMAGE} on host port ${HOST_PORT}"
docker ps --filter "name=^/${SERVICE}$" --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}'
