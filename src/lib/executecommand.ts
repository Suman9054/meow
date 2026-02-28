/**
 * Execute shell commands through the /api/exec endpoint
 * Used by ChatClient to run commands from AI-generated code
 */

export interface ExecRequest {
  command: string
  workdir?: string
  timeout?: number
}

export interface ExecResponse {
  success: boolean
  stdout: string
  stderr: string
  command: string
  code?: number
  error?: string
}

export async function executeCommand(req: ExecRequest): Promise<ExecResponse> {
  try {
    const response = await fetch('/api/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        command: req.command,
        workdir: req.workdir || '/myapp',
        timeout: req.timeout || 30000,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = (await response.json()) as ExecResponse
    return data
  } catch (error) {
    console.error('[EXEC] Request failed:', error)
    return {
      success: false,
      stdout: '',
      stderr: error instanceof Error ? error.message : 'Unknown error occurred',
      command: req.command,
      error: 'Failed to execute command',
    }
  }
}

/**
 * Format execution result for display in chat
 */
export function formatExecResult(result: ExecResponse): string {
  if (result.success) {
    return `✅ Command succeeded\n\`\`\`\n${result.stdout}\n\`\`\``
  } else {
    const output = result.stderr || result.stdout || result.error || 'No output'
    return `❌ Command failed\n\`\`\`\n${output}\n\`\`\``
  }
}
