import { mutation } from "./_generated/server";
import { v } from "convex/values";



export const createworkspace = mutation({
  args: { user: v.string() },
  handler: async (ctx, args) => {
    try {
      const workspaceid = await ctx.db.insert("workspaces", { user: args.user })
      console.log("Created workspace with id", workspaceid);
      return workspaceid;

    } catch (error) {
      console.error("Error creating workspace:", error);
      throw new Error("Failed to create workspace");
    }

  }
})

export const savemessages = mutation({
  args: {
    workspaceid: v.id("workspaces"),
    messages: v.any()
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.insert('messagesschema', {
        workspaceId: args.workspaceid,
        messages: args.messages
      })
      console.log("Saved messages for workspace", args.workspaceid);
    } catch (error) {
      console.error("Error saving messages:", error);
      throw new Error("Failed to save messages");
    }
  }

})
