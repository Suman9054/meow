import { toolDefinition } from '@tanstack/ai'
import { api } from 'convex/_generated/api'
import { ConvexHttpClient } from 'convex/browser'

import { z } from 'zod'
console.log('Convex URL:', import.meta.env.VITE_CONVEX_URL)

const client = new ConvexHttpClient(import.meta.env.VITE_CONVEX_URL!)
const executeComanddef = toolDefinition({
  name: 'executeCommand',
  description: 'Execute a command in the terminal',
  inputSchema: z.object({
    Command: z
      .string()
      .describe(
        'The command to execute in the terminal like bun run dev or bun install etc...',
      ),
  }),
  outputSchema: z.object({
    executed: z
      .boolean()
      .describe(
        'true if the command was executed successfully, false otherwise',
      ),
    errorMessage: z
      .string()
      .describe(
        'The error message if the command execution failed, empty string otherwise',
      ),
  }),
})

export const commandExecutorTool = executeComanddef.client(
  async ({ Command }) => {
    console.log(`Executing command: ${Command}`)
    try {
      // Call Convex action
      await client.action(api.convextools.executecomand, {
        command: Command,
        id: '1',
      })

      return {
        executed: true,
        errorMessage: '',
      }
    } catch (error) {
      console.error(`Error executing command: ${error}`)
      return {
        executed: false,
        errorMessage: `Error executing command: ${error}`,
      }
    }
  },
)

const writeFiledef = toolDefinition({
  name: 'writeFile',
  description: 'Write content to a file',
  inputSchema: z.object({
    path: z
      .string()
      .describe(
        'the path of the file to write to, like src/index.ts or src/app.tsx etc...',
      ),
    content: z.string().describe('the content to write to the file'),
  }),
  outputSchema: z.object({
    written: z
      .boolean()
      .describe('true if the file was written successfully, false otherwise'),
    errorMessage: z
      .string()
      .describe(
        'The error message if the file writing failed, empty string otherwise',
      ),
  }),
})

export const writeFileTool = writeFiledef.client(async ({ path, content }) => {
  console.log(`Writing to file: ${path} with content length: ${content.length}`)
  try {
    await client.action(api.convextools.executecomand, {
      command: `write ${path}`,
      id: '2',
    })

    return {
      written: true,
      errorMessage: '',
    }
  } catch (error) {
    console.error(`Error writing file: ${error}`)
    return {
      written: false,
      errorMessage: `Error writing file: ${error}`,
    }
  }
})

const makePathdef = toolDefinition({
  name: 'makePath',
  description: 'Make a new file at the specified path',
  inputSchema: z.object({
    Path: z
      .string()
      .describe(
        'the path of the file to be created like src/index.ts or src/app.tsx etc...',
      ),
  }),
  outputSchema: z.object({
    made: z
      .boolean()
      .describe('true if the file was created succesfully, false otherwise'),
    errorMessage: z
      .string()
      .describe(
        'The error message if the file creation failed, empty string otherwise',
      ),
  }),
})
export const makePathTool = makePathdef.client(async ({ Path }) => {
  console.log(`Making file at path : ${Path}`)
  try {
    await client.action(api.convextools.executecomand, {
      command: `create ${Path}`,
      id: '3',
    })
    return {
      made: true,
      errorMessage: '',
    }
  } catch (error) {
    console.error(`Error making path: ${error}`)
    return {
      made: false,
      errorMessage: `Error making path: ${error}`,
    }
  }
})

const frontenddesignskilldif = toolDefinition({
  name: 'frontend-designskill',
  description: 'it is a skill to design mordan frontend',

  outputSchema: z.string(),
})

export const frontenddesignskill = frontenddesignskilldif.client(
  () => `---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: you are  capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.`,
)
