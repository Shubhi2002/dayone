export interface Clock { now(): Date; }
export interface IdGenerator { next(): string; }
export interface TokenSigner {
  sign(payload: Record<string, unknown>, ttlSeconds: number): Promise<string>;
  verify(token: string): Promise<Record<string, unknown> | null>;
}
export interface Mailer { send(to: string, subject: string, text: string): Promise<void>; }
export interface Logger {
  info(msg: string, ctx?: Record<string, unknown>): void;
  warn(msg: string, ctx?: Record<string, unknown>): void;
  error(msg: string, ctx?: Record<string, unknown>): void;
}
