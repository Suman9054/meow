
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workspaces: defineTable({
    user: v.string(),
  }).index("by_owner", ["user"]),
  filetree: defineTable({
    user: v.string(),
    workspaceId: v.string(),
    name: v.string(),          // file/folder name
    type: v.string(),          // "file" | "folder"

    parentId: v.optional(v.id("filetree")), // for tree structure
  }).index("by_workspaceId", ["workspaceId"]),

  filecontents: defineTable({
    fileId: v.id("filetree"),  // link content to file
    content: v.string(),
  }).index("by_fileId", ["fileId"]),

  messagesschema: defineTable({
    workspaceId: v.id("workspaces"),
    messages: v.any(), // store messages as JSON for flexibility 
  }).index("by_workspaceId", ["workspaceId"]),
});

