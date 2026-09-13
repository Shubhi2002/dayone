import type { ScmProviderId } from "@dayone/core";
import type { ProviderDescriptor } from "./descriptor.js";

export interface ScmCapabilities { privateRepos: boolean; pinnedRefs: boolean; }
export interface RepoRef { url: string; ref: string; }
/** A fetched repository as an archive the orchestrator can upload into a sandbox after stripping hidden content. */
export interface RepoArchive { ref: RepoRef; resolvedSha: string; tarGz: Uint8Array; }

export interface ScmProvider {
  descriptor: ProviderDescriptor<ScmProviderId, ScmCapabilities>;
  fetch(ref: RepoRef): Promise<RepoArchive>;
  resolveRef(ref: RepoRef): Promise<string>;
}
