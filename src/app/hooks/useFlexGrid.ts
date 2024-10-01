import { useState } from "react";
import { FlexGrid as IFlexGrid } from "@mescius/wijmo.grid";

type FlexGridColumn = {
  header: string;
  binding: string;
};

export function useFlexGrid<T>(columns: FlexGridColumn[]) {
  const [grid, setGrid] = useState<IFlexGrid>();

  function init(_grid: IFlexGrid) {
    setGrid(_grid);
  }

  function getSelectedItems() {
    return grid?.collectionView.items;
  }

  function addRow() {
    grid?.editableCollectionView.addNew();
  }

  function register() {
    return {
      columns,
      init,
      addRow,
    };
  }

  return {
    register,
    init,
    getSelectedItems,
  };
}
