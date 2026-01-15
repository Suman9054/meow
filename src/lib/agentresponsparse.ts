
import { AgentComand } from "./type/agentresponstype";

class AgentResponseParser {
  private buffer = "";

  parse(chunk: string): AgentComand[] {
    this.buffer += chunk;
    const commands: AgentComand[] = [];

    const regex =
      /<(makef|writf|exe)(?:\s+path="([^"]+)")?\s*>([\s\S]*?)<\/\1>|<makef(?:\s+path="([^"]+)")?\s*\/>/g;

    let match: RegExpExecArray | null;
    let lastConsumedIndex = 0;

    while ((match = regex.exec(this.buffer)) !== null) {
      lastConsumedIndex = regex.lastIndex;

      const tag = match[1] || "makef";
      const path = match[2] || match[4] || "";
      const content = match[3]?.trim() ?? "";

      if (tag === "makef") {
        commands.push({ type: "makef", path });
      }

      if (tag === "writf") {
        commands.push({ type: "writf", path, content });
      }

      if (tag === "exe") {
        commands.push({ type: "exe", command: content });
      }
    }

    // 🔥 CRITICAL: remove parsed content
    if (lastConsumedIndex > 0) {
      this.buffer = this.buffer.slice(lastConsumedIndex);
    }

    return commands;
  }
}

export default AgentResponseParser;

