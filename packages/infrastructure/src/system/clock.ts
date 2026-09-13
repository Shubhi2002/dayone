import type { Clock } from "@dayone/ports";
export class SystemClock implements Clock { now(): Date { return new Date(); } }
export class FixedClock implements Clock { constructor(private t: Date) {} now(): Date { return this.t; } set(t: Date): void { this.t = t; } }
