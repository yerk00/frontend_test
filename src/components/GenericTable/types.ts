import type { ReactNode } from "react";

export interface ColumnDef<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  width?: string;
}