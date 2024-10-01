"use client";

import "@mescius/wijmo.styles/wijmo.css";
import * as WjGrid from "@mescius/wijmo.react.grid";
import { FlexGridFilter } from "@mescius/wijmo.react.grid.filter";
import "@mescius/wijmo.cultures/wijmo.culture.ja";

export function FlexGrid<T>({ items }: { items: T[] }) {
  return (
    <div>
      <WjGrid.FlexGrid itemsSource={items}>
        <FlexGridFilter />
        <WjGrid.FlexGridColumn header="code" binding="code" width={110} />
        <WjGrid.FlexGridColumn header="顧客名" binding="name" width={110} />
      </WjGrid.FlexGrid>
    </div>
  );
}
