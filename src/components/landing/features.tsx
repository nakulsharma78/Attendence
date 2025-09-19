'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanFace, UserCheck, BarChart3, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: <ScanFace className="w-10 h-10 text-primary" />,
    title: 'AI-Powered Facial Recognition',
    description: 'Our advanced AI ensures accurate and fast student identification, minimizing errors and saving time.',
  },
  {
    icon: <UserCheck className="w-10 h-10 text-primary" />,
    title: 'Liveness Detection',
    description: 'Prevent spoofing with cutting-edge liveness detection, ensuring the person is physically present.',
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-primary" />,
    title: 'Real-Time Reporting',
    description: 'Access comprehensive attendance reports instantly, with detailed analytics on student presence and verification.',
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-primary" />,
    title: 'Secure and Reliable',
    description: 'Built on a secure cloud infrastructure, ensuring data privacy and system reliability for your institution.',
  },
];

export function Features() {
  const [visibleFeatures, setVisibleFeatures] = React.useState<number[]>([]);
  const featuresRef = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setVisibleFeatures((prev) => [...prev, index]);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    featuresRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      featuresRef.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Why GuardianAI?</h2>
          <p className="text-muted-foreground mt-2">
            Discover the features that make our platform the best choice for your institution.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (featuresRef.current[index] = el)}
              data-index={index}
              className={cn(
                'transition-all duration-700 ease-out',
                visibleFeatures.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              )}
              style={{ transitionDelay: `${index * 100}ms`}}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
