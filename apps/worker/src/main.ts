import { loadConfig } from "@dayone/config";
import { buildContainer } from "@dayone/api";
import { handleJob } from "./jobs/index.js";

const config = loadConfig();
const c = buildContainer(config);
const ac = new AbortController();
process.on("SIGTERM", () => ac.abort()); process.on("SIGINT", () => ac.abort());
c.logger.info("worker started");
await c.queue.consume((job) => handleJob(c, job), ac.signal);
