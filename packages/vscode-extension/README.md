# Dayone Trace (VS Code extension)

Installed in every candidate sandbox. Emits `file.changed` (with a source heuristic), `file.saved`, `editor.focus`, `terminal.command` (via shell integration) and `tests.ran` to the local runtime, which ships them to the control plane. Never reads secrets, never records screen or keystroke timing beyond event timestamps.
