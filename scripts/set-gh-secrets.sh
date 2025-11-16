#!/usr/bin/env bash
# Helper to set repository secrets via GitHub CLI (gh).
# Usage:
# 1) Install GitHub CLI and authenticate: https://cli.github.com/
# 2) Export your secret values locally, e.g.:
#    export VITE_SUPABASE_URL="https://..."
#    export VITE_SUPABASE_ANON_KEY="..."
#    export NEXT_PUBLIC_SUPABASE_URL="https://..."    # optional
#    export NEXT_PUBLIC_SUPABASE_ANON_KEY="..."     # optional
#    export CUSTOM_DOMAIN="farhankabir.me"         # optional
# 3) Run this script from the repo root:
#    bash scripts/set-gh-secrets.sh

set -euo pipefail

REPO="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"
echo "Setting GitHub Actions secrets for repo: $(basename "$REPO")"

require_gh() {
  if ! command -v gh >/dev/null 2>&1; then
    echo "gh CLI not installed. Install from https://cli.github.com/ and authenticate (gh auth login)" >&2
    exit 1
  fi
}

require_gh

set_secret_if_env() {
  local env_name="$1"; shift
  local secret_name="$1"; shift
  if [ -n "${!env_name-}" ]; then
    echo "Setting secret: $secret_name from env $env_name"
    printf "%s" "${!env_name}" | gh secret set "$secret_name" --body - || {
      echo "Failed to set secret $secret_name" >&2; exit 1
    }
  else
    echo "Skipping $secret_name (env $env_name not set)"
  fi
}

# Map local env var -> GitHub secret name
set_secret_if_env VITE_SUPABASE_URL VITE_SUPABASE_URL
set_secret_if_env VITE_SUPABASE_ANON_KEY VITE_SUPABASE_ANON_KEY
set_secret_if_env NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_URL
set_secret_if_env NEXT_PUBLIC_SUPABASE_ANON_KEY NEXT_PUBLIC_SUPABASE_ANON_KEY
set_secret_if_env VITE_WALLETCONNECT_PROJECT_ID VITE_WALLETCONNECT_PROJECT_ID
set_secret_if_env CUSTOM_DOMAIN CUSTOM_DOMAIN

echo "Done. Verify secrets in the repository Settings → Secrets → Actions." 
