import { HIDDEN_DIR } from "./schema.js";

/** Given a list of repo-relative paths, return those safe to ship to a candidate sandbox. */
export function candidateVisiblePaths(paths: string[]): string[] {
  return paths.filter((p) => !isHiddenPath(p));
}
export function isHiddenPath(path: string): boolean {
  const norm = path.replace(/^\.\//, "");
  return norm === HIDDEN_DIR || norm.startsWith(HIDDEN_DIR + "/");
}
