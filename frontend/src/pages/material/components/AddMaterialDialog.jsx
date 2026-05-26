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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createMaterial } from '@/services/api';

const AddMaterialDialog = ({ suppliers = [], onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ materialName: '', supplierID: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.materialName || !form.supplierID) {
      return Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Material name and supplier are required.',
        confirmButtonColor: '#f59e0b',
        position: 'center',
      });
    }

    try {
      setLoading(true);

      await createMaterial(form);

      setForm({
        materialName: '',
        supplierID: '',
      });

      setOpen(false);

      Swal.fire({
        icon: 'success',
        title: 'Material Added!',
        text: 'New material has been added successfully.',
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
        text: err.response?.data?.error || 'Error adding material',
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
            Add Material
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-3 pb-4 border-b">
              <div>
                <DialogTitle className="text-base">Add material</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Fill in the details to add a new material
                </p>
              </div>
            </div>
          </DialogHeader>
          <FieldGroup className="gap-4 mt-4">
            <Field>
              <Label className="text-xs text-muted-foreground font-medium">
                Material name
              </Label>
              <Input
                className="mt-1"
                placeholder="Enter material name..."
                value={form.materialName}
                onChange={(e) =>
                  setForm({ ...form, materialName: e.target.value })
                }
              />
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground font-medium">
                Supplier
              </Label>
              <Select
                onValueChange={(val) => setForm({ ...form, supplierID: val })}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent className="max-h-40 overflow-y-auto">
                  <SelectGroup>
                    <SelectLabel>Suppliers</SelectLabel>
                    {suppliers.map((s) => (
                      <SelectItem
                        key={s.supplierID}
                        value={String(s.supplierID)}
                      >
                        {s.supplierName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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

export default AddMaterialDialog;
