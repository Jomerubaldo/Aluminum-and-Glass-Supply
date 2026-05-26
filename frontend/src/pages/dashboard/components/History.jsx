import { useState, useEffect } from 'react';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axios from 'axios';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-600',
  'For Installation': 'bg-blue-100 text-blue-600',
  Completed: 'bg-green-100 text-green-600',
};

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/dashboard/history'
        );
        setTransactions(res.data);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered = transactions.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.product.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-card mx-5 rounded-xl border border-border shadow-sm p-5 overflow-hidden">
      <div className="shrink-0 flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-left font-bold text-xl">Transaction History</h1>
        <Field className="w-full sm:max-w-sm lg:max-w-md">
          <ButtonGroup className="w-full">
            <Input
              placeholder="Search customer or product..."
              className="bg-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </ButtonGroup>
        </Field>
      </div>

      <div className="h-96 overflow-y-auto">
        <table className="w-full text-sm caption-bottom">
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead className="text-sm sm:text-base border-l-2">
                Customer
              </TableHead>
              <TableHead className="text-sm sm:text-base">Product</TableHead>
              <TableHead className="text-sm sm:text-base text-right">
                Amount
              </TableHead>
              <TableHead className="text-sm sm:text-base text-center">
                Status
              </TableHead>
              <TableHead className="text-sm sm:text-base text-right">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-card">
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((data, index) => (
                <TableRow key={index} className="h-auto border-b">
                  <TableCell className="text-sm font-medium border-l-2 py-3">
                    {data.name}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground py-3">
                    <span
                      className="block truncate max-w-[120px] sm:max-w-[180px] lg:max-w-none"
                      title={data.product}
                    >
                      {data.product}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm font-medium text-green-600 text-right py-3">
                    ₱
                    {Number(data.totalAmount).toLocaleString('en-PH', {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>

                  <TableCell className="text-center py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[data.status] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {data.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground text-right border-r-2 py-3">
                    {data.date}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </table>
      </div>
    </div>
  );
};

export default History;
