'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative text-center py-20 md:py-32">
       <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] -z-10" />
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          The Future of Attendance is Here
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          GuardianAI revolutionizes attendance tracking with secure, AI-powered facial recognition. Simple for students, powerful for institutions.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/signup">Get Started for Free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
