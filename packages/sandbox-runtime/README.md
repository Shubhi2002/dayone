# @dayone/sandbox-runtime

Runs **inside** the sandbox VM. Started by the orchestrator after the editor is up.

- `bootstrap`: registers with the control plane, starts the shipper, snapshotter and shell hooks.
- `shipper`: batches events from the local socket/file into `POST /v1/sandbox/events` with the per-session ingest token.
- `snapshotter`: `git commit` to a hidden branch every 30 s and on save bursts; emits `snapshot.taken`.
- `shell`: installs a `PROMPT_COMMAND` hook and a test shim that emit `terminal.command` and `tests.ran`.

Environment: `DAYONE_SESSION_ID`, `DAYONE_INGEST_TOKEN`, `DAYONE_API_URL`. No vendor keys.
