import { z } from "zod";

export const ProblemManifestSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().regex(/^[a-z0-9][a-z0-9-]{2,63}$/),
  title: z.string().min(3),
  mode: z.enum(["build", "debug", "review"]),
  level: z.enum(["junior", "mid", "senior", "staff"]),
  stack: z.array(z.string()).min(1),
  timeBudgetMinutes: z.number().int().min(15).max(240),
  summary: z.string().min(10),
  sandbox: z.object({
    template: z.string(),
    size: z.object({ vcpu: z.number().int().min(1).max(8), memoryMb: z.number().int().min(512) }).default({ vcpu: 2, memoryMb: 4096 }),
    ports: z.array(z.number().int()).default([]),
    setup: z.string().default(".dayone/setup.sh"),
    egress: z.array(z.string()).default([]),
  }),
  tests: z.object({ visible: z.string(), graded: z.string().default(".dayone/hidden/tests") }),
  agents: z.object({ allowedDefault: z.array(z.string()).min(1), budgetUsd: z.number().positive().default(5) }),
  variants: z.object({ strategy: z.enum(["overlay", "none"]).default("none"), pool: z.array(z.string()).default([]) }).default({}),
  dimensions: z.object({
    primary: z.array(z.string()).min(1),
    secondary: z.array(z.string()).default([]),
  }),
});
export type ProblemManifest = z.infer<typeof ProblemManifestSchema>;

/** Paths inside a problem repo that must never reach a candidate sandbox. */
export const HIDDEN_DIR = ".dayone/hidden";
