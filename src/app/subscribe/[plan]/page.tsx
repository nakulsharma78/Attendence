'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useSession } from '@/components/session-provider';
import Loading from '@/app/loading';
import { useEffect } from 'react';

const planDetails: Record<string, { name: string; price: string }> = {
  basic: { name: 'Basic Plan', price: '$49/month' },
  professional: { name: 'Professional Plan', price: '$199/month' },
};

export default function SubscribePage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useSession();
  const planId = Array.isArray(params.plan) ? params.plan[0] : params.plan;
  const plan = planDetails[planId] || { name: 'Selected Plan', price: '' };

   useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=/subscribe/${planId}`);
    }
  }, [user, loading, router, planId]);


  if (loading || !user) {
    return <Loading />;
  }

  const handlePayment = () => {
    // In a real application, this would redirect to a Stripe Checkout session.
    // For now, it will just show an alert.
    alert(`Redirecting to payment provider for ${plan.name}...`);
    // Example: router.push(stripeCheckoutUrl);
  };

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <PageHeader
        title="Complete Your Subscription"
        description={`You are subscribing to the ${plan.name}.`}
      />
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your plan details before proceeding to payment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <span className="font-semibold text-lg">{plan.name}</span>
              <span className="text-xl font-bold">{plan.price}</span>
            </div>
             <p className="text-sm text-muted-foreground">
              You are about to complete your subscription. By clicking "Proceed to Payment", 
              you will be redirected to our secure payment partner to finalize the transaction.
            </p>
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-between items-center">
            <Button variant="outline" onClick={() => router.push('/#pricing')}>
                <ArrowLeft className="mr-2 h-4 w-4"/>
                Back to Pricing
            </Button>
            <Button onClick={handlePayment}>
                <CreditCard className="mr-2 h-4 w-4"/>
                Proceed to Payment
            </Button>
        </div>
      </div>
    </div>
  );
}
