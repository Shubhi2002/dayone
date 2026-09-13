import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { IngestEvents } from "@dayone/application";
import type { Container } from "../container.js";

/** Runtime → control plane. Authenticated by the per-session sandbox token in the Authorization header. */
export async function registerSandboxRoutes(app: FastifyInstance, c: Container): Promise<void> {
  app.post("/v1/sandbox/events", { bodyLimit: 5 * 1024 * 1024 }, async (req) => {
    const auth = String(req.headers.authorization ?? "");
    const sandboxToken = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const body = z.object({ events: z.array(z.unknown()).max(500) }).parse(req.body);
    return new IngestEvents(c).execute({ sandboxToken, events: body.events });
  });
}
