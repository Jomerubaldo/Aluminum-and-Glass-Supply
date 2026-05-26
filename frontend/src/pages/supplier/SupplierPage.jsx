import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import SupplierTableList from './components/SupplierTableList';
import SupplierAddDialog from './components/SupplierAddDialog';
import { getSuppliers } from '@/services/api';

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSuppliers = async () => {
    try {
      const res = await getSuppliers();
      setSuppliers(res.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filtered = suppliers.filter((s) =>
    s.supplierName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full bg-background w-full flex flex-col overflow-hidden p-4 sm:p-5 lg:p-6">
      <div className="shrink-0 mb-5">
        <h1 className="text-xl lg:text-2xl font-bold">Supplier Management</h1>
        <p className="text-sm text-muted-foreground hidden sm:block">
          Add and manage supplier records
        </p>
      </div>
      <div className="shrink-0 flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <Field className="w-full sm:max-w-sm lg:max-w-md">
          <ButtonGroup className="w-full">
            <Input
              placeholder="Type to search..."
              className="w-full bg-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </ButtonGroup>
        </Field>
        <SupplierAddDialog onSuccess={fetchSuppliers} />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-border shadow-sm">
        <SupplierTableList
          suppliers={filtered}
          loading={loading}
          onSuccess={fetchSuppliers}
        />
      </div>
    </div>
  );
};

export default SupplierPage;
