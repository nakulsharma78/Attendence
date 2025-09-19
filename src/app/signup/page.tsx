'use client';

import { SignupForm } from '@/components/signup-form';
import { useSession } from '@/components/session-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '@/app/loading';

export default function SignupPage() {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return <Loading />;
  }
  
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <SignupForm />
    </div>
  );
}
