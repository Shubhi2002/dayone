import type { CompanyId, CompanyUserId } from "./ids.js";
export interface Company { id: CompanyId; name: string; createdAt: Date; }
export type CompanyRole = "owner" | "hiring-manager" | "recruiter" | "reviewer";
export interface CompanyUser { id: CompanyUserId; companyId: CompanyId; email: string; role: CompanyRole; }
