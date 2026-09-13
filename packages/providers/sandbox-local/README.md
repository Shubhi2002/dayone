# @dayone/sandbox-local

`SandboxProvider` for local development: runs commands in a temp directory on the host. **Not isolated** (`vmIsolation: false`), so the orchestrator refuses candidate sessions on it; use it for unit tests and for developing the runtime without cloud credentials.
