import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { TodoList } from '@/components/TodoList';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        {/* Enhanced Header with better contrast */}
        <header className="relative border-b bg-card shadow-soft">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-accent/3" />
          <div className="container relative mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-gradient">
                  Todo App
                </h1>
                <p className="text-muted-foreground text-lg font-medium">
                  Organize your life, one task at a time
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-muted-foreground font-medium">
                  Live & Ready
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Main Content with better spacing */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <TodoList />
          </div>
        </main>

        {/* Enhanced Footer with better contrast */}
        <footer className="relative border-t bg-card mt-20">
          <div className="absolute inset-0 bg-gradient-to-r from-muted/10 via-transparent to-muted/10" />
          <div className="container relative mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <p className="text-sm text-muted-foreground font-medium">
                  © 2024 Todo App
                </p>
                <div className="hidden md:block w-1 h-1 rounded-full bg-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  Built with modern web technologies
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30 border">
                  <span className="font-semibold text-primary">React 19</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30 border">
                  <span className="font-semibold text-primary">TypeScript</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30 border">
                  <span className="font-semibold text-primary">Tailwind CSS</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30 border">
                  <span className="font-semibold text-primary">Shadcn/ui</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Enhanced Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'shadow-medium',
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius-lg)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />

      {/* React Query Devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
