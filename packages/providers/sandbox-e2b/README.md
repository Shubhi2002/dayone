# @dayone/sandbox-e2b

`SandboxProvider` for [E2B](https://e2b.dev) Firecracker microVMs.

- Templates are built with the E2B CLI from `templates/` (one per toolchain, e.g. `dayone-base`, `dayone-node-22`, `dayone-java-21`). A template bakes in OpenVSCode Server, Node, git, the Dayone extension VSIX and the runtime.
- `exposeUrl` uses the sandbox host for a port; the IDE proxy fronts it.
- Egress: enforced via the template's network policy where supported; the provider reports `egressPolicy` accordingly.
- Never pass vendor keys in `SandboxSpec.env`; only per-session tokens.

Status: skeleton. Method bodies call the SDK where the shape is known and are marked TODO where a spike must confirm behaviour (pause/resume, snapshots).
