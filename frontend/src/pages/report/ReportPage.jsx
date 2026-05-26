import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
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
import { getSales } from '@/services/api';

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const fetchReports = async () => {
    try {
      const res = await getSales();
      setReports(res.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filtered = reports.filter((r) =>
    r.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalSales = filtered.reduce(
    (sum, r) => sum + Number(r.totalAmount),
    0
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
    <div className="h-full bg-background w-full flex flex-col overflow-hidden p-4 sm:p-5 lg:p-6">
      <div className="shrink-0 mb-5">
        <h1 className="text-xl lg:text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground hidden sm:block">
          Overall summary of completed orders
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
      </div>

      <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-border shadow-sm">
        <div className="h-full flex flex-col overflow-hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              No completed orders yet
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
                        Product Name
                      </TableHead>
                      <TableHead className="font-bold text-sm sm:text-base lg:text-md">
                        Date Installed
                      </TableHead>
                      <TableHead className="font-bold text-sm sm:text-base lg:text-md">
                        Status
                      </TableHead>
                      <TableHead className="font-bold text-sm sm:text-base lg:text-md text-right">
                        Total Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="bg-card">
                    {paginatedData.map((data, i) => {
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
                        <TableRow key={i} className="h-[61.5px]">
                          <TableCell className="font-medium">
                            {data.customerName}
                          </TableCell>

                          <TableCell>{data.productName}</TableCell>

                          <TableCell>{formattedDate}</TableCell>

                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Completed
                            </span>
                          </TableCell>

                          <TableCell className="text-right font-medium text-green-600">
                            ₱
                            {Number(data.totalAmount).toLocaleString('en-PH', {
                              minimumFractionDigits: 2,
                            })}
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
      </div>
    </div>
  );
};

export default ReportPage;
