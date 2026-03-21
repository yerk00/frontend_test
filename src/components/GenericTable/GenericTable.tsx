import type { KeyboardEvent, ReactNode } from "react";
import "./GenericTable.css";
import type { ColumnDef } from "./types";

interface GenericTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  keyExtractor: (row: T) => string;
}

const DEFAULT_EMPTY_MESSAGE = "No hay datos disponibles";
const SKELETON_ROWS = 5;

const getCellContent = <T,>(row: T, column: ColumnDef<T>): ReactNode => {
  if (column.render) {
    return column.render(row);
  }

  const value = row[column.key];

  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
};

export const GenericTable = <T,>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  keyExtractor,
}: GenericTableProps<T>) => {
  const isClickable = typeof onRowClick === "function";

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: T) => {
    if (!isClickable) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick(row);
    }
  };

  return (
    <div className="generic-table-wrapper">
      <table className="generic-table" aria-busy={isLoading}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={column.className}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`}>
                {columns.map((column) => (
                  <td key={`${String(column.key)}-${rowIndex}`}>
                    <div className="skeleton-cell" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="generic-table-empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className={isClickable ? "generic-table-row clickable" : "generic-table-row"}
                onClick={isClickable ? () => onRowClick(row) : undefined}
                onKeyDown={(event) => handleRowKeyDown(event, row)}
                tabIndex={isClickable ? 0 : -1}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className={column.className}>
                    {getCellContent(row, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};