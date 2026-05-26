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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createOrder } from '@/services/api';

const OrderAddDialog = ({ customers = [], products = [], onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestType, setRequestType] = useState('AUTO');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [form, setForm] = useState({
    customerID: '',
    productID: '',
    quantity: 1,
    height: '',
    width: '',
    specification: '',
  });

  const handleProductChange = (productID) => {
    const product = products.find((p) => String(p.productID) === productID);
    setSelectedProduct(product || null);
    setForm((prev) => ({
      ...prev,
      productID,
    }));
  };

  const total = selectedProduct ? selectedProduct.price * form.quantity : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customerID || !form.productID) {
      return Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Customer and product are required.',
      });
    }

    try {
      setLoading(true);

      await createOrder({
        ...form,
        requestType,
        price: selectedProduct?.price || 0,
      });

      setForm({
        customerID: '',
        productID: '',
        quantity: 1,
        height: '',
        width: '',
        specification: '',
      });

      setSelectedProduct(null);
      setRequestType('AUTO');
      setOpen(false);

      Swal.fire({
        icon: 'success',
        title: 'Order Created!',
        timer: 2000,
        showConfirmButton: false,
      });

      onSuccess();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.error || 'Error creating order',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="cursor-pointer w-full sm:w-auto rounded-full">
            <CirclePlus size={16} />
            Create Order
          </Button>
        }
      />

      <DialogContent className="w-full max-w-[90vw] sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Create Order
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Fill in the customer order details below
            </p>
          </DialogHeader>

          <div className="max-h-[55vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent space-y-4 mt-4 border-t pt-4">
            <Field className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Customer
              </Label>
              <Select
                onValueChange={(val) => setForm({ ...form, customerID: val })}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.customerID} value={String(c.customerID)}>
                      {c.customerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field className="space-y-1">
                <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Product
                </Label>
                <Select onValueChange={handleProductChange}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.productID} value={String(p.productID)}>
                        {p.productName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field className="space-y-1">
                <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Quantity
                </Label>
                <Input
                  type="number"
                  min={1}
                  className="text-sm"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantity: Number(e.target.value),
                    })
                  }
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field className="space-y-1">
                <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Price
                </Label>
                <Input
                  value={
                    selectedProduct
                      ? `₱${selectedProduct.price.toLocaleString()}`
                      : '—'
                  }
                  readOnly
                  className="bg-muted text-sm font-medium"
                />
              </Field>

              <Field className="space-y-1">
                <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Measurement (W × H)
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="W"
                    className="text-sm text-center"
                    value={form.width}
                    onChange={(e) =>
                      setForm({ ...form, width: e.target.value })
                    }
                  />
                  <span className="self-center text-xs text-muted-foreground">
                    ×
                  </span>
                  <Input
                    placeholder="H"
                    className="text-sm text-center"
                    value={form.height}
                    onChange={(e) =>
                      setForm({ ...form, height: e.target.value })
                    }
                  />
                </div>
              </Field>
            </div>

            <Field className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Specification
              </Label>
              <Input
                placeholder="Enter specifications..."
                className="text-sm"
                value={form.specification}
                onChange={(e) =>
                  setForm({
                    ...form,
                    specification: e.target.value,
                  })
                }
              />
            </Field>

            <Field className="space-y-2 border-t pt-3">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Material Requirements
              </Label>
              <RadioGroup
                value={requestType}
                onValueChange={setRequestType}
                className="flex gap-6 pt-1"
              >
                {['AUTO', 'MANUAL'].map((type) => (
                  <div
                    key={type}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <RadioGroupItem value={type} id={`add-mode-${type}`} />
                    <Label
                      htmlFor={`add-mode-${type}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {type === 'AUTO' ? 'AUTO' : 'MANUAL'}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div
                className={`text-xs p-2.5 rounded-md border mt-2 ${
                  requestType === 'AUTO'
                    ? 'bg-blue-500/5 text-blue-600 border-blue-500/10'
                    : 'bg-yellow-500/5 text-yellow-600 border-yellow-500/10'
                }`}
              >
                {requestType === 'AUTO'
                  ? `System will auto-generate materials needed for ${selectedProduct?.productName || 'the product'}.`
                  : 'Manual mode enabled. No suggestions will be populated.'}
              </div>
            </Field>

            <div className="border-t pt-4 flex justify-between items-center">
              <p className="text-sm font-medium">Total</p>
              <p className="text-base sm:text-lg font-medium text-green-600">
                ₱{total.toLocaleString()}
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t mt-4">
            <Button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full sm:w-auto bg-foreground transition-colors"
            >
              {loading ? 'Saving...' : 'Save Order'}
            </Button>
            <DialogClose
              render={
                <Button
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

export default OrderAddDialog;
