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
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Creating Account...' : 'Create Account'}
    </Button>
  );
}


export function SignupForm() {
  const [state, formAction] = useActionState(signupWithEmail, undefined);
  const { toast } = useToast();
  const router = useRouter();

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
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (password !== confirmPassword) {
      event.preventDefault(); // Prevent form submission
      toast({
        title: "Passwords don't match",
        variant: 'destructive',
      });
    }
  };
  
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
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
          <ShieldCheck className="h-12 w-12 text-primary" />
        </div>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} action={formAction}>
        <CardContent className="space-y-4">
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
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} type="button">
                <Chrome className="mr-2 h-4 w-4" />
                Google
            </Button>
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
