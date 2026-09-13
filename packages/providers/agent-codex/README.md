# @dayone/agent-codex

`AgentProvider` (kind `ide-extension`) for **OpenAI Codex** inside OpenVSCode Server.

Configured through `OPENAI_BASE_URL` (the agent gateway) and a per-session virtual key in `OPENAI_API_KEY`. Transcripts are read from `~/.codex/sessions/**/*.jsonl` at session end. Extension id and settings keys must be confirmed against the current marketplace listing during the CP0 spike.
