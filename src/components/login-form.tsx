'use client';

import * as React from 'react';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { loginWithEmail } from '@/lib/auth-actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const [state, formAction] = useFormState(loginWithEmail, undefined);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);


  React.useEffect(() => {
    if (state?.success === false) {
      toast({
        title: 'Login Failed',
        description: state.message,
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  }, [state, toast]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    formAction(new FormData(event.currentTarget));
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <ShieldCheck className="h-12 w-12 text-primary" />
        </div>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
