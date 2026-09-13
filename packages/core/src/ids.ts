/** Branded string ids. Construct only through the `asXxxId` helpers so raw strings never cross layers. */
declare const brand: unique symbol;
export type Brand<T, B extends string> = T & { readonly [brand]: B };

export type CompanyId = Brand<string, "CompanyId">;
export type CompanyUserId = Brand<string, "CompanyUserId">;
export type ProblemId = Brand<string, "ProblemId">;
export type LinkId = Brand<string, "LinkId">;
export type SessionId = Brand<string, "SessionId">;
export type SandboxId = Brand<string, "SandboxId">;
export type EventId = Brand<string, "EventId">;
export type SnapshotId = Brand<string, "SnapshotId">;
export type ReportId = Brand<string, "ReportId">;

/** Provider ids are stable, lower-kebab strings registered in the composition root. */
export type SandboxProviderId = Brand<string, "SandboxProviderId">;
export type EditorProviderId = Brand<string, "EditorProviderId">;
export type AgentProviderId = Brand<string, "AgentProviderId">;
export type ScmProviderId = Brand<string, "ScmProviderId">;

const idPattern = /^[A-Za-z0-9_-]{1,128}$/;
function assertId(value: string, kind: string): void {
  if (!idPattern.test(value)) throw new Error(`Invalid ${kind}: ${JSON.stringify(value)}`);
}
export const asCompanyId = (v: string): CompanyId => (assertId(v, "CompanyId"), v as CompanyId);
export const asCompanyUserId = (v: string): CompanyUserId => (assertId(v, "CompanyUserId"), v as CompanyUserId);
export const asProblemId = (v: string): ProblemId => (assertId(v, "ProblemId"), v as ProblemId);
export const asLinkId = (v: string): LinkId => (assertId(v, "LinkId"), v as LinkId);
export const asSessionId = (v: string): SessionId => (assertId(v, "SessionId"), v as SessionId);
export const asSandboxId = (v: string): SandboxId => (assertId(v, "SandboxId"), v as SandboxId);
export const asEventId = (v: string): EventId => (assertId(v, "EventId"), v as EventId);
export const asSnapshotId = (v: string): SnapshotId => (assertId(v, "SnapshotId"), v as SnapshotId);
export const asReportId = (v: string): ReportId => (assertId(v, "ReportId"), v as ReportId);
export const asSandboxProviderId = (v: string): SandboxProviderId => (assertId(v, "SandboxProviderId"), v as SandboxProviderId);
export const asEditorProviderId = (v: string): EditorProviderId => (assertId(v, "EditorProviderId"), v as EditorProviderId);
export const asAgentProviderId = (v: string): AgentProviderId => (assertId(v, "AgentProviderId"), v as AgentProviderId);
export const asScmProviderId = (v: string): ScmProviderId => (assertId(v, "ScmProviderId"), v as ScmProviderId);
