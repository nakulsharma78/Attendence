'use client';

import * as React from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { signupWithEmail } from '@/lib/auth-actions';
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
import { signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Creating Account...' : 'Create Account'}
    </Button>
  );
}

const YahooIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c6.628 0 12-5.373 12-12S18.628 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
    <path d="M10.13 8.36H8.25l-.23 1.25h2.11zm3.74 0h-1.88l-.23 1.25h2.11zM17.5 12c0 .28-.03.55-.08.82L15.3 18h-2.1l-1.3-3.6-1.3 3.6h-2.1L6.58 12.82c-.05-.27-.08-.54-.08-.82 0-2.21 1.79-4 4-4s4 1.79 4 4zm-7.6-2.39L9.13 14.5h.05l.7-3.89h1.24l.7 3.89h.05l.72-4.89h1.5l-1.32 6.64h-1.4l-.74-3.84-.74 3.84h-1.4L6.4 9.61h1.5z"/>
  </svg>
);


export function SignupForm() {
  const [state, formAction] = useActionState(signupWithEmail, undefined);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  React.useEffect(() => {
    if (state?.success === false) {
      toast({
        title: 'Signup Failed',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        variant: 'destructive',
      });
      return;
    }
    
    formAction(formData);
  };
  
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

  const handleYahooSignIn = async () => {
    const provider = new OAuthProvider('yahoo.com');
    try {
      await signInWithPopup(auth, provider);
       router.push(redirectUrl || '/dashboard');
    } catch (error) {
      console.error('Error signing in with Yahoo:', error);
      toast({
        title: 'Login Failed',
        description: 'Failed to sign in with Yahoo. Please try again.',
        variant: 'destructive',
      });
    }
  }


  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
           <Link href="/">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </Link>
        </div>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <input type="hidden" name="redirectUrl" value={redirectUrl || ''} />
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={6}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={6}/>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <SubmitButton />
            <div className="relative w-full">
                <Separator className="absolute left-0 top-1/2 -translate-y-1/2 w-full" />
                <span className="bg-background px-2 relative z-10 text-xs text-muted-foreground mx-auto w-fit flex">OR CONTINUE WITH</span>
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} type="button">
                  <Chrome className="mr-2 h-4 w-4" />
                  Google
              </Button>
              <Button variant="outline" className="w-full" onClick={handleYahooSignIn} type="button">
                  <YahooIcon />
                  Yahoo
              </Button>
            </div>
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
