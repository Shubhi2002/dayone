#!/usr/bin/env node
import { EventShipper } from "./shipper.js";
import { makeEvent } from "./emit.js";

/**
 * Entry point run inside the sandbox: `dayone-runtime bootstrap`.
 * V0 skeleton: registers, heartbeats, and runs the snapshotter loop. Shell hooks and the extension socket are wired in CP2.
 */
async function main(): Promise<void> {
  const sessionId = process.env["DAYONE_SESSION_ID"];
  const token = process.env["DAYONE_INGEST_TOKEN"];
  const apiUrl = process.env["DAYONE_API_URL"];
  if (!sessionId || !token || !apiUrl) { console.error("DAYONE_SESSION_ID, DAYONE_INGEST_TOKEN and DAYONE_API_URL are required"); process.exit(2); }
  const shipper = new EventShipper({ apiUrl, token });
  const started = Date.now();
  shipper.push(makeEvent(sessionId, "runtime", "runtime.registered", { runtimeVersion: "0.0.1", editor: "openvscode", agent: process.env["DAYONE_AGENT"] ?? "unknown" }));
  setInterval(() => shipper.push(makeEvent(sessionId, "runtime", "runtime.heartbeat", { uptimeMs: Date.now() - started })), 15_000);
  // TODO(CP2): snapshotter (git commit to refs/dayone/snapshots every 30 s), shell hooks, local socket for the extension.
  const stop = async () => { await shipper.flush(); process.exit(0); };
  process.on("SIGTERM", () => void stop()); process.on("SIGINT", () => void stop());
}
main().catch((e) => { console.error(e); process.exit(1); });
