# Tech Stack

## Vite + React

`npm create vite@latest my-app -- --template react-ts`
(for some reason running this with pnpm seems to ignore the template)

## Node types

`pnpm i -D @types/node`

## Convex

`pnpm i convex`

## Clerk

- Create application in Clerk
- Create JWT template (Convex)
- configure CLERK_JWT_ISSUER_DOMAIN on the Convex Dashboard
- Create convex/auth.config.ts:

  ```typescript
  export default {
    providers: [
      {
        domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
        applicationID: 'convex',
      },
    ],
  };
  ```

- Install clerk: `pnpm install @clerk/clerk-react`
- Add VITE_CLERK_PUBLISHABLE_KEY to .env.local
- Configure ConvexProviderWithClerk

## Test auth

- Create getCurrentUser API function

```typescript
import { query } from './_generated/server';

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error('Not authenticated');
    }
    return identity;
  },
});
```

- Create UserName component:

  ```tsx
  const UserName = () => {
    const user = useQuery(api.username.getCurrentUser);
    if (!user) {
      return <div>Not signed in</div>;
    }
    return <div>{user ? `Hello ${user.email}` : 'Loading...'}</div>;
  };
  ```

- Update App.tsx:

```tsx
<main>
  <Unauthenticated>
    <SignInButton />
  </Unauthenticated>
  <Authenticated>
    <UserButton />
    <UserName />
    <SignOutButton />
  </Authenticated>
  <AuthLoading>
    <p>Still loading</p>
  </AuthLoading>
</main>
```

temp user pwd: 7?9MR?iFGMEstBio

## Shadcn

- Add Tailwind: `pnpm add tailwindcss @tailwindcss/vite`
- Edit index.css:

```
@import "tailwindcss";
```

- Edit tsconfig.json and tsconfig.app.json:

```json
"compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
```

- Edit vite.config.ts:

```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- Run the CLI:

```
pnpm dlx shadcn@latest init
```

## Shadcn Dark Mode

- Add components/theme-provider.tsx:

```tsx
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
```

- Wrap root layout:

```tsx
<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
  {children}
</ThemeProvider>
```

## Add Nav Bar

pnpm dlx shaddcn@latest add navbar

## Add ts-router

- Install:
  `pnpm add @tanstack/react-router @tanstack/react-router-devtools`
  `pnpm add -D @tanstack/router-plugin`

- Configure vite plugin
  **If tsc error, try reordering the imports**

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    // ...,
  ],
});
```

- Create the files
  - src/routes/\__root.tsx (with two '_' characters)
  - src/routes/index.tsx
  - src/routes/about.tsx
  - src/main.tsx
