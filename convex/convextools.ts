import { action } from "./_generated/server";
import { v } from "convex/values";

export const executecomand = action({
  args: { id: v.string(), command: v.string() },
  handler: (ctx, args) => {
    console.log("Executing command", args.command, "with id", args.id);
  }
})
