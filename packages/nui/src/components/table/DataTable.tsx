import React from 'react';
import { cn } from '../../utils';

// We define the primitive components here as they are required to compose the UI
export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
 ({ className, ...props }, ref) => (
 <div className="w-full overflow-auto">
 <table role="table" ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
 </div>
 )
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
 ({ className, ...props }, ref) => (
 <thead role="rowgroup" ref={ref} className={cn("", className)} {...props} />
 )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
 ({ className, ...props }, ref) => (
 <tbody role="rowgroup" ref={ref} className={cn("", className)} {...props} />
 )
);
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
 ({ className, ...props }, ref) => (
 <tr role="row" ref={ref} className={cn("border-b border-default transition-colors hover:bg-subtle data-[state=selected]:bg-muted", className)} {...props} />
 )
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
 ({ className, ...props }, ref) => (
 <th role="columnheader" ref={ref} className={cn("h-10 px-2 text-left align-middle font-medium text-muted", className)} {...props} />
 )
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
 ({ className, ...props }, ref) => (
 <td role="cell" ref={ref} className={cn("p-2 align-middle", className)} {...props} />
 )
);
TableCell.displayName = "TableCell";

export interface DataTableColumn {
 key: string;
 header: string;
}

export interface DataTableProps {
 columns: DataTableColumn[];
 data: any[];
}

export function DataTable({ columns, data }: DataTableProps) {
 return (
 <Table>
 <TableHeader>
 <TableRow>
 {columns.map((col) => (
 <TableHead key={col.key}>{col.header}</TableHead>
 ))}
 </TableRow>
 </TableHeader>
 <TableBody>
 {data.map((row, rowIndex) => (
 <TableRow key={rowIndex}>
 {columns.map((col) => (
 <TableCell key={col.key}>{row[col.key]}</TableCell>
 ))}
 </TableRow>
 ))}
 </TableBody>
 </Table>
 );
}
