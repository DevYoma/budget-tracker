"use client"

type Props = {
    to: Date;
    from: Date
}

import { DateToUTCDate } from '@/lib/helpers';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react'
import { 
    ColumnDef,
    flexRender,
    getCoreRowModel,
    SortingState,
    useReactTable,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    getPaginationRowModel, 
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { GetTransactionsHistoryResponseType } from '@/app/api/transactions-history/route';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { DataTableColumnHeader } from '@/components/datatable/ColumnHeader';
import { cn } from '@/lib/utils';
import { DataTableFacetedFilter } from '@/components/datatable/FacetedFilters';
import { DataTableViewOptions } from '@/components/datatable/ColumnToggle';
import { Button } from '@/components/ui/button';

const emptyData: any[] = []

type TransactionHistoryRow = GetTransactionsHistoryResponseType[0];

export const columns: ColumnDef<TransactionHistoryRow>[] = [
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div className="flex gap-2 capitalize">
        {row.original.categoryIcon}
        <div className="capitalize">{row.original.category}</div>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.description}</div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const formattedDate = date.toLocaleDateString("default", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      // TODO: Make Date format DD/MM/YYYY
      return <div className="text-muted-foreground">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    filterFn: (row, id, value) => {
       return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div
        className={cn(
          "capitalize rounded-lg text-center p-2",
          row.original.type === "income" &&
            "bg-emerald-400/10 text-emerald-500",
          row.original.type === "expense" && "bg-red-400/10 text-red-500"
        )}
      >
        {row.original.description}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <p className="text-md rounded-lg bg-gray-400/5 p-2 text-center">
        {row.original.formattedAmount}
      </p>
    ),
  },
];

const TransactionTable = ({ to, from }: Props) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const history = useQuery<GetTransactionsHistoryResponseType>({
      queryKey: ["transactions", "history", from, to],
      queryFn: () =>
        fetch(
          `/api/transactions-history?from=${DateToUTCDate(
            from
          )}&to=${DateToUTCDate(to)}`
        ).then((res) => res.json()),
    });

    const table = useReactTable({
        data: history.data || emptyData,
        columns, 
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            pagination: {
                pageSize: 10
            }
        },
        state: {
            sorting,
            columnFilters
        }, 
        onSortingChange: setSorting, 
        onColumnFiltersChange: setColumnFilters, 
        getSortedRowModel: getSortedRowModel(), 
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    })

    // console.log(history.data)

    const categoriesOptions = useMemo(() => {
        const categoriesMap = new Map();

        history.data?.forEach(transaction => (
            categoriesMap.set(transaction.category, {
                value: transaction.category, 
                label: `${transaction.categoryIcon} ${transaction.category}`
            })
        ))

        const uniqueCategories = new Set(categoriesMap.values())
        return Array.from(uniqueCategories)
    }, [history.data])

  return (
    <div className="w-full">
      {/* <pre>{JSON.stringify(categoriesOptions, null, 2)}</pre> */}
      <div className="flex flex-wrap items-end justify-between gap-2 py-4">
        <div className="flex gap-2">
          {table.getColumn("category") && (
            <DataTableFacetedFilter
              title="Category"
              column={table.getColumn("category")}
              options={categoriesOptions}
            />
          )}
          {table.getColumn("type") && (
            <DataTableFacetedFilter
              title="Type"
              column={table.getColumn("type")}
              options={[
                { label: "Income", value: "income" },
                { label: "Expense", value: "expense" },
              ]}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <SkeletonWrapper isLoading={history.isFetching}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </SkeletonWrapper>
    </div>
  );
}   

export default TransactionTable