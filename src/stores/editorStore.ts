import { create } from 'zustand'

export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  content?: string
}

interface EditorState {
  fileTree: FileNode[]
  activeFile: string | null
  fileContents: Record<string, string>
  expandedFolders: Set<string>
  openTabs: string[]
  setActiveFile: (fileId: string | null) => void
  toggleFolder: (folderId: string) => void
  closeTab: (fileId: string) => void
  getFileContent: (fileId: string) => string
}

const mockFileTree: FileNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 'src/App.tsx',
        name: 'App.tsx',
        type: 'file',
        content: `import React from 'react';
import { Button } from './components/Button';
import './styles/App.css';

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to My App</h1>
        <p>Built with React + TypeScript</p>
      </header>
      
      <main className="app-main">
        <div className="counter-card">
          <h2>Counter: {count}</h2>
          <Button onClick={() => setCount(c => c + 1)}>
            Increment
          </Button>
        </div>
      </main>
    </div>
  );
}

export default App;`,
      },
      {
        id: 'src/main.tsx',
        name: 'main.tsx',
        type: 'file',
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      },
      {
        id: 'src/components',
        name: 'components',
        type: 'folder',
        children: [
          {
            id: 'src/components/Button.tsx',
            name: 'Button.tsx',
            type: 'file',
            content: `import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary'
}) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};`,
          },
          {
            id: 'src/components/Button.css',
            name: 'Button.css',
            type: 'file',
            content: `.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: white;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #0ea5e9;
  border: 2px solid #0ea5e9;
}`,
          },
        ],
      },
      {
        id: 'src/styles',
        name: 'styles',
        type: 'folder',
        children: [
          {
            id: 'src/styles/App.css',
            name: 'App.css',
            type: 'file',
            content: `.app {
  min-height: 100vh;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  color: white;
}

.app-header {
  padding: 4rem 2rem 2rem;
  text-align: center;
}

.app-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.app-header p {
  color: #94a3b8;
  font-size: 1.125rem;
}

.app-main {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.counter-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
}

.counter-card h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}`,
          },
          {
            id: 'src/styles/index.css',
            name: 'index.css',
            type: 'file',
            content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,
          },
        ],
      },
    ],
  },
  {
    id: 'index.html',
    name: 'index.html',
    type: 'file',
    content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My React App</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
  },
  {
    id: 'package.json',
    name: 'package.json',
    type: 'file',
    content: `{
  "name": "my-react-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "vite": "^5.2.0"
  }
}`,
  },
  {
    id: 'tsconfig.json',
    name: 'tsconfig.json',
    type: 'file',
    content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}`,
  },
]

const buildFileContents = (
  nodes: FileNode[],
  contents: Record<string, string> = {},
): Record<string, string> => {
  for (const node of nodes) {
    if (node.type === 'file' && node.content) {
      contents[node.id] = node.content
    }
    if (node.children) {
      buildFileContents(node.children, contents)
    }
  }
  return contents
}

export const useEditorStore = create<EditorState>((set, get) => ({
  fileTree: mockFileTree,
  activeFile: 'src/App.tsx',
  fileContents: buildFileContents(mockFileTree),
  expandedFolders: new Set(['src', 'src/components', 'src/styles']),
  openTabs: ['src/App.tsx'],

  setActiveFile: (fileId) => {
    set((state) => ({
      activeFile: fileId,
      openTabs: fileId && !state.openTabs.includes(fileId)
        ? [...state.openTabs, fileId]
        : state.openTabs,
    }))
  },

  toggleFolder: (folderId) => {
    set((state) => {
      const newExpanded = new Set(state.expandedFolders)
      if (newExpanded.has(folderId)) {
        newExpanded.delete(folderId)
      } else {
        newExpanded.add(folderId)
      }
      return { expandedFolders: newExpanded }
    })
  },

  closeTab: (fileId) => {
    set((state) => {
      const newTabs = state.openTabs.filter((id) => id !== fileId)
      const newActiveFile =
        state.activeFile === fileId
          ? newTabs[newTabs.length - 1] || null
          : state.activeFile
      return { openTabs: newTabs, activeFile: newActiveFile }
    })
  },

  getFileContent: (fileId) => {
    return get().fileContents[fileId] || ''
  },
}))
