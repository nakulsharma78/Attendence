'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const pricingTiers = [
  {
    name: 'Basic',
    price: '$49',
    period: '/month',
    description: 'For small departments or single classes.',
    features: [
      'Up to 50 Students',
      'AI Facial Recognition',
      'Basic Attendance Reports',
      'Email Support',
    ],
    cta: 'Choose Basic',
  },
  {
    name: 'Professional',
    price: '$199',
    period: '/month',
    description: 'Ideal for schools and medium-sized institutions.',
    features: [
      'Up to 500 Students',
      'All Basic Features',
      'Advanced Reporting & Analytics',
      'Liveness Detection',
      'Priority Support',
    ],
    cta: 'Choose Professional',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    period: '',
    description: 'Tailored for large universities and districts.',
    features: [
      'Unlimited Students',
      'All Professional Features',
      'API Access & Integrations',
      'Dedicated Account Manager',
      'On-Premise Deployment Option',
    ],
    cta: 'Contact Sales',
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground mt-2">
            Choose the plan that's right for your institution.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={tier.popular ? 'border-primary' : ''}>
              <CardHeader>
                {tier.popular && <div className="text-primary font-semibold mb-2">Most Popular</div>}
                <CardTitle>{tier.name}</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                  <Link href="/signup">{tier.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
