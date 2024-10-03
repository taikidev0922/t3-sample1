"use client";

import React, { useRef, useEffect, useState } from "react";
import "@mescius/wijmo.styles/wijmo.css";
import { FlexGrid as WjFlexGrid } from "@mescius/wijmo.react.grid";
import { type FlexGrid as IFlexGrid } from "@mescius/wijmo.grid";
import { CollectionView } from "@mescius/wijmo";
import "@mescius/wijmo.cultures/wijmo.culture.ja";
import { Plus, Minus, Undo2, Redo2, FilterX, Copy, FileX } from "lucide-react";
import { type FlexGridColumn } from "../types/FlexGridColumn";
import { Button } from "./ui/button";

export interface FlexGridProps<T> {
  items: T[];
  columns: FlexGridColumn[];
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

  const rowHeaders: FlexGridColumn[] = [
    {
      header: " ",
      binding: "operation",
      cssClass: "wj-header",
      width: 40,
    },
  ];

  const extendedColumns = rowHeaders.concat(columns);

  return (
    <div ref={containerRef} id="undoable-form">
      <WjFlexGrid
        itemsSource={view}
        columns={extendedColumns}
        initialized={onInitialized}
        style={{ height: `${gridHeight}px` }}
      ></WjFlexGrid>
      <div className="flex gap-2">
        <Button onClick={undo} variant="outline" size="icon">
          <Undo2 size={24} />
        </Button>
        <Button onClick={redo} variant="outline" size="icon">
          <Redo2 size={24} />
        </Button>
        <Button onClick={addRow} variant="outline" size="icon">
          <Plus size={24} />
        </Button>
        <Button onClick={removeRow} variant="outline" size="icon">
          <Minus size={24} />
        </Button>
        <Button onClick={clearFilter} variant="outline" size="icon">
          <FilterX size={24} />
        </Button>
        <Button onClick={copyRow} variant="outline" size="icon">
          <Copy size={24} />
        </Button>
        <Button onClick={exportXlsx} variant="outline" size="icon">
          <FileX size={24} />
        </Button>
      </div>
    </div>
  );
}
