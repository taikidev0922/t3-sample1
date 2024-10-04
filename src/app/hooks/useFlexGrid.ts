import { useState } from "react";
import {
  type FlexGrid as IFlexGrid,
  CellType,
  KeyAction,
} from "@mescius/wijmo.grid";
import { type CollectionView } from "@mescius/wijmo";
import { Selector } from "@mescius/wijmo.grid.selector";
import { UndoStack } from "@mescius/wijmo.undo";
import { FlexGridFilter } from "@mescius/wijmo.grid.filter";
import { FlexGridXlsxConverter } from "@mescius/wijmo.grid.xlsx";
import { useHotkeys } from "react-hotkeys-hook";
import { type FlexGridColumn } from "../types/FlexGridColumn";

export function useFlexGrid<T>(columns: FlexGridColumn<T>[]) {
  const [grid, setGrid] =
    useState<IFlexGrid<T & { id?: string; isDelete?: boolean }>>();
  const [selector, setSelector] = useState<Selector>();
  const [filter, setFilter] = useState<FlexGridFilter>();
  const [undoStack, setUndoStack] = useState<UndoStack>();

  useHotkeys("ctrl+z", () => undo());
  useHotkeys("ctrl+y", () => redo());
  useHotkeys("alt+s", () => exportXlsx());
  useHotkeys("alt+;", () => addRow());
  useHotkeys("alt+d", (e) => {
    e.preventDefault();
    removeRow();
  });
  useHotkeys("alt+f", (e) => {
    e.preventDefault();
    clearFilter();
  });
  useHotkeys("alt+c", () => {
    void (async () => {
      await copyRow();
    })();
  });

  function init(_grid: IFlexGrid<T & { id?: string; isDelete?: boolean }>) {
    setGrid(_grid);
    setSelector(new Selector(_grid));
    setFilter(new FlexGridFilter(_grid));
    setUndoStack(
      new UndoStack("#undoable-form", {
        maxActions: 50,
      }),
    );
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

  const getError = (
    item: T & { id?: string; isDelete?: boolean },
    propName: string | null,
  ): string | null => {
    const index = grid?.collectionView.items.indexOf(item) ?? 0;
    const rowIndex = grid?.rows.getItemAt(index) ?? 0;
    if (!grid?.rows[rowIndex]?.isSelected) {
      return null;
    }
    if (columns.find((column) => column.binding === propName)?.rule) {
      const error = columns
        ?.find((column) => column.binding === propName)
        ?.rule?.(item, item[propName as keyof T] as string);
      return error ?? null;
    }
    if (propName === null) {
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
        return columns.every((column) => {
          const error = getError(item, column.binding);
          if (error) {
            return false;
          }
          return true;
        });
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

  function undo() {
    undoStack?.undo();
    grid?.focus();
  }

  function redo() {
    undoStack?.redo();
    grid?.focus();
  }

  function addRow() {
    grid?.editableCollectionView.addNew();
    grid?.focus();
  }

  function clearFilter() {
    filter?.clear();
    grid?.focus();
  }

  async function copyRow() {
    const currentItem = grid?.collectionView.currentItem;
    if (currentItem) {
      (grid?.collectionView as CollectionView).addNew({
        ...currentItem,
        id: null,
      });
      grid.select(grid?.collectionView.items.length - 1, grid.selection.col);
      grid.rows[grid.selection.row]!.isSelected = true;
    }
    grid?.focus();
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
    grid?.focus();
  }

  function exportXlsx() {
    if (!grid) {
      return;
    }
    FlexGridXlsxConverter.saveAsync(
      grid,
      {
        includeColumnHeaders: true,
        includeStyles: false,
      },
      "FlexGrid.xlsx",
    );
    grid?.focus();
  }

  function register() {
    return {
      columns,
      init,
      addRow,
      removeRow,
      undo,
      redo,
      clearFilter,
      copyRow,
      exportXlsx,
    };
  }

  return {
    register,
    init,
    getChanges,
    validate,
  };
}
