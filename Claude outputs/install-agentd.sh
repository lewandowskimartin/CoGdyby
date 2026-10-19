#!/usr/bin/env bash
set -euo pipefail

# install-agentd.sh — build & install obarker94/agentd on macOS
# Safe to re-run. Merges OpenCode config instead of overwriting it.

REPO_URL="https://github.com/obarker94/agentd.git"
SRC_DIR="$HOME/Documents/GitHub/agentd"
BIN_DIR="$HOME/.local/bin"
DB_DIR="$HOME/.agentd"
OC_DIR="$HOME/.config/opencode"
OC_JSON="$OC_DIR/opencode.json"

echo "==> Checking prerequisites"
if ! command -v go >/dev/null 2>&1; then
  echo "ERROR: Go is not installed. Install Go 1.26.1+ (brew install go, or https://go.dev/dl/) and re-run." >&2
  exit 1
fi
echo "    go: $(go version)"
if ! xcode-select -p >/dev/null 2>&1; then
  echo "ERROR: Xcode Command Line Tools missing (needed for cgo/SQLite). Run: xcode-select --install" >&2
  exit 1
fi
echo "    cc: $(cc --version | head -1)"

echo "==> Getting source -> $SRC_DIR"
if [ -d "$SRC_DIR/.git" ]; then
  git -C "$SRC_DIR" pull --ff-only
else
  mkdir -p "$(dirname "$SRC_DIR")"
  git clone "$REPO_URL" "$SRC_DIR"
fi

echo "==> Building (cgo enabled)"
cd "$SRC_DIR"
CGO_ENABLED=1 go build -o agentd ./cmd/agentd

echo "==> Installing binary -> $BIN_DIR/agentd"
mkdir -p "$BIN_DIR"
cp agentd "$BIN_DIR/agentd"

echo "==> Creating DB dir -> $DB_DIR"
mkdir -p "$DB_DIR"

echo "==> Merging OpenCode MCP config -> $OC_JSON"
mkdir -p "$OC_DIR"
[ -f "$OC_JSON" ] || echo '{}' > "$OC_JSON"
python3 - "$OC_JSON" <<'PY'
import json, sys, os
p = sys.argv[1]
try:
    with open(p) as f:
        cfg = json.load(f) or {}
except Exception:
    cfg = {}
cfg.setdefault("mcp", {})
cfg["mcp"]["agentd"] = {
    "type": "local",
    "command": ["agentd"],
    "env": {"AGENTD_DB_PATH": os.path.expanduser("~/.agentd/agentd.db")}
}
with open(p, "w") as f:
    json.dump(cfg, f, indent=2)
    f.write("\n")
print("    config written")
PY

echo "==> PATH check"
case ":$PATH:" in
  *":$BIN_DIR:"*) echo "    $BIN_DIR already on PATH";;
  *) echo "    NOTE: $BIN_DIR is NOT on your PATH. Add this to ~/.zshrc:"
     echo '        export PATH="$HOME/.local/bin:$PATH"';;
esac

echo "==> Done. Verify with:"
echo "    which agentd && agentd --help 2>&1 | head"
