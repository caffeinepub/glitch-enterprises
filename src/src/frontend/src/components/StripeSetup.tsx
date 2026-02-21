import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useSetStripeConfiguration } from '../hooks/useQueries';
import { toast } from 'sonner';

interface StripeSetupProps {
  open: boolean;
  onClose: () => void;
}

export function StripeSetup({ open, onClose }: StripeSetupProps) {
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('US,CA,GB');
  const setConfig = useSetStripeConfiguration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!secretKey.trim()) {
      toast.error('Please enter your Stripe secret key');
      return;
    }

    const allowedCountries = countries.split(',').map(c => c.trim()).filter(Boolean);
    if (allowedCountries.length === 0) {
      toast.error('Please enter at least one country code');
      return;
    }

    try {
      await setConfig.mutateAsync({ secretKey: secretKey.trim(), allowedCountries });
      toast.success('Stripe configured successfully');
      onClose();
    } catch (error) {
      console.error('Failed to configure Stripe:', error);
      toast.error('Failed to configure Stripe');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Configure Stripe Payments</DialogTitle>
          <DialogDescription>
            Enter your Stripe credentials to enable payment processing for products and donations.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secretKey">Stripe Secret Key</Label>
            <Input
              id="secretKey"
              type="password"
              placeholder="sk_live_..."
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              disabled={setConfig.isPending}
              className="border-2 font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="countries">Allowed Countries (comma-separated)</Label>
            <Input
              id="countries"
              placeholder="US,CA,GB,AU"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
              disabled={setConfig.isPending}
              className="border-2"
            />
            <p className="text-xs text-muted-foreground">
              Use ISO country codes (e.g., US, CA, GB, AU, DE)
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={setConfig.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={setConfig.isPending || !secretKey.trim()}
              className="glitch-hover"
            >
              {setConfig.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {setConfig.isPending ? 'Configuring...' : 'Configure Stripe'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
