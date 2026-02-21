import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateCheckoutSession } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { dollarsToCents } from '../lib/format';

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

export function Donate() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const { identity } = useInternetIdentity();
  const createCheckout = useCreateCheckoutSession();

  const isAuthenticated = !!identity;

  const getEffectiveAmount = (): number | null => {
    if (selectedAmount !== null) return selectedAmount;
    const custom = parseFloat(customAmount);
    return isNaN(custom) || custom <= 0 ? null : custom;
  };

  const handleDonate = async () => {
    const amount = getEffectiveAmount();
    
    if (!amount) {
      toast.error('Please select or enter an amount');
      return;
    }

    if (!donorName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      const shoppingItem = {
        productName: 'Donation to Glitch Enterprises',
        productDescription: `Thank you ${donorName.trim()} for your generous donation!`,
        priceInCents: dollarsToCents(amount),
        quantity: BigInt(1),
        currency: 'USD',
      };

      const session = await createCheckout.mutateAsync([shoppingItem]);
      
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }

      window.location.href = session.url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      toast.error('Failed to initiate donation. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent mb-4">
          <Heart className="h-8 w-8 text-white fill-white" />
        </div>
        <h1 className="font-display text-4xl font-bold">Support Our Mission</h1>
        <p className="text-lg text-muted-foreground">
          Your donation helps Glitch Enterprises continue to provide exceptional products and services
        </p>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Make a Donation</CardTitle>
          <CardDescription>
            Choose an amount or enter your own. Every contribution matters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Select Amount</Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {PRESET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className={`
                    py-3 px-4 border-2 font-display font-bold transition-all
                    ${selectedAmount === amount
                      ? 'bg-primary text-primary-foreground border-primary shadow-glow-primary'
                      : 'bg-card border-border hover:border-primary/50'
                    }
                  `}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom">Custom Amount (USD)</Label>
            <Input
              id="custom"
              type="number"
              step="0.01"
              min="1"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              className="border-2 font-mono-numeric text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="donor">Your Name</Label>
            <Input
              id="donor"
              placeholder="Enter your name"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="border-2"
            />
          </div>

          {!isAuthenticated && (
            <div className="p-4 bg-muted border-2 border-border">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> You can donate without logging in. Simply enter your name and proceed with the payment.
              </p>
            </div>
          )}

          <Button
            onClick={handleDonate}
            disabled={createCheckout.isPending || !getEffectiveAmount() || !donorName.trim()}
            size="lg"
            className="w-full glitch-hover text-lg font-display"
          >
            {createCheckout.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Heart className="mr-2 h-5 w-5" />
                Donate {getEffectiveAmount() ? `$${getEffectiveAmount()}` : ''}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
