export type AgentComand = | { type: 'makef'; path: string } | { type: 'writf'; path: string; content: string } | { type: 'exe'; command: string }
