# @dayone/agent-claude-code

`AgentProvider` (kind `ide-extension`) for **Claude Code** inside OpenVSCode Server.

Configured through `ANTHROPIC_BASE_URL` (the agent gateway) and a per-session virtual key in `ANTHROPIC_API_KEY`. Transcripts are read from `~/.claude/projects/**/*.jsonl` at session end. Confirm the extension honours a custom base URL during the CP0 spike; if not, route via a sandbox-local proxy.
