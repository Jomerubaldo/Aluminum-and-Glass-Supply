import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import OrderTableList from './components/OrderTableList';
import OrderAddDialog from './components/OrderAddDialog';
import { getOrders, getCustomers, getProducts } from '@/services/api';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const [ordRes, cusRes, proRes] = await Promise.all([
        getOrders(),
        getCustomers(),
        getProducts(),
      ]);
      setOrders(ordRes.data);
      setCustomers(cusRes.data);
      setProducts(proRes.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = orders
    .filter((o) => o.orderStatus === 'Pending')
    .filter((o) => o.customerName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full bg-background w-full flex flex-col overflow-hidden p-4 sm:p-5 lg:p-6">
      <div className="shrink-0 mb-5">
        <h1 className="text-xl lg:text-2xl font-bold">Order Management</h1>
        <p className="text-sm text-muted-foreground hidden sm:block">
          Create and track customer orders
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
        <OrderAddDialog
          customers={customers}
          products={products}
          onSuccess={fetchData}
        />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-border shadow-sm">
        <OrderTableList
          orders={filtered}
          customers={customers}
          products={products}
          loading={loading}
          onSuccess={fetchData}
        />
      </div>
    </div>
  );
};

export default OrderPage;
