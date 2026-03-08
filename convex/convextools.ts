import { internal } from './_generated/api'
import { action } from './_generated/server'
import { v } from 'convex/values'

export const executecomand = action({
  args: { id: v.string(), command: v.string() },
  handler: (_ctx, args) => {
    if (!args.id || !args.command) {
      console.error('Invalid arguments for executecommand:', args)
      throw new Error("Both 'id' and 'command' are required.")
    }
    console.log('Executing command', args.command, 'with id', args.id)
  },
})

export const creatworkspaceaction = action({
  args: { user: v.string() },
  handler: async (ctx, args): Promise<string> => {
    try {
      const workspaceid: string = await ctx.runMutation(
        internal.workspace.createworkspace,
        {
          user: args.user,
        },
      )
      console.log('Created workspace with ID:', workspaceid)
      return workspaceid
    } catch (err) {
      console.error('Error creating workspace:', err)
      throw new Error('Failed to create workspace')
    }
  },
})

export const savemessagesaction = action({
  args: {
    workspaceid: v.id('workspaces'),
    messages: v.any(),
  },
  handler: async (ctx, args) => {
    try {
      await ctx.runMutation(internal.workspace.savemessages, {
        workspaceid: args.workspaceid,
        messages: args.messages,
      })
      console.log('Saved messages for workspace', args.workspaceid)
    } catch (err) {
      console.error('Error saving messages:', err)
      throw new Error('Failed to save messages')
    }
  },
})
