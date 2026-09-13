import type { Job } from "@dayone/ports";
import { FinalizeSession, GradeSession, ProvisionSession } from "@dayone/application";
import type { Container } from "@dayone/api";

/** One handler per job name. Add new jobs to `JobPayloads` in ports first. */
export async function handleJob(c: Container, job: Job): Promise<void> {
  c.logger.info("job", { name: job.name, attempt: job.attempts });
  switch (job.name) {
    case "session.provision": await new ProvisionSession(c).execute(job.payload); return;
    case "session.finalize": await new FinalizeSession(c).execute(job.payload); return;
    case "session.grade": await new GradeSession(c).execute(job.payload); return;
    case "session.expire-check": /* TODO(CP1): expire sessions past hard stop and destroy sandboxes */ return;
    default: { const never: never = job; throw new Error(`Unhandled job ${String(never)}`); }
  }
}
