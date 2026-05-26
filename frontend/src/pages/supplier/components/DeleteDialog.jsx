import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import Swal from 'sweetalert2';
import { Trash2 } from 'lucide-react';
import { deleteSupplier } from '@/services/api';

const DeleteDialog = ({ supplierID, supplierName, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Delete supplier?',
      text: `Are you sure you want to delete ${supplierName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      Swal.fire({
        title: 'Deleting supplier...',
        text: 'Please wait while supplier is being removed.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await deleteSupplier(supplierID);

      Swal.close();

      await Swal.fire({
        icon: 'success',
        title: 'Supplier Deleted!',
        text: `${supplierName} has been removed successfully.`,
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
        title: 'Delete failed',
        text: 'Cannot delete this Supplier because it is currently in use by other records.',
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
            variant="destructive"
            className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md"
          >
            <Trash2 />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex flex-col items-center text-center gap-3 pb-4 border-b">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <div>
              <DialogTitle className="text-base">Delete supplier</DialogTitle>
              <DialogDescription className="text-xs mt-1">
                Are you sure you want to delete <strong>{supplierName}</strong>?
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
            className="cursor-pointer"
          >
            {loading ? 'Deleting...' : 'Delete'}
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
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
