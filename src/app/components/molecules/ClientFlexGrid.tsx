"use client";
import dynamic from "next/dynamic";
import { type FlexGridProps } from "../FlexGrid";
import { type FlexGridColumn } from "~/app/types/FlexGridColumn";

const WjFlexGrid = dynamic(
  () => import("~/app/components/FlexGrid").then((mod) => mod.FlexGrid),
  {
    ssr: false,
  },
);

export function ClientFlexGrid<T>({
  items,
  columns,
  init,
  addRow,
  removeRow,
  undo,
  redo,
  clearFilter,
  copyRow,
  exportXlsx,
}: FlexGridProps<T>) {
  return (
    <WjFlexGrid
      items={items}
      columns={columns as FlexGridColumn<unknown>[]}
      init={init}
      addRow={addRow}
      removeRow={removeRow}
      undo={undo}
      redo={redo}
      clearFilter={clearFilter}
      copyRow={copyRow}
      exportXlsx={exportXlsx}
    />
  );
}
