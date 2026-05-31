#!/usr/bin/env bash
set -euo pipefail

DEPLOY_ENV="${DEPLOY_ENV:-staging}"
DEPLOY_HOST="${DEPLOY_HOST:-deploy-placeholder.example.com}"
IMAGE_TAG="${IMAGE_TAG:-burgerz:latest}"
DRY_RUN="${DRY_RUN:-false}"

echo "=== Mock deploy ==="
echo "Environment: ${DEPLOY_ENV}"
echo "Host: ${DEPLOY_HOST}"
echo "Image: ${IMAGE_TAG}"
echo "Dry run: ${DRY_RUN}"
echo "Commit: ${GITHUB_SHA:-local}"
echo "Ref: ${GITHUB_REF:-local}"

if [[ "${DRY_RUN}" == "true" ]]; then
  echo "[RUN] Would push image: ${IMAGE_TAG}"
  echo "[RUN] Would connect to ${DEPLOY_HOST} and run container update"
  echo "[RUN] Would verify health check at https://${DEPLOY_HOST}/"
else
  echo "[MOCK] Pushing image: ${IMAGE_TAG}"
  echo "[MOCK] ssh deploy@${DEPLOY_HOST} 'docker pull ${IMAGE_TAG} && docker compose up -d'"
  echo "[MOCK] Running health check..."
  sleep 2
  echo "[MOCK] Health check passed (simulated)"
fi

echo "=== Mock deploy complete ==="
echo "Replace scripts/mock-deploy.sh with real deploy steps when server is ready."
