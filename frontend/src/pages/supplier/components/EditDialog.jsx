import { useState, useEffect } from 'react';
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
import { SquarePen } from 'lucide-react';
import { updateSupplier } from '@/services/api';

const EditDialog = ({ supplier, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ supplierName: '', contact: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supplier)
      setForm({
        supplierName: supplier.supplierName,
        contact: supplier.contact,
      });
  }, [supplier]);

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
        title: 'Updating supplier...',
        text: 'Please wait while changes are being saved.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await updateSupplier(supplier.supplierID, form);

      Swal.close();

      await Swal.fire({
        icon: 'success',
        title: 'Supplier Updated!',
        text: `${form.supplierName} has been updated successfully.`,
        confirmButtonColor: '#22c55e',
        timer: 1800,
        showConfirmButton: false,
      });

      setOpen(false);
      onSuccess();
    } catch (err) {
      Swal.close();

      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text:
          err.response?.data?.error ||
          'Something went wrong while updating supplier.',
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
          <Button variant="outline" className="cursor-pointer rounded-md">
            <SquarePen />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-3 pb-4 border-b">
              <div>
                <DialogTitle className="text-base">Edit Supplier</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update supplier details below
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

export default EditDialog;
