import type { Logger } from "@dayone/ports";
export class ConsoleLogger implements Logger {
  info(msg: string, ctx?: Record<string, unknown>): void { console.log(JSON.stringify({ level: "info", msg, ...ctx })); }
  warn(msg: string, ctx?: Record<string, unknown>): void { console.warn(JSON.stringify({ level: "warn", msg, ...ctx })); }
  error(msg: string, ctx?: Record<string, unknown>): void { console.error(JSON.stringify({ level: "error", msg, ...ctx })); }
}
