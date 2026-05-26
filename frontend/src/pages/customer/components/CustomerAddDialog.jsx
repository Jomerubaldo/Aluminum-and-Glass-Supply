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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CirclePlus } from 'lucide-react';
import { createCustomer } from '@/services/api';

const CustomerAddDialog = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    phoneNumber: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customerName || !form.address) {
      return Swal.fire({
        icon: 'warning',
        title: 'Required Fields',
        text: 'Name and address are required',
      });
    }

    try {
      setLoading(true);

      await createCustomer(form);

      Swal.fire({
        icon: 'success',
        title: 'Customer Added!',
        text: 'Customer has been added successfully.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      setForm({
        customerName: '',
        phoneNumber: '',
        address: '',
      });

      setOpen(false);

      onSuccess();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Number linked to an existing account',
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
            variant="default"
            className="cursor-pointer w-full sm:w-auto rounded-xl"
          >
            <CirclePlus /> Add Customer
          </Button>
        }
      />
      <DialogContent className="w-full max-w-[90vw] sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-3 pb-4 border-b mb-5">
              <div>
                <DialogTitle className="text-base">Add Customer</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Fill in the details to add a new customer
                </p>
              </div>
            </div>
          </DialogHeader>
          <FieldGroup className="gap-4">
            <Field>
              <Label>Name</Label>
              <Input
                placeholder="Juan Dela Cruz"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />
            </Field>
            <Field>
              <Label>Phone</Label>
              <Input
                placeholder="+63 9XXXXXXXXX"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel>Address</FieldLabel>
              <Textarea
                placeholder="Type address here."
                className="resize-none"
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

export default CustomerAddDialog;
