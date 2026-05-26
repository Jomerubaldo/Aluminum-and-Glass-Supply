import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import ViewDialog from './ViewDialog';
import EditDialog from './EditDialog';
import DeleteDialog from './DeleteDialog';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  'For Installation': 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
};

const OrderTableList = ({
  orders = [],
  customers = [],
  products = [],
  loading,
  onSuccess,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const update = () => {
      setItemsPerPage(window.innerWidth < 640 ? 6 : 8);
      setCurrentPage(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedData = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1)
        pages.push(i);
    }
    const result = [];
    let prev = null;
    for (const p of pages) {
      if (prev !== null && p - prev > 1) result.push('...');
      result.push(p);
      prev = p;
    }
    return result;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      ) : orders.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          No orders found
        </div>
      ) : (
        <>
          <div className="min-h-0 overflow-auto flex-1">
            <Table className="w-full border-b">
              <TableHeader className="sticky top-0 z-10 bg-input">
                <TableRow>
                  <TableHead className="font-bold text-sm sm:text-base lg:text-md">
                    Customer Name
                  </TableHead>
                  <TableHead className="font-bold text-sm sm:text-base lg:text-md">
                    Order Date
                  </TableHead>
                  <TableHead className="font-bold text-sm sm:text-base lg:text-md">
                    Status
                  </TableHead>
                  <TableHead className="font-bold text-sm sm:text-base lg:text-md text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="bg-card">
                {paginatedData.map((data) => {
                  const months = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ];

                  const d = new Date(data.orderDate);

                  const formattedDate = data.orderDate
                    ? `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
                    : '—';

                  return (
                    <TableRow key={data.orderID} className="h-[61.5px]">
                      <TableCell className="font-medium">
                        {data.customerName}
                      </TableCell>

                      <TableCell>{formattedDate}</TableCell>

                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[data.orderStatus] || ''
                          }`}
                        >
                          {data.orderStatus}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <EditDialog
                            order={data}
                            customers={customers}
                            products={products}
                            onSuccess={onSuccess}
                          />

                          <ViewDialog order={data} onSuccess={onSuccess} />

                          <DeleteDialog
                            orderID={data.orderID}
                            customerName={data.customerName}
                            onSuccess={onSuccess}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {Array.from({
                  length: Math.max(0, itemsPerPage - paginatedData.length),
                }).map((_, i) => (
                  <TableRow
                    key={`e-${i}`}
                    className="h-[61.5px] pointer-events-none"
                  >
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="shrink-0 bg-card py-3 border-t">
            <Pagination>
              <PaginationContent className="flex-wrap justify-center gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage((p) => p - 1);
                    }}
                    className={
                      currentPage === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page, i) =>
                  page === '...' ? (
                    <PaginationItem key={`e-${i}`}>
                      <span className="px-2 text-sm text-muted-foreground">
                        …
                      </span>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage((p) => p + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderTableList;
