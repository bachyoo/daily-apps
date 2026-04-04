#!/bin/bash
set -euo pipefail

# === Configuration ===
HUB_APPS_DIR="apps/hub/app/apps"
TEMPLATE="templates/page-template.tsx"
REGISTRY="apps/hub/data/apps.json"

# === Colors ===
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

error() { echo -e "${RED}Error: $1${NC}" >&2; exit 1; }
info() { echo -e "${GREEN}$1${NC}"; }
warn() { echo -e "${YELLOW}$1${NC}"; }

# === Get next day number ===
get_next_day() {
  local max=0
  for dir in "$HUB_APPS_DIR"/day-*/; do
    if [ -d "$dir" ]; then
      num=$(basename "$dir" | sed 's/day-\([0-9]*\).*/\1/' | sed 's/^0*//')
      num=${num:-0}
      if [ "$num" -gt "$max" ]; then
        max=$num
      fi
    fi
  done
  printf "%03d" $((max + 1))
}

# === Validate app ID ===
validate_app_id() {
  local id="$1"
  case "$id" in
    day-[0-9][0-9][0-9]-[a-z]*)
      # valid format
      ;;
    *)
      error "Invalid format. Use: day-XXX-name (e.g., day-001-timer)"
      ;;
  esac
}

# === Main ===
if [ $# -eq 0 ]; then
  NEXT_DAY=$(get_next_day)
  warn "No app ID provided. Next day number: $NEXT_DAY"
  echo "Usage: $0 day-${NEXT_DAY}-<name>"
  exit 1
fi

APP_ID="$1"
validate_app_id "$APP_ID"

APP_DIR="$HUB_APPS_DIR/$APP_ID"

if [ -d "$APP_DIR" ]; then
  error "Directory '$APP_DIR' already exists!"
fi

# Extract parts
DAY_NUM=$(echo "$APP_ID" | sed 's/day-\([0-9]*\).*/\1/' | sed 's/^0*//')
DAY_NUM=${DAY_NUM:-0}
APP_SLUG=$(echo "$APP_ID" | sed 's/^day-[0-9]*-//')
APP_NAME=$(echo "$APP_SLUG" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')

info "Creating app: $APP_ID"
info "  Name: $APP_NAME"
info "  Day: $DAY_NUM"

# Create directory and copy template
mkdir -p "$APP_DIR"
cp "$TEMPLATE" "$APP_DIR/page.tsx"

# Replace placeholders (portable sed for macOS and Linux)
if [ "$(uname)" = "Darwin" ]; then
  sed -i '' "s/__APP_NAME__/$APP_NAME/g" "$APP_DIR/page.tsx"
else
  sed -i "s/__APP_NAME__/$APP_NAME/g" "$APP_DIR/page.tsx"
fi

# Update app registry
TODAY=$(date +%Y-%m-%d)

if [ ! -f "$REGISTRY" ] || [ ! -s "$REGISTRY" ]; then
  echo "[]" > "$REGISTRY"
fi

python3 -c "
import json
with open('$REGISTRY', 'r') as f:
    apps = json.load(f)
apps.append({
    'id': '$APP_ID',
    'name': '$APP_NAME',
    'description': '새로운 앱',
    'category': 'utility',
    'day': int('$DAY_NUM'),
    'date': '$TODAY',
    'thumbnail': '/thumbnails/placeholder.png',
    'path': '/apps/$APP_ID'
})
with open('$REGISTRY', 'w') as f:
    json.dump(apps, f, ensure_ascii=False, indent=2)
"

info ""
info "✅ App created: $APP_DIR/page.tsx"
info ""
info "Next steps:"
info "  1. Edit $APP_DIR/page.tsx"
info "  2. pnpm dev"
info "  3. Open http://localhost:3000/apps/$APP_ID"
info "  4. git add . && git commit -m 'feat($APP_ID): add $APP_NAME'"
info "  5. git push"
