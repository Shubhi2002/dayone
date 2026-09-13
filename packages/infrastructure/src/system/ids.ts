import { randomBytes } from "node:crypto";
import type { IdGenerator } from "@dayone/ports";

/** ULID-like: time-ordered, URL-safe. Good enough for ids and connection tokens; not for secrets needing high entropy. */
export class UlidGenerator implements IdGenerator {
  next(): string {
    const time = Date.now().toString(32).padStart(9, "0");
    const rand = randomBytes(10).toString("hex");
    return `${time}${rand}`;
  }
}
