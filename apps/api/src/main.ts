import { loadConfig } from "@dayone/config";
import { buildContainer } from "./container.js";
import { buildServer } from "./server.js";

const config = loadConfig();
const container = buildContainer(config);
const app = await buildServer(container, config);
await app.listen({ port: config.PORT, host: "0.0.0.0" });
container.logger.info("api listening", { port: config.PORT, sandbox: config.SANDBOX_PROVIDER, agents: config.AGENT_PROVIDERS });
