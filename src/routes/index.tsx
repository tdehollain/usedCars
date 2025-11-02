import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  // const UserName = () => {
  //   const user = useQuery(api.username.getCurrentUser);
  //   if (!user) {
  //     return <div>Not signed in</div>;
  //   }
  //   return <div>{user ? `Hello ${user.email}` : 'Loading...'}</div>;
  // };
  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <p>Hello {}</p>
    </main>
  );
}
