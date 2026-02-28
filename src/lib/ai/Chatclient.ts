import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { clientTools } from '@tanstack/ai-client'
import { commandExecutorTool, makePathTool, writeFileTool } from "../tools/tools";
const clienttools = clientTools(writeFileTool, makePathTool, commandExecutorTool)
export const ai = useChat({
  connection: fetchServerSentEvents('/api/agent'),
  tools: clienttools,
})
