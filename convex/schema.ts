
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workspaces: defineTable({
    user: v.string(), // user ID of the workspace owner
  }).index("by_user", ["user"]),

  filetree: defineTable({
    user: v.string(),
    workspaceId: v.id("workspaces"), // link to workspace
    name: v.string(),          // file/folder name
    type: v.union(
      v.literal("file"),
      v.literal("folder")
    ),          // "file" | "folder"

    parentId: v.optional(v.id('filetree')), // for tree structure
  }).index("by_workspaceId", ["workspaceId"]),

  filecontents: defineTable({
    fileId: v.id("filetree"),  // link content to file
    content: v.string(),
  }).index("by_fileId", ["fileId"])
});

