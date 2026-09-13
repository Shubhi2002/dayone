import { asScmProviderId, ProviderError } from "@dayone/core";
import type { RepoArchive, RepoRef, ScmProvider } from "@dayone/ports";

export const GITHUB_SCM_ID = asScmProviderId("github");
export interface GithubScmConfig { token?: string; apiBase?: string; }

export function createGithubScmProvider(cfg: GithubScmConfig = {}): ScmProvider {
  const api = cfg.apiBase ?? "https://api.github.com";
  const headers: Record<string, string> = { "user-agent": "dayone", accept: "application/vnd.github+json", ...(cfg.token ? { authorization: `Bearer ${cfg.token}` } : {}) };
  const parse = (url: string) => {
    const m = /github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?/.exec(url);
    if (!m) throw new ProviderError(`Not a GitHub URL: ${url}`);
    return { owner: m[1]!, repo: m[2]! };
  };
  return {
    descriptor: { id: GITHUB_SCM_ID, displayName: "GitHub", capabilities: { privateRepos: Boolean(cfg.token), pinnedRefs: true } },
    async resolveRef(ref: RepoRef): Promise<string> {
      const { owner, repo } = parse(ref.url);
      const r = await fetch(`${api}/repos/${owner}/${repo}/commits/${encodeURIComponent(ref.ref)}`, { headers });
      if (!r.ok) throw new ProviderError(`Cannot resolve ${ref.ref}: ${r.status}`);
      return ((await r.json()) as { sha: string }).sha;
    },
    async fetch(ref: RepoRef): Promise<RepoArchive> {
      const { owner, repo } = parse(ref.url);
      const sha = await this.resolveRef(ref);
      const r = await fetch(`${api}/repos/${owner}/${repo}/tarball/${sha}`, { headers, redirect: "follow" });
      if (!r.ok) throw new ProviderError(`Cannot download tarball: ${r.status}`);
      return { ref, resolvedSha: sha, tarGz: new Uint8Array(await r.arrayBuffer()) };
    },
  };
}
