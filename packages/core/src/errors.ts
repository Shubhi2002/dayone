/** Base class for all domain errors. Map to transport (HTTP) codes only in apps/*. */
export abstract class DomainError extends Error {
  abstract readonly code: string;
  constructor(message: string, readonly details?: Record<string, unknown>) {
    super(message);
    this.name = new.target.name;
  }
}
export class NotFoundError extends DomainError { readonly code = "not_found"; }
export class InvalidTransitionError extends DomainError { readonly code = "invalid_transition"; }
export class ValidationError extends DomainError { readonly code = "validation"; }
export class ForbiddenError extends DomainError { readonly code = "forbidden"; }
export class ConflictError extends DomainError { readonly code = "conflict"; }
export class ProviderError extends DomainError { readonly code = "provider"; }
export class BudgetExceededError extends DomainError { readonly code = "budget_exceeded"; }
