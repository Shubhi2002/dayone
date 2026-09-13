import type { Company, CompanyUser, CompanyUserId, InterviewLink, LinkId, Problem, ProblemId, Report, Session, SessionId, TraceEvent } from "@dayone/core";

export interface SessionRepository {
  save(session: Session): Promise<void>;
  get(id: SessionId): Promise<Session | null>;
  listByCompany(companyId: string, limit?: number): Promise<Session[]>;
}
export interface LinkRepository {
  save(link: InterviewLink): Promise<void>;
  get(id: LinkId): Promise<InterviewLink | null>;
}
export interface ProblemRepository {
  list(): Promise<Problem[]>;
  get(id: ProblemId): Promise<Problem | null>;
  upsert(problem: Problem): Promise<void>;
}
export interface CompanyRepository {
  get(id: string): Promise<Company | null>;
  getUser(id: CompanyUserId): Promise<CompanyUser | null>;
}
export interface ReportRepository {
  save(report: Report): Promise<void>;
  getBySession(sessionId: SessionId): Promise<Report | null>;
}
export interface TraceStore {
  append(events: TraceEvent[]): Promise<void>;
  read(sessionId: SessionId, opts?: { after?: string; limit?: number }): Promise<TraceEvent[]>;
  count(sessionId: SessionId): Promise<number>;
}
export interface SnapshotStore {
  put(sessionId: SessionId, ref: string, tarGz: Uint8Array): Promise<void>;
  get(sessionId: SessionId, ref: string): Promise<Uint8Array | null>;
  list(sessionId: SessionId): Promise<string[]>;
}
export interface BlobStore {
  put(key: string, data: Uint8Array, contentType?: string): Promise<string>;
  get(key: string): Promise<Uint8Array | null>;
}
