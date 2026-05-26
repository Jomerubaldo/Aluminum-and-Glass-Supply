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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SquarePen } from 'lucide-react';
import { updateCustomer } from '@/services/api';

const EditDialog = ({ customer, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    phoneNumber: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setForm({
        customerName: customer.customerName,
        phoneNumber: customer.phoneNumber || '',
        address: customer.address,
      });
    }
  }, [customer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateCustomer(customer.customerID, form);

      setOpen(false);

      Swal.fire({
        icon: 'success',
        title: 'Updated Successfully!',
        text: 'Customer information has been updated.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      onSuccess();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.error || 'Error updating customer',
        background: '#0f172a',
        color: '#fff',
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
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer rounded-md"
          >
            <SquarePen />
          </Button>
        }
      />
      <DialogContent className="w-full max-w-[90vw] sm:max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 pb-4 border-b">
            <div>
              <DialogTitle className="text-base">Edit Customer</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update customer information below
              </p>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-4 mt-4">
            <Field>
              <Label className="text-xs text-muted-foreground font-medium">
                Full name
              </Label>
              <Input
                className="mt-1"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground font-medium">
                Phone number
              </Label>
              <Input
                className="mt-1"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel className="text-xs text-muted-foreground font-medium">
                Address
              </FieldLabel>
              <Textarea
                className="mt-1 resize-none"
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6 pt-4 border-t flex flex-col sm:flex-row gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full sm:w-auto"
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer w-full sm:w-auto"
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
