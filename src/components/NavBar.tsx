import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { UserButton, SignInButton } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { DarkModeToggle } from './DarkModeToggle';
import { Link } from '@tanstack/react-router';
import { LinkIcon } from 'lucide-react';

interface NavBarProps {
  children: React.ReactNode;
}

export function NavBar({ children }: NavBarProps) {
  return (
    <div className="bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 mx-auto">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-6 w-6" />
              <Link
                to="/"
                className="text-xl font-bold text-foreground hover:text-foreground transition-colors"
              >
                AppName
              </Link>
            </div>

            <nav className="flex items-center ml-4 space-x-2 text-sm font-medium">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/" className="[&.active]:font-bold">
                  Home
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/about" className="[&.active]:font-bold">
                  About
                </Link>
              </Button>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <DarkModeToggle />

            <Unauthenticated>
              <SignInButton />
            </Unauthenticated>
            <Authenticated>
              <UserButton />
            </Authenticated>
            <AuthLoading>
              <p>Still loading</p>
            </AuthLoading>
          </div>
        </div>
      </header>
      <main className="py-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
