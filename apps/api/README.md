# apps/api

HTTP API and composition root. Routes validate input with Zod and call exactly one use case. Provider wiring lives in `src/container.ts` and is driven by `@dayone/config`.

Route groups: `/v1/company/*` (console), `/v1/candidate/*` (shell), `/v1/sandbox/*` (runtime, sandbox token), `/gateway/*` (agent gateway proxy), `/health`.
