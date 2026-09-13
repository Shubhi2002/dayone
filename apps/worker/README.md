# apps/worker

Consumes typed jobs from the queue and runs the long-lived use cases: provisioning, finalisation, grading, expiry checks. Shares the composition root with the API (`@dayone/api` exports `buildContainer`). In production run it as its own process.
