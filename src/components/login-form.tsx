'use client';

import * as React from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
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
import { ShieldCheck, Chrome } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFormStatus } from 'react-dom';
import { Separator } from './ui/separator';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Signing In...' : 'Sign In'}
        </Button>
    );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginWithEmail, undefined);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');


  React.useEffect(() => {
    if (state?.success === false) {
      toast({
        title: 'Login Failed',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push(redirectUrl || '/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: 'Login Failed',
        description: 'Failed to sign in with Google. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Link href="/">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </Link>
        </div>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
           <input type="hidden" name="redirectUrl" value={redirectUrl || ''} />
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
          <SubmitButton />
           <div className="relative w-full">
            <Separator className="absolute left-0 top-1/2 -translate-y-1/2 w-full" />
            <span className="bg-background px-2 relative z-10 text-xs text-muted-foreground mx-auto w-fit flex">OR CONTINUE WITH</span>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} type="button">
            <Chrome className="mr-2 h-4 w-4" />
            Google
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
