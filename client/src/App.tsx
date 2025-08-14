
import React from 'react';
import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import ChatPage from "@/pages/chat";
import AuthPage from "@/pages/auth-page";
import NotFoundPage from "@/pages/not-found";
import ProtectedRoute from "@/lib/protected-route";

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('401')) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Switch>
            <Route path="/auth" component={AuthPage} />
            <Route path="/">
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            </Route>
            <Route component={NotFoundPage} />
          </Switch>
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
