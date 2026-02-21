import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function PaymentSuccess() {
  useEffect(() => {
    // Confetti or celebration animation could go here
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-16 animate-fade-in">
      <Card className="border-2 text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="font-display text-3xl">Payment Successful!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for your support. Your transaction has been completed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            You will receive a confirmation email shortly with your receipt.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button asChild className="glitch-hover">
              <Link to="/">
                <ArrowRight className="mr-2 h-4 w-4" />
                Back to Store
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
