#!/usr/bin/env bash
set -euo pipefail

# bootstrap-and-install-agentd.sh
# Installs Go locally (no sudo / no Homebrew) if missing, then builds &
# installs obarker94/agentd and merges its OpenCode MCP config. Re-runnable.

REPO_URL="https://github.com/obarker94/agentd.git"
SRC_DIR="$HOME/Documents/GitHub/agentd"
BIN_DIR="$HOME/.local/bin"
GO_ROOT="$HOME/.local/go"
DB_DIR="$HOME/.agentd"
OC_DIR="$HOME/.config/opencode"
OC_JSON="$OC_DIR/opencode.json"

export PATH="$GO_ROOT/bin:$BIN_DIR:$PATH"

# --- Xcode Command Line Tools (needed for cgo / SQLite) --------------------
if ! xcode-select -p >/dev/null 2>&1; then
  echo "Xcode Command Line Tools are required (C compiler for SQLite)."
  echo "A dialog will pop up — click Install, let it finish, then re-run this script."
  xcode-select --install || true
  exit 1
fi
echo "==> cc: $(cc --version | head -1)"

# --- Go toolchain ----------------------------------------------------------
if ! command -v go >/dev/null 2>&1; then
  echo "==> Installing Go locally into $GO_ROOT (no sudo)"
  case "$(uname -m)" in
    arm64)  GOARCH=arm64 ;;
    x86_64) GOARCH=amd64 ;;
    *) echo "Unsupported arch $(uname -m)"; exit 1 ;;
  esac
  GOVER="$(curl -fsSL 'https://go.dev/VERSION?m=text' | head -1)"
  echo "    latest stable: $GOVER ($GOARCH)"
  curl -fsSL "https://go.dev/dl/${GOVER}.darwin-${GOARCH}.tar.gz" -o /tmp/go.tar.gz
  rm -rf "$GO_ROOT"; mkdir -p "$HOME/.local"
  tar -C "$HOME/.local" -xzf /tmp/go.tar.gz   # extracts to ~/.local/go
fi
echo "==> go: $(go version)"
# agentd pins Go 1.26.1 in go.mod; this lets the build auto-fetch it if needed.
export GOTOOLCHAIN=auto

# --- Source ----------------------------------------------------------------
echo "==> Getting source -> $SRC_DIR"
if [ -d "$SRC_DIR/.git" ]; then
  git -C "$SRC_DIR" pull --ff-only
else
  mkdir -p "$(dirname "$SRC_DIR")"
  git clone "$REPO_URL" "$SRC_DIR"
fi

# --- Build & install -------------------------------------------------------
echo "==> Building (cgo enabled; may fetch Go 1.26.1 toolchain first)"
cd "$SRC_DIR"
CGO_ENABLED=1 go build -o agentd ./cmd/agentd
mkdir -p "$BIN_DIR"
cp agentd "$BIN_DIR/agentd"
echo "==> Installed -> $BIN_DIR/agentd"
mkdir -p "$DB_DIR"

# --- OpenCode MCP config (safe merge) --------------------------------------
echo "==> Merging OpenCode config -> $OC_JSON"
mkdir -p "$OC_DIR"
[ -f "$OC_JSON" ] || echo '{}' > "$OC_JSON"
python3 - "$OC_JSON" <<'PY'
import json, sys, os
p = sys.argv[1]
try:
    cfg = json.load(open(p)) or {}
except Exception:
    cfg = {}
cfg.setdefault("mcp", {})
cfg["mcp"]["agentd"] = {
    "type": "local",
    "command": ["agentd"],
    "env": {"AGENTD_DB_PATH": os.path.expanduser("~/.agentd/agentd.db")},
}
json.dump(cfg, open(p, "w"), indent=2); open(p, "a").write("\n")
print("    config written")
PY

# --- Persist PATH ----------------------------------------------------------
ZRC="$HOME/.zshrc"
LINE='export PATH="$HOME/.local/go/bin:$HOME/.local/bin:$PATH"'
if ! grep -qsF "$LINE" "$ZRC" 2>/dev/null; then
  { echo ""; echo "# added by agentd installer"; echo "$LINE"; } >> "$ZRC"
  echo "==> Added Go + ~/.local/bin to PATH in ~/.zshrc"
fi

echo ""
echo "==> Done. Open a new terminal (or: source ~/.zshrc), then verify:"
echo "    which agentd && agentd --help 2>&1 | head"
