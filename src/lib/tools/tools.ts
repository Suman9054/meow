import { toolDefinition } from "@tanstack/ai";


import { z } from "zod";


const executeComanddef = toolDefinition({
  name: "executeCommand",
  description: "Execute a command in the terminal",
  inputSchema: z.object({
    Command: z.string().describe('The command to execute in the terminall like bun run dev or bun install etc...'),

  }),
  outputSchema: z.object({
    executed: z.boolean().describe('true if the command was executed successfully, false otherwise'),
    errorMessage: z.string().describe('The error message if the command execution failed, empty string otherwise'),
  })

})


export const commandExecutorTool = executeComanddef.server(async ({ Command }) => {
  console.log(`Executing command: ${Command}`)
  return {
    executed: true,
    errorMessage: '',
  }
});

const writeFiledef = toolDefinition({
  name: "writeFile",
  description: "Write content to a file",
  inputSchema: z.object({
    path: z.string().describe('the path of the file to write to , like src/index.ts or src/app.tsx etc...'),
    content: z.string().describe('the content of the write file')
  }),
  outputSchema: z.object({
    written: z.boolean().describe('true if the file was written successfully, false otherwise'),
    errorMessage: z.string().describe('The error message if the file writing failed, empty string otherwise'),
  })
})

export const writeFileTool = writeFiledef.server(async ({ path, content }) => {
  console.log(`Writing to file: ${path} with content length: ${content.length}`)
  return {
    written: true,
    errorMessage: '',
  }
})

const makePathdef = toolDefinition({
  name: "makePath",
  description: "Make a new file at the specified path",
  inputSchema: z.object({
    Path: z.string().describe('the path of the file to be created like src/index.ts or src/app.tsx etc...')
  }),
  outputSchema: z.object({
    made: z.boolean().describe('true if the file was created succesfully, false otherwise'),
    errorMessage: z.string().describe('The error message if the file creation failed, empty string otherwise'),
  })
})
export const makePathTool = makePathdef.server(async ({ Path }) => {
  console.log(`Making file at path : ${Path}`)
  return {
    made: true,
    errorMessage: ''
  }
})
