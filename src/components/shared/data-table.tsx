"use client";

import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SortOrder } from "@/hooks/use-url-state";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
  sortKey?: string;
}

export function DataTable<T>({
  columns,
  data,
  empty = "No records found.",
  sortBy,
  sortOrder,
  onSortChange,
}: {
  columns: Column<T>[];
  data: T[];
  empty?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  onSortChange?: (key: string) => void;
}) {
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
        {empty}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => {
            const key = column.sortKey ?? column.key;
            const sortable = Boolean(column.sortable && onSortChange);
            const active = sortBy === key;
            return (
              <TableHead key={column.key} className={column.className}>
                {sortable ? (
                  <button
                    type="button"
                    onClick={() => onSortChange?.(key)}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    {column.header}
                    <span aria-hidden="true">
                      {active ? (sortOrder === "asc" ? "â†‘" : "â†“") : "â†•"}
                    </span>
                  </button>
                ) : (
                  column.header
                )}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={column.key} className={column.className}>
                {column.cell(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
