'use server';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { redirect } from 'next/navigation';

type ActionState = {
  success: boolean;
  message: string;
} | undefined;

export async function signupWithEmail(prevState: ActionState, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      return {
        success: false,
        message: 'This email is already in use.',
      };
    }
    return {
      success: false,
      message: 'An error occurred during sign up. Please try again.',
    };
  }

  redirect('/dashboard');
}

export async function loginWithEmail(prevState: ActionState, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    return {
      success: false,
      message: 'Invalid email or password. Please try again.',
    };
  }
  
  redirect('/dashboard');
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
  redirect('/');
}
