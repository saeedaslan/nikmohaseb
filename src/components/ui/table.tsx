import { cn } from "@/lib/utils";
import { type TableHTMLAttributes, forwardRef } from "react";

export const Table = forwardRef<HTMLTableElement, TableHTMLAttributes<HTMLTableElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="w-full overflow-y-auto rounded-md border border-border">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  ),
);
Table.displayName = "Table";

export const TableHeader = ({ className, ...props }: TableHTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn("bg-surface-background/60", className)} {...props} />
);
TableHeader.displayName = "TableHeader";

export const TableBody = ({ className, ...props }: TableHTMLAttributes<HTMLTableSectionElement>) => (
  <tbody
    className={cn("divide-y divide-border/60 bg-surface-card", className)}
    {...props}
  />
);
TableBody.displayName = "TableBody";

export const TableRow = forwardRef<HTMLTableRowElement, TableHTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("hover:bg-surface-background/50", className)}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

export const TableHead = forwardRef<HTMLTableCellElement, TableHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "text-right font-medium text-text-muted h-10 px-3 align-middle",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

export const TableCell = forwardRef<HTMLTableCellElement, TableHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("text-right px-3 py-2 align-middle", className)}
      {...props}
    />
  ),
);
TableCell.displayName = "TableCell";
