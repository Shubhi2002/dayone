import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";
import type { Problem } from "@dayone/core";
import { asAgentProviderId, asProblemId } from "@dayone/core";
import { ProblemManifestSchema, type ProblemManifest } from "./schema.js";

export interface LoadedProblem { manifest: ProblemManifest; ticketMarkdown: string; dir: string; }

async function exists(p: string): Promise<boolean> { try { await stat(p); return true; } catch { return false; } }

/** Reads and validates `.dayone/problem.yaml` and its referenced files. Throws with a readable message. */
export async function loadProblem(dir: string): Promise<LoadedProblem> {
  const manifestPath = join(dir, ".dayone", "problem.yaml");
  const raw = parse(await readFile(manifestPath, "utf8")) as unknown;
  const manifest = ProblemManifestSchema.parse(raw);
  const required = [".dayone/ticket.md", manifest.sandbox.setup, manifest.tests.graded, ".dayone/hidden/rubric.yaml", ".dayone/hidden/truth.md"];
  for (const rel of required) {
    if (!(await exists(join(dir, rel)))) throw new Error(`Problem ${manifest.id} is missing ${rel}`);
  }
  for (const v of manifest.variants.pool) {
    if (!(await exists(join(dir, ".dayone", "variants", v)))) throw new Error(`Variant folder missing: ${v}`);
  }
  const ticketMarkdown = await readFile(join(dir, ".dayone", "ticket.md"), "utf8");
  return { manifest, ticketMarkdown, dir };
}

/** Map a manifest to the platform's `Problem` entity. */
export function toProblem(m: ProblemManifest, repo: { url: string; ref: string }): Problem {
  return {
    id: asProblemId(m.id), title: m.title, summary: m.summary, mode: m.mode, level: m.level, stack: m.stack,
    timeBudgetMinutes: m.timeBudgetMinutes, repo,
    sandbox: { template: m.sandbox.template, vcpu: m.sandbox.size.vcpu, memoryMb: m.sandbox.size.memoryMb, ports: m.sandbox.ports, egress: m.sandbox.egress },
    agents: { allowedDefault: m.agents.allowedDefault.map(asAgentProviderId), budgetMinor: Math.round(m.agents.budgetUsd * 100) },
    variants: m.variants.pool,
    dimensions: { primary: m.dimensions.primary as Problem["dimensions"]["primary"], secondary: m.dimensions.secondary as Problem["dimensions"]["secondary"] },
  };
}
