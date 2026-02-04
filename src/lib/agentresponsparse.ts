import { AgentComand } from './type/agentresponstype'

class AgentResponseParser {
  private buffer = ''

  parse(chunk: string): AgentComand[] {
    this.buffer += chunk
    const commands: AgentComand[] = []

    const regex =
      /<(makef|writf|exe)(?:\s+path="([^"]+)")?\s*>([\s\S]*?)<\/\1>|<makef(?:\s+path="([^"]+)")?\s*\/>/g

    let match: RegExpExecArray | null
    let lastConsumedIndex = 0

    while ((match = regex.exec(this.buffer)) !== null) {
      lastConsumedIndex = regex.lastIndex

      const tag = match[1] || 'makef'
      const path = match[2] || match[4] || ''
      const content = match[3]?.trim() ?? ''

      if (tag === 'makef') {
        commands.push({ type: 'makef', path })
      }

      if (tag === 'writf') {
        commands.push({ type: 'writf', path, content })
      }

      if (tag === 'exe') {
        commands.push({ type: 'exe', command: content })
      }
    }

    // 🔥 CRITICAL: remove parsed content
    if (lastConsumedIndex > 0) {
      this.buffer = this.buffer.slice(lastConsumedIndex)
    }

    return commands
  }

  /**
   * Strips XML command tags from text, leaving only the human-readable content
   * @param text - Full response text with XML tags
   * @returns Clean text without XML command tags
   */
  stripCommandTags(text: string): string {
    return text
      .replace(/<makef\s+path="[^"]+"\s*\/>/g, '') // Remove self-closing makef tags
      .replace(/<makef\s+path="[^"]+"\s*>\s*<\/makef>/g, '') // Remove empty makef tags
      .replace(/<writf\s+path="[^"]+"\s*>[\s\S]*?<\/writf>/g, '') // Remove writf tags with content
      .replace(/<exe\s*>[\s\S]*?<\/exe>/g, '') // Remove exe tags with content
      .trim() // Remove extra whitespace
  }
}

export default AgentResponseParser
