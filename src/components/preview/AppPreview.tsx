import React from 'react'
import { RefreshCw, ExternalLink, Smartphone, Monitor } from 'lucide-react'
import { usePreviewStore } from '@/stores/previewStore'
import { cn } from '@/lib/utils'

export const AppPreview: React.FC = () => {
  const { previewKey, isLoading, refreshPreview } = usePreviewStore()
  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>(
    'desktop',
  )

  const previewContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', system-ui, sans-serif;
          min-height: 100vh;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
          color: white;
        }
        .app-header {
          padding: 3rem 1.5rem 1.5rem;
          text-align: center;
        }
        .app-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .app-header p {
          color: #94a3b8;
          font-size: 0.9rem;
        }
        .app-main {
          padding: 1.5rem;
          display: flex;
          justify-content: center;
        }
        .counter-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          backdrop-filter: blur(10px);
        }
        .counter-card h2 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }
        .counter-value {
          font-size: 3rem;
          font-weight: 700;
          color: #0ea5e9;
          margin-bottom: 1.5rem;
        }
        .btn {
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          color: white;
          border: none;
          font-size: 1rem;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(14, 165, 233, 0.4);
        }
        .btn:active {
          transform: translateY(0);
        }
      </style>
    </head>
    <body>
      <div class="app">
        <header class="app-header">
          <h1>Welcome to My App</h1>
          <p>Built with React + TypeScript</p>
        </header>
        <main class="app-main">
          <div class="counter-card">
            <h2>Counter</h2>
            <div class="counter-value" id="count">0</div>
            <button class="btn" onclick="increment()">Increment</button>
          </div>
        </main>
      </div>
      <script>
        let count = 0;
        function increment() {
          count++;
          document.getElementById('count').textContent = count;
        }
      </script>
    </body>
    </html>`

  return (
    <div className="h-full flex flex-col bg-panel">
      {/* Preview Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-panel-header border-b border-panel-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Preview
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={cn(
              'p-1.5 rounded transition-colors',
              viewMode === 'desktop'
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
            title="Desktop view"
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={cn(
              'p-1.5 rounded transition-colors',
              viewMode === 'mobile'
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
            title="Mobile view"
          >
            <Smartphone size={16} />
          </button>
          <div className="w-px h-4 bg-panel-border mx-1" />
          <button
            onClick={refreshPreview}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Refresh preview"
          >
            <RefreshCw size={16} className={cn(isLoading && 'animate-spin')} />
          </button>
          <button
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Open in new tab"
          >
            <ExternalLink size={16} />
          </button>
        </div>
      </div>

      {/* Preview URL Bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-panel border-b border-panel-border">
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md">
          <span className="text-xs text-syntax-string">●</span>
          <span className="text-sm text-muted-foreground font-mono">
            localhost:5173
          </span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/30 overflow-hidden">
        <div
          className={cn(
            'bg-background rounded-lg overflow-hidden shadow-2xl transition-all duration-300 h-full',
            viewMode === 'mobile' ? 'w-[375px]' : 'w-full',
          )}
        >
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw size={24} className="animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Loading preview...
                </span>
              </div>
            </div>
          ) : (
            <iframe
              key={previewKey}
              srcDoc={previewContent}
              className="w-full h-full border-0"
              title="App Preview"
              sandbox="allow-scripts"
            />
          )}
        </div>
      </div>
    </div>
  )
}
