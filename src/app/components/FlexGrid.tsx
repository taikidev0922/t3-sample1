"use client";

import React from "react";
import "@mescius/wijmo.styles/wijmo.css";
import { FlexGrid as WjFlexGrid } from "@mescius/wijmo.react.grid";
import { FlexGrid as IFlexGrid } from "@mescius/wijmo.grid";
import { FlexGridFilter } from "@mescius/wijmo.react.grid.filter";
import "@mescius/wijmo.cultures/wijmo.culture.ja";
import { Plus } from "lucide-react";

interface FlexGridProps<T> {
  items: T[];
  columns: { header: string; binding: string; width?: number }[];
  init: (grid: IFlexGrid) => void;
  addRow: () => void;
}

export function FlexGrid<T>({
  items,
  columns,
  init,
  addRow,
}: FlexGridProps<T>) {
  const onInitialized = (s: IFlexGrid) => {
    init(s);
  };

  return (
    <div>
      <WjFlexGrid
        itemsSource={items}
        columns={columns}
        initialized={onInitialized}
        style={{ height: "500px" }}
      >
        <FlexGridFilter />
      </WjFlexGrid>
      <button
        onClick={() => {
          addRow();
        }}
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
