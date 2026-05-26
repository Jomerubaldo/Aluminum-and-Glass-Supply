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
import { createSupplier } from '@/services/api';

const SupplierAddDialog = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ supplierName: '', contact: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.supplierName || !form.contact) {
      return Swal.fire({
        icon: 'warning',
        title: 'Missing information',
        text: 'Supplier name and contact are required.',
        confirmButtonColor: '#f59e0b',
      });
    }

    try {
      setLoading(true);

      Swal.fire({
        title: 'Adding supplier...',
        text: 'Please wait while the supplier is being saved.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await createSupplier(form);

      Swal.close();

      await Swal.fire({
        icon: 'success',
        title: 'Supplier Added!',
        text: `${form.supplierName} has been added successfully.`,
        confirmButtonColor: '#22c55e',
        timer: 1800,
        showConfirmButton: false,
      });

      setForm({
        supplierName: '',
        contact: '',
      });

      setOpen(false);
      onSuccess();
    } catch (err) {
      Swal.close();

      Swal.fire({
        icon: 'error',
        title: 'Failed to add supplier',
        text:
          err.response?.data?.error ||
          'Something went wrong while adding supplier.',
        confirmButtonColor: '#ef4444',
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
            Add Supplier
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-3 pb-4 border-b">
              <div>
                <DialogTitle className="text-base">Add Supplier</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Fill in the details to add a new supplier
                </p>
              </div>
            </div>
          </DialogHeader>
          <FieldGroup className="gap-4 mt-4">
            <Field>
              <Label className="text-xs text-muted-foreground font-medium">
                Supplier name
              </Label>
              <Input
                className="mt-1"
                placeholder="Enter supplier name..."
                value={form.supplierName}
                onChange={(e) =>
                  setForm({ ...form, supplierName: e.target.value })
                }
              />
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground font-medium">
                Contact
              </Label>
              <Input
                className="mt-1"
                placeholder="Enter contact number..."
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
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

export default SupplierAddDialog;
