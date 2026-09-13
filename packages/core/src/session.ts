import type { AgentProviderId, CompanyId, LinkId, ProblemId, SessionId } from "./ids.js";
import type { AgentSelection } from "./agent.js";
import type { SandboxHandle } from "./sandbox.js";
import { InvalidTransitionError, ValidationError } from "./errors.js";

export const SESSION_STATES = [
  "created", "agent_selected", "provisioning", "live", "paused",
  "submitted", "grading", "graded", "reported", "expired", "failed",
] as const;
export type SessionState = (typeof SESSION_STATES)[number];

const TRANSITIONS: Record<SessionState, readonly SessionState[]> = {
  created: ["agent_selected", "expired"],
  agent_selected: ["provisioning", "expired"],
  provisioning: ["live", "failed", "expired"],
  live: ["paused", "submitted", "expired", "failed"],
  paused: ["live", "submitted", "expired"],
  submitted: ["grading", "failed"],
  grading: ["graded", "failed"],
  graded: ["reported"],
  reported: [],
  expired: [],
  failed: [],
};

export interface SessionProps {
  id: SessionId;
  linkId: LinkId;
  companyId: CompanyId;
  problemId: ProblemId;
  problemRef: string;
  variant: string;
  allowedAgents: AgentProviderId[];
  timeBudgetMinutes: number;
  state: SessionState;
  agent: AgentSelection | null;
  sandbox: SandboxHandle | null;
  createdAt: Date;
  startedAt: Date | null;
  submittedAt: Date | null;
  failure: string | null;
}

/** Aggregate root. State changes only through `transition`; every transition yields a domain event. */
export class Session {
  private constructor(private props: SessionProps) {}

  static create(props: Omit<SessionProps, "state" | "agent" | "sandbox" | "startedAt" | "submittedAt" | "failure">): Session {
    if (props.allowedAgents.length === 0) throw new ValidationError("Session needs at least one allowed agent");
    return new Session({ ...props, state: "created", agent: null, sandbox: null, startedAt: null, submittedAt: null, failure: null });
  }
  static rehydrate(props: SessionProps): Session { return new Session({ ...props }); }

  get id(): SessionId { return this.props.id; }
  get state(): SessionState { return this.props.state; }
  snapshot(): Readonly<SessionProps> { return { ...this.props }; }

  canTransition(to: SessionState): boolean { return TRANSITIONS[this.props.state].includes(to); }

  transition(to: SessionState, now: Date): SessionTransitioned {
    if (!this.canTransition(to)) {
      throw new InvalidTransitionError(`Cannot move session from ${this.props.state} to ${to}`, { from: this.props.state, to });
    }
    const from = this.props.state;
    this.props.state = to;
    if (to === "live" && !this.props.startedAt) this.props.startedAt = now;
    if (to === "submitted") this.props.submittedAt = now;
    return { type: `session.${to}`, sessionId: this.props.id, from, to, at: now };
  }

  selectAgent(selection: AgentSelection, now: Date): SessionTransitioned {
    if (!this.props.allowedAgents.includes(selection.agent)) {
      throw new ValidationError("Agent is not in this session's allowed list", { agent: selection.agent });
    }
    this.props.agent = selection;
    return this.transition("agent_selected", now);
  }

  attachSandbox(handle: SandboxHandle): void {
    if (this.props.sandbox) throw new ValidationError("Session already has a sandbox");
    this.props.sandbox = handle;
  }

  fail(reason: string, now: Date): SessionTransitioned {
    this.props.failure = reason;
    return this.transition("failed", now);
  }

  /** Hard stop is 1.5x the budget; the budget itself is a guide shown to the candidate. */
  hardStopAt(): Date | null {
    if (!this.props.startedAt) return null;
    return new Date(this.props.startedAt.getTime() + this.props.timeBudgetMinutes * 1.5 * 60_000);
  }
}

export interface SessionTransitioned {
  type: `session.${SessionState}`;
  sessionId: SessionId;
  from: SessionState;
  to: SessionState;
  at: Date;
}
