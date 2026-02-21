import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload } from 'lucide-react';
import { useCreateProduct, useUpdateProduct } from '../hooks/useQueries';
import { uploadImageFile } from '../lib/storage';
import { dollarsToCents, centsToDollars } from '../lib/format';
import { toast } from 'sonner';
import type { Product } from '../backend';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductForm({ open, onClose, product }: ProductFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const isEditMode = !!product;

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(centsToDollars(product.price).toString());
      setImageUrl(product.imageUrl);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
    }
  }, [product]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const url = await uploadImageFile(file, setUploadProgress);
      setImageUrl(url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim() || !price || !imageUrl) {
      toast.error('Please fill in all fields');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const priceInCents = dollarsToCents(priceNum);

    try {
      if (isEditMode && product) {
        await updateProduct.mutateAsync({
          id: product.id,
          name: name.trim(),
          description: description.trim(),
          price: priceInCents,
          imageUrl,
        });
        toast.success('Product updated successfully');
      } else {
        await createProduct.mutateAsync({
          name: name.trim(),
          description: description.trim(),
          price: priceInCents,
          imageUrl,
        });
        toast.success('Product created successfully');
      }
      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product');
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update product information' : 'Create a new product for your store'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="border-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              rows={3}
              className="border-2 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isPending}
              className="border-2 font-mono-numeric"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                disabled={uploading || isPending}
                className="relative"
                asChild
              >
                <label htmlFor="image" className="cursor-pointer">
                  {uploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {uploading ? `Uploading ${uploadProgress}%` : 'Upload Image'}
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading || isPending}
                    className="sr-only"
                  />
                </label>
              </Button>
              {imageUrl && (
                <div className="flex-1">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-16 w-16 object-cover border-2 border-border clip-corner"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isPending || uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || uploading || !name.trim() || !description.trim() || !price || !imageUrl}
              className="glitch-hover"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
