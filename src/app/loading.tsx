import { ShieldCheck } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="animate-pulse">
        <ShieldCheck className="h-16 w-16 text-primary" />
      </div>
      <p className="mt-4 text-muted-foreground">Loading GuardianAI...</p>
    </div>
  );
}
