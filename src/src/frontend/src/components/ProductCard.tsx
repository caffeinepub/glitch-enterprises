import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '../backend';
import { formatPrice } from '../lib/format';

interface ProductCardProps {
  product: Product;
  adminMode?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export function ProductCard({ product, adminMode, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="overflow-hidden clip-corner border-2 glitch-hover hover:shadow-glow-primary transition-all">
      <div className="aspect-square bg-muted relative overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="font-mono-numeric bg-card/90 backdrop-blur-sm border-2">
            {formatPrice(product.price)}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-display text-lg font-semibold mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      {adminMode && (
        <CardFooter className="p-4 pt-0 gap-2 flex">
          <button
            onClick={() => onEdit?.(product)}
            className="flex-1 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(product.id)}
            className="flex-1 px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            Delete
          </button>
        </CardFooter>
      )}
    </Card>
  );
}
