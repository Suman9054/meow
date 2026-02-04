import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { execSync } from 'child_process'

// Validation schema for exec request
const ExecRequestSchema = z.object({
  command: z.string().min(1).max(5000),
  workdir: z.string().optional().default('/myapp'),
  timeout: z.number().optional().default(30000), // 30 seconds default
})

export const Route = createFileRoute('/api/exec')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Parse and validate request body
          let body
          try {
            body = await request.json()
          } catch (parseError) {
            console.error('Failed to parse exec request:', parseError)
            return new Response(
              JSON.stringify({
                error: 'Invalid request: malformed JSON',
                stderr: '',
                stdout: '',
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              },
            )
          }

          // Validate request schema
          const validatedData = ExecRequestSchema.parse(body)
          const { command, workdir, timeout } = validatedData

          console.log(`[EXEC] Running command: ${command}`)
          console.log(`[EXEC] Working directory: ${workdir}`)

          try {
            // Execute command with timeout
            const stdout = execSync(command, {
              cwd: workdir,
              timeout: timeout,
              encoding: 'utf-8',
              maxBuffer: 10 * 1024 * 1024, // 10MB buffer
            })

            console.log('[EXEC] Command succeeded')
            console.log('[EXEC] Output:', stdout.slice(0, 200))

            return new Response(
              JSON.stringify({
                success: true,
                stdout: stdout,
                stderr: '',
                command: command,
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              },
            )
          } catch (execError: any) {
            const stderr =
              execError.stderr?.toString() ||
              execError.message ||
              'Unknown error'
            const stdout = execError.stdout?.toString() || ''

            console.error('[EXEC] Command failed:', stderr)

            return new Response(
              JSON.stringify({
                success: false,
                stdout: stdout,
                stderr: stderr,
                command: command,
                code: execError.status || -1,
              }),
              {
                status: 200, // Return 200 with success: false to distinguish from server errors
                headers: { 'Content-Type': 'application/json' },
              },
            )
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            const firstError = error.issues[0]
            console.error('Validation error:', error.issues)
            return new Response(
              JSON.stringify({
                error: `Invalid request: ${firstError.path.join('.')} - ${firstError.message}`,
                stderr: '',
                stdout: '',
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              },
            )
          }

          console.error('Unexpected error in exec endpoint:', error)
          return new Response(
            JSON.stringify({
              error:
                error instanceof Error
                  ? error.message
                  : 'An unexpected error occurred',
              stderr: '',
              stdout: '',
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }
      },
    },
  },
})
