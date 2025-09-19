'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import { useSession } from '@/components/session-provider';
import Loading from '@/app/loading';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode.react';

const planDetails: Record<string, { name: string; price: number; priceString: string }> = {
  monthly: { name: 'Monthly Plan', price: 999, priceString: '₹999/month' },
  'half-yearly': { name: 'Half-Yearly Plan', price: 4999, priceString: '₹4,999/6 months' },
  yearly: { name: 'Yearly Plan', price: 8999, priceString: '₹8,999/year' },
};

export default function SubscribePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useSession();
  const planId = Array.isArray(params.plan) ? params.plan[0] : params.plan;
  const plan = planDetails[planId] || { name: 'Selected Plan', price: 0, priceString: '' };
  
  const [paymentStep, setPaymentStep] = useState<'review' | 'pay' | 'confirmed'>('review');

   useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=/subscribe/${planId}`);
    }
  }, [user, loading, router, planId]);


  if (loading || !user) {
    return <Loading />;
  }

  const handleProceedToPayment = () => {
    setPaymentStep('pay');
    toast({
      title: 'Scan to Pay',
      description: `Please complete the payment of ₹${plan.price} using any UPI app.`,
    });
  };

  const handleConfirmPayment = () => {
    // In a real application, you would verify the payment status via a webhook from your payment provider.
    // For now, we just simulate success.
    setPaymentStep('confirmed');
     toast({
      title: 'Payment Successful!',
      description: `You are now subscribed to the ${plan.name}. Redirecting...`,
    });
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  }

  // A real UPI ID and name should be used here. These are placeholders.
  const upiId = 'your-upi-id@okhdfcbank';
  const upiName = 'GuardianAI Inc';
  const upiUrl = `upi://pay?pa=${upiId}&pn=${upiName}&am=${plan.price}&cu=INR&tn=GuardianAI ${plan.name}`;


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
             {paymentStep === 'review' && (
              <>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <span className="font-semibold text-lg">{plan.name}</span>
                  <span className="text-xl font-bold">{plan.priceString}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You are about to complete your subscription. By clicking "Proceed to Payment", 
                  you will be shown a QR code to finalize the transaction.
                </p>
              </>
            )}

            {paymentStep === 'pay' && (
              <div className="flex flex-col items-center gap-4 animate-fade-in-up">
                <h3 className="text-lg font-semibold">Scan to Complete Payment</h3>
                <div className="p-4 bg-white rounded-lg border">
                  <QRCode value={upiUrl} size={256} />
                </div>
                <p className="text-center text-muted-foreground">
                  Use any UPI app (Google Pay, PhonePe, Paytm, etc.) to scan this code and pay <span className="font-bold">₹{plan.price}</span>.
                </p>
                <p className="text-xs text-center text-muted-foreground px-4">
                  Once payment is complete, click the confirmation button below. In a real app, this would be automatically detected.
                </p>
              </div>
            )}
             {paymentStep === 'confirmed' && (
              <div className="flex flex-col items-center gap-4 text-center animate-fade-in-up p-8">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <h3 className="text-2xl font-bold">Payment Confirmed!</h3>
                <p className="text-muted-foreground">
                  Thank you for subscribing to GuardianAI. You now have full access to the dashboard.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-end items-center gap-4">
            {paymentStep === 'review' && (
              <>
                <Button variant="outline" onClick={() => router.push('/#pricing')}>
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Back to Pricing
                </Button>
                <Button onClick={handleProceedToPayment}>
                    <CreditCard className="mr-2 h-4 w-4"/>
                    Proceed to Payment
                </Button>
              </>
            )}
            {paymentStep === 'pay' && (
              <Button onClick={handleConfirmPayment} className="w-full" size="lg">
                <CheckCircle className="mr-2 h-4 w-4"/>
                I Have Completed the Payment
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}
