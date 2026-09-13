import type { Company, CompanyUser, CompanyUserId, InterviewLink, LinkId, Problem, ProblemId, Report, Session, SessionId } from "@dayone/core";
import type { CompanyRepository, LinkRepository, ProblemRepository, ReportRepository, SessionRepository } from "@dayone/ports";

export class InMemorySessionRepository implements SessionRepository {
  private readonly m = new Map<SessionId, Session>();
  async save(s: Session): Promise<void> { this.m.set(s.id, s); }
  async get(id: SessionId): Promise<Session | null> { return this.m.get(id) ?? null; }
  async listByCompany(companyId: string, limit = 100): Promise<Session[]> {
    return [...this.m.values()].filter((s) => s.snapshot().companyId === companyId).slice(0, limit);
  }
}
export class InMemoryLinkRepository implements LinkRepository {
  private readonly m = new Map<LinkId, InterviewLink>();
  async save(l: InterviewLink): Promise<void> { this.m.set(l.id, l); }
  async get(id: LinkId): Promise<InterviewLink | null> { return this.m.get(id) ?? null; }
}
export class InMemoryProblemRepository implements ProblemRepository {
  private readonly m = new Map<ProblemId, Problem>();
  async list(): Promise<Problem[]> { return [...this.m.values()]; }
  async get(id: ProblemId): Promise<Problem | null> { return this.m.get(id) ?? null; }
  async upsert(p: Problem): Promise<void> { this.m.set(p.id, p); }
}
export class InMemoryCompanyRepository implements CompanyRepository {
  constructor(private readonly companies: Company[] = [], private readonly users: CompanyUser[] = []) {}
  async get(id: string): Promise<Company | null> { return this.companies.find((c) => c.id === id) ?? null; }
  async getUser(id: CompanyUserId): Promise<CompanyUser | null> { return this.users.find((u) => u.id === id) ?? null; }
}
export class InMemoryReportRepository implements ReportRepository {
  private readonly m = new Map<SessionId, Report>();
  async save(r: Report): Promise<void> { this.m.set(r.sessionId, r); }
  async getBySession(id: SessionId): Promise<Report | null> { return this.m.get(id) ?? null; }
}
