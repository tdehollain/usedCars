import { Outlet, createRootRoute } from '@tanstack/react-router';
import { useConvexAuth } from 'convex/react';
import { LoginForm } from '@/components/auth/LoginForm';
import { NavBar } from '@/components/NavBar';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p>Loading...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <LoginForm />
      </main>
    );
  }

  return (
    <NavBar>
      <Outlet />
    </NavBar>
  );
}
