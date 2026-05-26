import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Swal from 'sweetalert2';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CirclePlus } from 'lucide-react';
import { createProduct } from '@/services/api';

const ProductAddDialog = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ productName: '', price: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productName || !form.price) {
      return Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Product name and price are required.',
        confirmButtonColor: '#f59e0b',
        position: 'center',
      });
    }

    if (Number(form.price) < 1) {
      return Swal.fire({
        icon: 'warning',
        title: 'Invalid Price',
        text: 'Price must be greater than 0.',
        confirmButtonColor: '#f59e0b',
        position: 'center',
      });
    }

    try {
      setLoading(true);

      await createProduct(form);

      setForm({
        productName: '',
        price: '',
      });

      setOpen(false);

      Swal.fire({
        icon: 'success',
        title: 'Product Added!',
        text: 'New product has been added successfully.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        position: 'center',
      });

      onSuccess();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Add Failed',
        text: err.response?.data?.error || 'Error adding product',
        confirmButtonColor: '#ef4444',
        position: 'center',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="cursor-pointer rounded-xl">
            <CirclePlus size={16} />
            Add Product
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-3 pb-4 border-b">
              <div>
                <DialogTitle className="text-base">Add product</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Fill in the details to add a new product
                </p>
              </div>
            </div>
          </DialogHeader>
          <FieldGroup className="gap-4 mt-4">
            <Field>
              <Label className="text-xs text-muted-foreground font-medium">
                Product name
              </Label>
              <Input
                className="mt-1"
                placeholder="Enter product name..."
                value={form.productName}
                onChange={(e) =>
                  setForm({ ...form, productName: e.target.value })
                }
              />
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground font-medium">
                Price
              </Label>
              <Input
                className="mt-1"
                type="number"
                min={1}
                placeholder="Enter price..."
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4 pt-4 border-t flex flex-col sm:flex-row gap-2">
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              }
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductAddDialog;
