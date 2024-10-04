"use client";

import React, { useRef, useEffect, useState } from "react";
import "@mescius/wijmo.styles/wijmo.css";
import { FlexGrid as WjFlexGrid } from "@mescius/wijmo.react.grid";
import { type FlexGrid as IFlexGrid, DataMap } from "@mescius/wijmo.grid";
import { CollectionView } from "@mescius/wijmo";
import "@mescius/wijmo.cultures/wijmo.culture.ja";
import { Plus, Minus, Undo2, Redo2, FilterX, Copy, FileX } from "lucide-react";
import { type FlexGridColumn } from "../types/FlexGridColumn";
import { TooltipButton } from "~/app/components/molecules/TooltipButton";

export interface FlexGridProps<T> {
  items: T[];
  columns: FlexGridColumn<T>[];
  init: (grid: IFlexGrid) => void;
  addRow: () => void;
  removeRow: () => void;
  undo: () => void;
  redo: () => void;
  clearFilter: () => void;
  copyRow: () => void;
  exportXlsx: () => void;
}

export function FlexGrid<T>({
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridHeight, setGridHeight] = useState<number>(500);
  const onInitialized = (s: IFlexGrid) => {
    init(s);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const updateGridHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const newHeight = viewportHeight - rect.top - 100; // 20pxの余白を確保
        setGridHeight(Math.max(newHeight, 200)); // 最小高さを200pxに設定
      }
    };

    // 初回実行
    updateGridHeight();

    // ウィンドウリサイズイベントのリスナー
    window.addEventListener("resize", updateGridHeight);

    // MutationObserverの追加
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" || mutation.type === "childList") {
          shouldUpdate = true;
        }
      });
      if (shouldUpdate) {
        updateGridHeight();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener("resize", updateGridHeight);
      observer.disconnect();
    };
  }, []);

  const view = new CollectionView(items, {
    refreshOnEdit: false,
    trackChanges: true,
  });

  const rowHeaders: FlexGridColumn<T & { operation?: string }>[] = [
    {
      header: " ",
      binding: "operation",
      cssClass: "wj-header",
      width: 40,
    },
  ];

  const extendedColumns = rowHeaders.concat(
    columns.map(({ rule, dataMap, ...rest }) => {
      if (dataMap) {
        return {
          ...rest,
          dataMap: new DataMap(
            dataMap.items,
            dataMap.selectedValuePath,
            dataMap.displayMemberPath,
          ),
        };
      }
      return rest;
    }) as FlexGridColumn<T>[],
  );

  return (
    <div ref={containerRef} id="undoable-form">
      <WjFlexGrid
        itemsSource={view}
        columns={extendedColumns}
        initialized={onInitialized}
        style={{ height: `${gridHeight}px` }}
      ></WjFlexGrid>
      <div className="flex gap-2">
        <TooltipButton
          onClick={undo}
          icon={<Undo2 size={24} />}
          shortcut="Ctrl+Z"
          label="元に戻す"
        />
        <TooltipButton
          onClick={redo}
          icon={<Redo2 size={24} />}
          shortcut="Ctrl+Y"
          label="やり直し"
        />
        <TooltipButton
          onClick={addRow}
          icon={<Plus size={24} />}
          shortcut="Alt+;"
          label="行追加"
        />
        <TooltipButton
          onClick={removeRow}
          icon={<Minus size={24} />}
          shortcut="Alt+D"
          label="行削除"
        />
        <TooltipButton
          onClick={clearFilter}
          icon={<FilterX size={24} />}
          shortcut="Alt+F"
          label="フィルタークリア"
        />
        <TooltipButton
          onClick={copyRow}
          icon={<Copy size={24} />}
          shortcut="Alt+C"
          label="行コピー"
        />
        <TooltipButton
          onClick={exportXlsx}
          icon={<FileX size={24} />}
          shortcut="Alt+S"
          label="Excelエクスポート"
        />
      </div>
    </div>
  );
}
