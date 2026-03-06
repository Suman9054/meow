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
