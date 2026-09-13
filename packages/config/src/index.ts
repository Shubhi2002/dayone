import { z } from "zod";

const csv = z.string().transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean));

export const ConfigSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().default(4000),
  PUBLIC_BASE_URL: z.string().url().default("http://localhost:4000"),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  OBJECT_STORAGE_BUCKET: z.string().default("dayone-dev"),
  TOKEN_SIGNING_SECRET: z.string().min(8).default("dev-only-change-me"),

  SANDBOX_PROVIDER: z.enum(["local", "e2b"]).default("local"),
  EDITOR_PROVIDER: z.enum(["openvscode"]).default("openvscode"),
  AGENT_PROVIDERS: csv.default("claude-code,codex"),
  SCM_PROVIDER: z.enum(["github"]).default("github"),

  E2B_API_KEY: z.string().optional(),
  E2B_DEFAULT_TEMPLATE: z.string().default("dayone-base"),

  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  AGENT_GATEWAY_BASE_URL: z.string().url().default("http://localhost:4000/gateway"),

  GITHUB_TOKEN: z.string().optional(),
});
export type Config = z.infer<typeof ConfigSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = ConfigSchema.safeParse(env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid configuration: ${issues}`);
  }
  return parsed.data;
}
