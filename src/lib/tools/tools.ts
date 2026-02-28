import { toolDefinition } from '@tanstack/ai'
import { api } from 'convex/_generated/api'
import { ConvexHttpClient } from 'convex/browser'

import { z } from 'zod'
console.log('Convex URL:', import.meta.env.VITE_CONVEX_URL)

const client = new ConvexHttpClient(import.meta.env.VITE_CONVEX_URL!)
const executeComanddef = toolDefinition({
  name: 'executeCommand',
  description: 'Execute a command in the terminal',
  inputSchema: z.object({
    Command: z
      .string()
      .describe(
        'The command to execute in the terminal like bun run dev or bun install etc...',
      ),
  }),
  outputSchema: z.object({
    executed: z
      .boolean()
      .describe(
        'true if the command was executed successfully, false otherwise',
      ),
    errorMessage: z
      .string()
      .describe(
        'The error message if the command execution failed, empty string otherwise',
      ),
  }),
})

export const commandExecutorTool = executeComanddef.client(
  async ({ Command }) => {
    console.log(`Executing command: ${Command}`)
    try {
      // Call Convex action
      await client.action(api.convextools.executecomand, {
        command: Command,
        id: '1',
      })

      return {
        executed: true,
        errorMessage: '',
      }
    } catch (error) {
      console.error(`Error executing command: ${error}`)
      return {
        executed: false,
        errorMessage: `Error executing command: ${error}`,
      }
    }
  },
)

const writeFiledef = toolDefinition({
  name: 'writeFile',
  description: 'Write content to a file',
  inputSchema: z.object({
    path: z
      .string()
      .describe(
        'the path of the file to write to, like src/index.ts or src/app.tsx etc...',
      ),
    content: z.string().describe('the content to write to the file'),
  }),
  outputSchema: z.object({
    written: z
      .boolean()
      .describe('true if the file was written successfully, false otherwise'),
    errorMessage: z
      .string()
      .describe(
        'The error message if the file writing failed, empty string otherwise',
      ),
  }),
})

export const writeFileTool = writeFiledef.client(async ({ path, content }) => {
  console.log(`Writing to file: ${path} with content length: ${content.length}`)
  try {
    await client.action(api.convextools.executecomand, {
      command: `write ${path}`,
      id: '2',
    })

    return {
      written: true,
      errorMessage: '',
    }
  } catch (error) {
    console.error(`Error writing file: ${error}`)
    return {
      written: false,
      errorMessage: `Error writing file: ${error}`,
    }
  }
})

const makePathdef = toolDefinition({
  name: 'makePath',
  description: 'Make a new file at the specified path',
  inputSchema: z.object({
    Path: z
      .string()
      .describe(
        'the path of the file to be created like src/index.ts or src/app.tsx etc...',
      ),
  }),
  outputSchema: z.object({
    made: z
      .boolean()
      .describe('true if the file was created succesfully, false otherwise'),
    errorMessage: z
      .string()
      .describe(
        'The error message if the file creation failed, empty string otherwise',
      ),
  }),
})
export const makePathTool = makePathdef.client(async ({ Path }) => {
  console.log(`Making file at path : ${Path}`)
  try {
    await client.action(api.convextools.executecomand, {
      command: `create ${Path}`,
      id: '3',
    })
    return {
      made: true,
      errorMessage: '',
    }
  } catch (error) {
    console.error(`Error making path: ${error}`)
    return {
      made: false,
      errorMessage: `Error making path: ${error}`,
    }
  }
})
