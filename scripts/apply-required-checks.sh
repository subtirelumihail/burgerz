#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required. Install it from https://cli.github.com/"
  exit 1
fi

REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
RULESET_FILE=".github/rulesets/required-checks.json"

echo "Applying ruleset from ${RULESET_FILE} to ${REPO}..."
gh api \
  --method POST \
  "repos/${REPO}/rulesets" \
  --input "${RULESET_FILE}"

echo "Ruleset applied. Verify under GitHub → Settings → Rules → Rulesets."
