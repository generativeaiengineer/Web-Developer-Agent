#!/usr/bin/env bash
# =============================================================================
# lighthouse-check.sh — WD-01 Lighthouse Audit Script
# Uses Google PageSpeed Insights API (free, no API key required for basic use)
#
# Usage:
#   ./scripts/lighthouse-check.sh <url>
#
# Examples:
#   ./scripts/lighthouse-check.sh https://example.com
#   ./scripts/lighthouse-check.sh https://example.com/about
#
# Exit codes:
#   0 — All categories passed
#   1 — One or more categories failed or script error
# =============================================================================

set -euo pipefail

# ── Thresholds (edit to match quality-standards.json) ────────────────────────
THRESHOLD_PERFORMANCE=90
THRESHOLD_SEO=95
THRESHOLD_ACCESSIBILITY=90
THRESHOLD_BEST_PRACTICES=90

# ── Color output ──────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Argument validation ───────────────────────────────────────────────────────
if [ $# -lt 1 ]; then
  echo -e "${RED}Error:${RESET} URL argument required."
  echo "Usage: $0 <url>"
  echo "Example: $0 https://example.com"
  exit 1
fi

URL="$1"

# Basic URL format check
if [[ ! "$URL" =~ ^https?:// ]]; then
  echo -e "${RED}Error:${RESET} URL must start with http:// or https://"
  exit 1
fi

# ── Dependency check ──────────────────────────────────────────────────────────
if ! command -v curl &>/dev/null; then
  echo -e "${RED}Error:${RESET} curl is required but not installed."
  exit 1
fi

if ! command -v python3 &>/dev/null && ! command -v node &>/dev/null; then
  echo -e "${RED}Error:${RESET} python3 or node is required to parse JSON."
  exit 1
fi

# ── JSON parsing helper ───────────────────────────────────────────────────────
# Tries python3 first, falls back to node
parse_json() {
  local json="$1"
  local key="$2"
  if command -v python3 &>/dev/null; then
    echo "$json" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d$key)" 2>/dev/null
  else
    echo "$json" | node -e "let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{ const o=JSON.parse(d); console.log(o$key); });"
  fi
}

# ── Run PageSpeed Insights API ────────────────────────────────────────────────
PSI_API="https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
ENCODED_URL=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$URL'))" 2>/dev/null \
  || node -e "console.log(encodeURIComponent('$URL'))")

echo ""
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}  WD-01 Lighthouse Check${RESET}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "  URL: ${YELLOW}$URL${RESET}"
echo -e "  Strategy: mobile + desktop"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

OVERALL_PASS=true

# ── Run audit for one strategy ────────────────────────────────────────────────
run_audit() {
  local strategy="$1"
  local label
  label=$(echo "$strategy" | tr '[:lower:]' '[:upper:]')

  echo -e "${BOLD}  [$label]${RESET}"

  # Fetch from PageSpeed Insights — categories=performance,seo,accessibility,best-practices
  local api_url="${PSI_API}?url=${ENCODED_URL}&strategy=${strategy}&category=performance&category=seo&category=accessibility&category=best-practices"

  local response
  response=$(curl -s --max-time 60 --retry 2 "$api_url") || {
    echo -e "  ${RED}✗ Failed to reach PageSpeed Insights API${RESET}"
    OVERALL_PASS=false
    return
  }

  # Check for API error
  local error_msg
  error_msg=$(parse_json "$response" "['error']['message']" 2>/dev/null || echo "")
  if [ -n "$error_msg" ] && [ "$error_msg" != "None" ]; then
    echo -e "  ${RED}✗ API Error: $error_msg${RESET}"
    OVERALL_PASS=false
    return
  fi

  # Extract scores (0.0–1.0 → multiply by 100)
  local perf seo access bp lcp cls inp fcp

  perf=$(parse_json "$response" "['lighthouseResult']['categories']['performance']['score']" 2>/dev/null || echo "null")
  seo=$(parse_json "$response" "['lighthouseResult']['categories']['seo']['score']" 2>/dev/null || echo "null")
  access=$(parse_json "$response" "['lighthouseResult']['categories']['accessibility']['score']" 2>/dev/null || echo "null")
  bp=$(parse_json "$response" "['lighthouseResult']['categories']['best-practices']['score']" 2>/dev/null || echo "null")

  # Core Web Vitals (display values)
  lcp=$(parse_json "$response" "['lighthouseResult']['audits']['largest-contentful-paint']['displayValue']" 2>/dev/null || echo "N/A")
  cls=$(parse_json "$response" "['lighthouseResult']['audits']['cumulative-layout-shift']['displayValue']" 2>/dev/null || echo "N/A")
  inp=$(parse_json "$response" "['lighthouseResult']['audits']['interaction-to-next-paint']['displayValue']" 2>/dev/null || echo "N/A")
  fcp=$(parse_json "$response" "['lighthouseResult']['audits']['first-contentful-paint']['displayValue']" 2>/dev/null || echo "N/A")

  # Convert 0.0–1.0 scores to integers
  to_int() {
    local val="$1"
    if [ "$val" = "null" ] || [ -z "$val" ]; then echo "0"; return; fi
    python3 -c "print(int(float('$val') * 100))" 2>/dev/null \
      || node -e "console.log(Math.round(parseFloat('$val') * 100));" 2>/dev/null \
      || echo "0"
  }

  local perf_int seo_int access_int bp_int
  perf_int=$(to_int "$perf")
  seo_int=$(to_int "$seo")
  access_int=$(to_int "$access")
  bp_int=$(to_int "$bp")

  # ── Score evaluation helper ─────────────────────────────────────────────────
  check_score() {
    local name="$1"
    local score="$2"
    local threshold="$3"
    if [ "$score" -ge "$threshold" ] 2>/dev/null; then
      echo -e "  ${GREEN}✓${RESET} ${name}: ${GREEN}${score}${RESET} (≥${threshold})"
    else
      echo -e "  ${RED}✗${RESET} ${name}: ${RED}${score}${RESET} (required ≥${threshold})"
      OVERALL_PASS=false
    fi
  }

  check_score "Performance    " "$perf_int"   "$THRESHOLD_PERFORMANCE"
  check_score "SEO            " "$seo_int"    "$THRESHOLD_SEO"
  check_score "Accessibility  " "$access_int" "$THRESHOLD_ACCESSIBILITY"
  check_score "Best Practices " "$bp_int"     "$THRESHOLD_BEST_PRACTICES"

  echo ""
  echo -e "  ${BOLD}Core Web Vitals:${RESET}"
  echo -e "    LCP: ${YELLOW}${lcp}${RESET}  (target < 2.5s)"
  echo -e "    CLS: ${YELLOW}${cls}${RESET}  (target < 0.1)"
  echo -e "    INP: ${YELLOW}${inp}${RESET}  (target < 200ms)"
  echo -e "    FCP: ${YELLOW}${fcp}${RESET}  (target < 1.8s)"
  echo ""
}

# Run both strategies
run_audit "mobile"
run_audit "desktop"

# ── Final verdict ─────────────────────────────────────────────────────────────
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
if [ "$OVERALL_PASS" = true ]; then
  echo -e "  ${GREEN}${BOLD}✓ PASS — All Lighthouse thresholds met${RESET}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo ""
  exit 0
else
  echo -e "  ${RED}${BOLD}✗ FAIL — One or more categories below threshold${RESET}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo ""
  exit 1
fi
