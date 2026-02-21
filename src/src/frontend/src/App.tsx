import { RouterProvider, createRouter, createRoute, createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from './hooks/useQueries';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProfileSetup } from './components/ProfileSetup';
import { Storefront } from './pages/Storefront';
import { Donate } from './pages/Donate';
import { ProductManagement } from './pages/ProductManagement';
import { DonationsView } from './pages/DonationsView';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentFailure } from './pages/PaymentFailure';
import { Toaster } from '@/components/ui/sonner';
import { Shield, Package, DollarSign, Settings, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { useIsStripeConfigured } from './hooks/useQueries';
import { StripeSetup } from './components/StripeSetup';

// Root layout component
function RootLayout() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {showProfileSetup && <ProfileSetup open={showProfileSetup} />}
    </div>
  );
}

// Admin layout with access control
function AdminLayout() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const [stripeSetupOpen, setStripeSetupOpen] = useState(false);
  const { data: isStripeConfigured, isLoading: stripeLoading } = useIsStripeConfigured();

  useEffect(() => {
    if (!stripeLoading && isStripeConfigured === false && isAdmin) {
      setStripeSetupOpen(true);
    }
  }, [isStripeConfigured, stripeLoading, isAdmin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!identity || !isAdmin) {
    return (
      <div className="text-center py-20 space-y-4 animate-fade-in">
        <Shield className="h-20 w-20 mx-auto text-muted-foreground opacity-50" />
        <h2 className="font-display text-3xl font-bold">Access Denied</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          You must be logged in as an administrator to access this area.
        </p>
        <Link 
          to="/" 
          className="inline-block mt-6 px-6 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors glitch-hover"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your business operations
          </p>
        </div>
        <button
          onClick={() => setStripeSetupOpen(true)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 glitch-hover"
        >
          <Settings className="h-4 w-4" />
          Stripe Settings
        </button>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
          <TabsTrigger value="products" asChild className="gap-2">
            <Link to="/admin">
              <Package className="h-4 w-4" />
              Products
            </Link>
          </TabsTrigger>
          <TabsTrigger value="donations" asChild className="gap-2">
            <Link to="/admin/donations">
              <DollarSign className="h-4 w-4" />
              Donations
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Outlet />

      <StripeSetup open={stripeSetupOpen} onClose={() => setStripeSetupOpen(false)} />
    </div>
  );
}

// Route definitions
const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Storefront,
});

const donateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/donate',
  component: Donate,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccess,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailure,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayout,
});

const adminIndexRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: ProductManagement,
});

const adminDonationsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/donations',
  component: DonationsView,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  donateRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  adminRoute.addChildren([
    adminIndexRoute,
    adminDonationsRoute,
  ]),
]);

// Create router
const router = createRouter({ routeTree });

// Type declaration for router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
