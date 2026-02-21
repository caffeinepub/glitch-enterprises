import { useGetAllProducts } from '../hooks/useQueries';
import { ProductCard } from '../components/ProductCard';
import { Loader2, Store } from 'lucide-react';

export function Storefront() {
  const { data: products = [], isLoading } = useGetAllProducts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-3">
        <h1 className="font-display text-5xl font-bold tracking-tight">
          Welcome to <span className="text-primary">Glitch Enterprises</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our curated selection of premium products
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border">
          <Store className="h-20 w-20 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="font-display text-2xl font-semibold mb-2">Store Opening Soon</h3>
          <p className="text-muted-foreground text-lg">
            We're preparing our product catalog. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
