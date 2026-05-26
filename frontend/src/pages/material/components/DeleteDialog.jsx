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
import { deleteMaterial } from '@/services/api';

const DeleteDialog = ({ materialID, materialName, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteMaterial(materialID);

      setOpen(false);

      Swal.fire({
        icon: 'success',
        title: 'Material Deleted!',
        text: 'Material has been removed successfully.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        position: 'center',
      });

      onSuccess();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Cannot Delete Material',
        text: 'This material is already associated with existing requests or records and can no longer be deleted.',
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
              <DialogTitle className="text-base">Delete material</DialogTitle>
              <DialogDescription className="text-xs mt-1">
                Are you sure you want to delete <strong>{materialName}</strong>?
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
