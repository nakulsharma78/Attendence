'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { ContactSalesDialog } from '@/components/landing/contact-sales-dialog';

const pricingTiers = [
  {
    name: 'Monthly',
    price: '₹999',
    period: '/month',
    description: 'Perfect for getting started.',
    features: [
      'Unlimited Students',
      'AI Facial Recognition',
      'Liveness Detection',
      'Real-Time Reporting',
      'Email Support',
    ],
    cta: 'Choose Monthly',
    planId: 'monthly',
  },
  {
    name: 'Half-Yearly',
    price: '₹4,999',
    period: '/6 months',
    description: 'Save with a semi-annual commitment.',
    features: [
      'All Monthly Features',
      'Includes 15% Discount',
      'Priority Support',
    ],
    cta: 'Choose Half-Yearly',
    planId: 'half-yearly',
  },
  {
    name: 'Yearly',
    price: '₹8,999',
    period: '/year',
    description: 'Best value for long-term use.',
    features: [
      'All Monthly Features',
      'Includes 25% Discount',
      'Priority Support',
    ],
    cta: 'Choose Yearly',
    planId: 'yearly',
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    period: '',
    description: 'Tailored for large universities and districts.',
    features: [
      'Unlimited Students & Classes',
      'API Access & Integrations',
      'Dedicated Account Manager',
      'On-Premise Deployment Option',
    ],
    cta: 'Contact Sales',
    planId: 'enterprise',
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={tier.name === 'Enterprise' ? 'md:col-span-2 lg:col-span-1' : ''}>
              <CardHeader>
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
                 {tier.planId === 'enterprise' ? (
                  <ContactSalesDialog />
                ) : (
                  <Button asChild className="w-full">
                    <Link href={`/subscribe/${tier.planId}`}>{tier.cta}</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
