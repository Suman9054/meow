import { v } from "convex/values";
import { query } from "./_generated/server";



export const getallfiletree = query({
  args: {
    workspaceID: v.id("workspaces")
  },
  handler: async (ctx, args) => {
    const fiels = await ctx.db.query('filetree').withIndex('by_workspaceId', (q) => q.eq('workspaceId', args.workspaceID)).collect();

    type filenode = (typeof fiels)[number] & { childrean: filenode[] }
    const map = new Map<string, filenode>()
    fiels.forEach((file) => {
      map.set(file._id, {
        ...file,
        childrean: []
      })
    })
    map.forEach((file) => {
      if (file.parentId) {
        const parent = map.get(file.parentId)
        if (parent) {
          parent.childrean.push(file)
          map.delete(file._id)
        }
      }
    })
    return Array.from(map.values())
  }
})

export const getfilecontent = query({
  args: {
    fileId: v.id("filetree")
  },
  handler: async (ctx, args) => {
    const content = await ctx.db.query('filecontents').withIndex('by_fileId', (q) => q.eq('fileId', args.fileId)).collect();
    return content;
  }
})

export const getmessages = query({
  args: {
    workspaceID: v.id("workspaces")
  },
  handler: async (ctx, args) => {
    const messagesdata = await ctx.db.query('messagesschema').withIndex('by_workspaceId', (q) => q.eq('workspaceId', args.workspaceID)).collect();
    return messagesdata;
  }
})


