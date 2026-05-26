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
import { Eye } from 'lucide-react';
import { markOrderAsCompleted } from '@/services/api';

const MaterialModeBadge = ({ mode }) => {
  const config = {
    AUTO: {
      label: '⚡ AUTO',
      className: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    },
    MANUAL: {
      label: '✏️ MANUAL',
      className: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
    },
    OFF: {
      label: '⊘ OFF',
      className: 'bg-muted text-muted-foreground border border-border',
    },
  };

  const currentMode = mode?.toUpperCase() || 'OFF';
  const { label, className } = config[currentMode] || config.OFF;

  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${className}`}
    >
      {label}
    </span>
  );
};

const generateMaterials = (order) => {
  if (!order) return [];

  const qty = order.quantity || 1;

  const baseMaterials = {
    'Sliding Roller': [
      { name: 'Roller Wheel Set', unit: qty * 2 },
      { name: 'Steel Bracket', unit: qty * 2 },
      { name: 'Mounting Screws', unit: qty * 4 },
    ],

    'Silicone Sealant': [{ name: 'Silicone Tube', unit: qty }],

    'Glass Clamp': [
      { name: 'Glass Clamp Set', unit: qty * 2 },
      { name: 'Rubber Gasket', unit: qty * 2 },
      { name: 'Stainless Bolts', unit: qty * 4 },
    ],

    'Door Lock Set': [
      { name: 'Lock Body', unit: qty },
      { name: 'Handle Set', unit: qty },
      { name: 'Keys Set', unit: qty },
    ],

    'Rubber Seal': [{ name: 'EPDM Rubber Seal', unit: qty }],

    'Aluminum Channel': [
      { name: 'Aluminum U Channel', unit: qty },
      { name: 'Fixing Screws', unit: qty * 6 },
    ],

    'Aluminum Frame': [
      { name: 'Aluminum Bar', unit: qty * 4 },
      { name: 'Corner Connector', unit: qty * 4 },
      { name: 'Self-tapping Screws', unit: qty * 12 },
    ],

    'Shower Enclosure': [
      { name: 'Tempered Glass Panel', unit: qty * 2 },
      { name: 'Hinge Set', unit: qty * 2 },
      { name: 'Glass Clamp Set', unit: qty * 4 },
      { name: 'Silicone Sealant', unit: qty },
      { name: 'Aluminum Frame Kit', unit: qty * 1 },
    ],

    'Glass Partition': [
      { name: 'Tempered Glass Panel', unit: qty * 2 },
      { name: 'Aluminum Frame', unit: qty * 4 },
      { name: 'Glass Clamp Set', unit: qty * 6 },
      { name: 'Rubber Seal', unit: qty },
    ],

    'Aluminum Kitchen Cabinet': [
      { name: 'Aluminum Frame', unit: qty * 6 },
      { name: 'Aluminum Panel', unit: qty * 4 },
      { name: 'Hinge Set', unit: qty * 6 },
      { name: 'Handle Set', unit: qty * 3 },
      { name: 'Screws Set', unit: qty * 20 },
    ],

    'Mirror Glass': [
      { name: 'Mirror Glass Panel', unit: qty },
      { name: 'Mounting Clips', unit: qty * 4 },
      { name: 'Rubber Spacer', unit: qty * 4 },
    ],

    'Tinted Glass Panel': [{ name: 'Tinted Tempered Glass', unit: qty }],

    'Clear Glass Panel': [{ name: 'Clear Tempered Glass', unit: qty }],

    'Tempered Glass Panel': [{ name: 'Tempered Glass Sheet', unit: qty }],

    'Tempered Glass Door': [
      { name: 'Tempered Glass Door Panel', unit: qty },
      { name: 'Door Handle Set', unit: qty },
      { name: 'Hinge Set', unit: qty * 2 },
    ],

    'Frameless Glass Door': [
      { name: 'Tempered Glass Door Panel', unit: qty },
      { name: 'Patch Fitting Set', unit: qty * 2 },
      { name: 'Floor Spring / Pivot', unit: qty },
      { name: 'Door Handle', unit: qty },
    ],

    'Sliding Glass Door': [
      { name: 'Tempered Glass Panel', unit: qty * 2 },
      { name: 'Sliding Track Set', unit: qty },
      { name: 'Roller Set', unit: qty * 2 },
      { name: 'Handle Set', unit: qty },
    ],

    'Aluminum Glass Door': [
      { name: 'Aluminum Frame Door Kit', unit: qty },
      { name: 'Tempered Glass Panel', unit: qty },
      { name: 'Door Handle Set', unit: qty },
      { name: 'Hinge Set', unit: qty * 2 },
    ],

    'Louver Window': [
      { name: 'Aluminum Louver Frame', unit: qty },
      { name: 'Glass Louver Blades', unit: qty * 6 },
      { name: 'Operating Handle', unit: qty },
    ],

    'Fixed Glass Window': [
      { name: 'Tempered Glass Panel', unit: qty },
      { name: 'Aluminum Frame', unit: qty * 4 },
      { name: 'Rubber Seal', unit: qty },
    ],

    'Aluminum Awning Window': [
      { name: 'Aluminum Frame Set', unit: qty },
      { name: 'Awning Hinges', unit: qty * 2 },
      { name: 'Tempered Glass Panel', unit: qty },
      { name: 'Handle Set', unit: qty },
    ],

    'Aluminum Casement Window': [
      { name: 'Aluminum Frame Set', unit: qty },
      { name: 'Hinge Set', unit: qty * 2 },
      { name: 'Tempered Glass Panel', unit: qty },
      { name: 'Lock Handle', unit: qty },
    ],

    'Aluminum Sliding Window': [
      { name: 'Aluminum Frame Set', unit: qty },
      { name: 'Sliding Roller Set', unit: qty * 2 },
      { name: 'Tempered Glass Panel', unit: qty },
      { name: 'Track Rail', unit: qty },
    ],
  };

  return (
    baseMaterials[order.productName] || [
      { name: 'General Material', unit: qty },
    ]
  );
};

const ViewDialog = ({ order, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const materials = generateMaterials(order);

  const handleMarkAsCompleted = async () => {
    try {
      setLoading(true);

      await markOrderAsCompleted(order?.orderID);

      setOpen(false);

      Swal.fire({
        icon: 'success',
        title: 'For Installation',
        timer: 2000,
        showConfirmButton: false,
      });

      onSuccess();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer rounded-md">
          <Eye />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">View Order</DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            View customer order information below
          </p>
        </DialogHeader>

        <div className="max-h-[55vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent space-y-4">
          <div className="border-t pt-4 space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Customer
            </p>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-medium">
                  {order?.customerName || '—'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Products
            </p>
            <div className="flex justify-between text-sm">
              <span>
                {order?.productName || '—'} (x{order?.quantity || 0})
              </span>
              <span className="text-green-600 font-medium">
                ₱{Number(order?.subTotal || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="border-t pt-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                Measurement
              </p>
              <p className="text-sm font-medium text-foreground">
                {order?.width || 0} × {order?.height || 0}
                <span className="text-xs text-muted-foreground font-normal ml-1">
                  (W × H)
                </span>
              </p>

              <div className="pt-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                  Specs
                </p>
                <p className="text-sm text-foreground font-medium wrap-break-word">
                  {order?.specification || '—'}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Materials
                </p>
                <MaterialModeBadge mode={order?.requestType} />
              </div>

              {order?.requestType === 'AUTO' ? (
                materials.length > 0 ? (
                  materials.map((m, idx) => (
                    <p key={idx} className="text-sm text-muted-foreground">
                      {m.name} (
                      <span className="text-foreground font-medium">
                        {m.unit}
                      </span>
                      )
                    </p>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No materials generated
                  </p>
                )
              ) : (
                <p className="text-xs text-yellow-500 italic">
                  Manual mode (No suggestions)
                </p>
              )}
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <p className="text-sm font-medium">Total</p>
            <p className="text-base sm:text-lg font-medium text-green-600">
              ₱{Number(order?.subTotal || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          {order?.orderStatus === 'Pending' && (
            <Button
              type="button"
              onClick={handleMarkAsCompleted}
              disabled={loading}
              className="cursor-pointer w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
            >
              {loading ? 'Processing...' : 'Ready for Installation'}
            </Button>
          )}
          <DialogClose asChild>
            <Button
              variant="outline"
              className="cursor-pointer w-full sm:w-auto"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDialog;
