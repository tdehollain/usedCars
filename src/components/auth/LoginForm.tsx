import { type FormEvent, useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { isClerkAPIResponseError } from '@clerk/clerk-react/errors';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoaded) {
      return;
    }

    if (!signIn) {
      setErrorMessage('Sign in is not ready. Please try again.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
      } else {
        setErrorMessage('Please complete the remaining sign in steps.');
      }
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        const [firstError] = error.errors;
        setErrorMessage(firstError?.longMessage ?? firstError?.message ?? 'Sign in failed.');
      } else {
        setErrorMessage('Unexpected error while signing in.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) {
      return;
    }

    if (!signIn) {
      setErrorMessage('Sign in is not ready. Please try again.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/',
        redirectUrlComplete: '/',
      });
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        const [firstError] = error.errors;
        setErrorMessage(firstError?.longMessage ?? firstError?.message ?? 'Google sign in failed.');
      } else {
        setErrorMessage('Unexpected error while signing in with Google.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('w-md', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  autoComplete="email"
                  disabled={isSubmitting || !isLoaded}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  disabled={isSubmitting || !isLoaded}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting || !isLoaded}>
                  {isSubmitting ? 'Signing in...' : 'Login'}
                </Button>
                <Button variant="outline" type="button" disabled={isSubmitting || !isLoaded} onClick={handleGoogleSignIn}>
                  Login with Google
                </Button>
                {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
