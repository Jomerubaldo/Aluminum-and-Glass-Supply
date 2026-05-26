import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import CustomerTableList from './components/CustomerTableList';
import CustomerAddDialog from './components/CustomerAddDialog';
import { getCustomers } from '@/services/api';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) =>
    c.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full bg-background w-full flex flex-col overflow-hidden p-4 sm:p-5 lg:p-6">
      <div className="shrink-0 mb-5">
        <h1 className="text-xl lg:text-2xl font-bold text-foreground">
          Customer Management
        </h1>
        <p className="text-sm text-muted-foreground hidden sm:block">
          Add and manage customer records
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
        <CustomerAddDialog onSuccess={fetchCustomers} />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-border shadow-sm">
        <CustomerTableList
          customers={filtered}
          loading={loading}
          onSuccess={fetchCustomers}
        />
      </div>
    </div>
  );
};

export default CustomerPage;
