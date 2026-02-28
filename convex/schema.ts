
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  filetree: defineTable({
    user: v.string(),
    workspaceId: v.string(),
    name: v.string(),          // file/folder name
    type: v.string(),          // "file" | "folder"

    parentId: v.optional(v.id("filetree")), // for tree structure
    children: v.optional(v.array(v.id("filetree"))) // store child document IDs
  }).index("by_workspaceId", ["workspaceId"])
    .index("by_parentId", ["parentId"]),

  filecontents: defineTable({
    fileId: v.id("filetree"),  // link content to file
    content: v.string(),
  }).index("by_fileId", ["fileId"])
});

