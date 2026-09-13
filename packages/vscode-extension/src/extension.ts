import * as vscode from "vscode";
import { createHash } from "node:crypto";

/**
 * Dayone trace extension. Keeps a small in-memory buffer and posts to the local runtime socket.
 * Source heuristic: many characters changing in one event while a known agent view is focused → "agent-suspected".
 */
const AGENT_VIEW_HINTS = ["claude", "codex", "chat", "copilot"];

export function activate(context: vscode.ExtensionContext): void {
  const cfg = vscode.workspace.getConfiguration("dayone");
  const sessionId = cfg.get<string>("sessionId") ?? process.env["DAYONE_SESSION_ID"] ?? "unknown";
  let agentPanelActive = false;

  const post = (type: string, payload: unknown) => {
    const event = { schemaVersion: 1, id: `${Date.now().toString(32)}${Math.random().toString(16).slice(2, 12)}`, sessionId, at: new Date().toISOString(), source: "extension", type, payload };
    // TODO(CP2): send over the runtime's local socket; for now append to a file the shipper tails.
    void vscode.workspace.fs.writeFile(vscode.Uri.file(`/tmp/dayone-events/${event.id}.json`), Buffer.from(JSON.stringify(event)));
  };

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((e) => { agentPanelActive = false; post("editor.focus", { path: e?.document.uri.fsPath }); }),
    vscode.window.onDidChangeWindowState(() => { /* no-op; focus loss is recorded, never blocked */ }),
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.scheme !== "file") return;
      const total = e.contentChanges.reduce((n, c) => n + c.text.length + c.rangeLength, 0);
      const bigProgrammatic = e.contentChanges.some((c) => c.text.includes("\n") && c.text.length > 120);
      const sourceHint = bigProgrammatic && agentPanelActive ? "agent-suspected" : bigProgrammatic ? "unknown" : "human";
      const first = e.contentChanges[0];
      post("file.changed", {
        path: vscode.workspace.asRelativePath(e.document.uri), textLength: total,
        contentHash: createHash("sha256").update(e.document.getText()).digest("hex").slice(0, 32), sourceHint,
        range: first ? { startLine: first.range.start.line, endLine: first.range.end.line } : undefined,
      });
    }),
    vscode.workspace.onDidSaveTextDocument((d) => post("file.saved", { path: vscode.workspace.asRelativePath(d.uri), contentHash: createHash("sha256").update(d.getText()).digest("hex").slice(0, 32) })),
    vscode.window.onDidStartTerminalShellExecution?.((e) => {
      const started = Date.now();
      void e.execution.read; // stream consumed by the runtime shell hook instead
      post("terminal.command", { command: redact(e.execution.commandLine.value), cwd: e.execution.cwd?.fsPath ?? "", exitCode: null, durationMs: Date.now() - started });
    }) ?? { dispose() {} },
  );
  // Track whether an agent view is focused, to feed the source heuristic.
  context.subscriptions.push(vscode.window.onDidChangeVisibleTextEditors(() => { agentPanelActive = false; }));
  for (const hint of AGENT_VIEW_HINTS) {
    context.subscriptions.push(vscode.commands.registerCommand(`dayone.internal.agentFocus.${hint}`, () => { agentPanelActive = true; }));
  }
}

export function deactivate(): void { /* nothing to clean up */ }

function redact(cmd: string): string {
  return cmd.replace(/(sk-[A-Za-z0-9_-]{8,}|dk_[A-Za-z0-9_-]{8,}|ghp_[A-Za-z0-9]{8,})/g, "<redacted>");
}
