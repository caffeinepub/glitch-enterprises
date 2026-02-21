import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { ProductForm } from '../components/ProductForm';
import { useGetAllProducts, useDeleteProduct } from '../hooks/useQueries';
import { Loader2, Plus, Package } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function ProductManagement() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const { data: products = [], isLoading } = useGetAllProducts();
  const deleteProduct = useDeleteProduct();

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct.mutateAsync(productToDelete);
      toast.success('Product deleted successfully');
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingProduct(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold">Product Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button onClick={handleAddProduct} className="glitch-hover gap-2">
          <Plus className="h-5 w-5" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-display text-xl font-semibold mb-2">No products yet</h3>
          <p className="text-muted-foreground mb-6">
            Get started by adding your first product
          </p>
          <Button onClick={handleAddProduct} className="glitch-hover">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              adminMode
              onEdit={handleEditProduct}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <ProductForm
        open={formOpen}
        onClose={handleCloseForm}
        product={editingProduct}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteProduct.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteProduct.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProduct.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
