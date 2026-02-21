import { Link } from '@tanstack/react-router';
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function PaymentFailure() {
  return (
    <div className="max-w-2xl mx-auto py-16 animate-fade-in">
      <Card className="border-2 text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-destructive/10 border-2 border-destructive flex items-center justify-center">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="font-display text-3xl">Payment Cancelled</CardTitle>
          <CardDescription className="text-lg">
            Your payment was cancelled. No charges have been made to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            If you encountered an issue or have questions, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button asChild variant="secondary" className="glitch-hover">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Store
              </Link>
            </Button>
            <Button asChild className="glitch-hover">
              <Link to="/donate">
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
