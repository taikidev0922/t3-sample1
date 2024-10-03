import { useState } from "react";
import {
  type FlexGrid as IFlexGrid,
  CellType,
  KeyAction,
} from "@mescius/wijmo.grid";
import { type CollectionView } from "@mescius/wijmo";
import { Selector } from "@mescius/wijmo.grid.selector";

type FlexGridColumn<T> = {
  header: string;
  binding: string;
};

export function useFlexGrid<T>(columns: FlexGridColumn<T>[]) {
  const [grid, setGrid] =
    useState<IFlexGrid<T & { id?: string; isDelete?: boolean }>>();
  const [selector, setSelector] = useState<Selector>();

  function init(_grid: IFlexGrid<T & { id?: string; isDelete?: boolean }>) {
    setGrid(_grid);
    setSelector(new Selector(_grid));
    _grid.keyActionTab = KeyAction.Cycle;
    _grid.formatItem.addHandler(
      (s: IFlexGrid<T & { id?: string; isDelete?: boolean }>, e) => {
        if (e.panel.cellType === CellType.Cell && e.col === 0) {
          e.cell.style.backgroundColor = "";
          e.cell.style.color = "white";
          e.cell.style.textAlign = "center";
          if (!s?.rows[e.row]?.isSelected) {
            return;
          }
          if (s.collectionView.items[e.row]?.isDelete) {
            e.cell.style.backgroundColor = "#ff6666";
            e.cell.textContent = "D";
          } else if (s.collectionView.items[e.row]?.id) {
            e.cell.style.backgroundColor = "#66ff66";
            e.cell.textContent = "U";
          } else {
            e.cell.style.backgroundColor = "#6666ff";
            e.cell.textContent = "I";
          }
        }
      },
    );
    _grid.cellEditEnded.addHandler((s, e) => {
      _grid.rows[e.row]!.isSelected = true;
    });
  }

  const getError = (item: T, propName: string | null): string | null => {
    switch (propName) {
      case "emailAddress":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return item[propName as keyof T] &&
          !emailRegex.test(item[propName as keyof T] as string)
          ? "メールアドレスの形式が正しくありません。"
          : "";
      case null:
        const errors: string[] = [];
        for (const key in item) {
          const err = getError(item, key);
          if (err) errors.push(err);
        }
        return errors.length > 1
          ? "この項目では " + errors.length + " 個のエラーがあります。"
          : errors.length == 1
            ? (errors[0] ?? null)
            : null;
    }
    return null;
  };

  function validate() {
    (grid!.collectionView as CollectionView).getError = getError;
    const items = getChanges();
    if (items) {
      return items.every((item) => {
        columns.forEach((column) => {
          const error = getError(item, column.binding);
          if (error) {
            return false;
          }
        });
        return true;
      });
    }
    return true;
  }

  function getChanges(): (T & { id?: string; isDelete?: boolean })[] {
    return (
      grid?.rows
        .filter((row) => row.isSelected)
        .map(
          (row) => row.dataItem as T & { id?: string; isDelete?: boolean },
        ) ?? []
    );
  }

  function addRow() {
    grid?.editableCollectionView.addNew();
  }

  function removeRow() {
    grid?.beginUpdate();
    if (grid?.collectionView.currentItem.id) {
      grid.collectionView.currentItem.isDelete = !(
        grid.collectionView.currentItem.isDelete === true
      );
      grid.rows[grid.selection.row]!.isSelected =
        grid.collectionView.currentItem.isDelete;
    } else {
      grid?.editableCollectionView.remove(grid?.collectionView.currentItem);
    }
    grid?.endUpdate();
  }

  function register() {
    return {
      columns,
      init,
      addRow,
      removeRow,
    };
  }

  return {
    register,
    init,
    getChanges,
    validate,
  };
}
