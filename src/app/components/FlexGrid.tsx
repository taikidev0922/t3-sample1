"use client";

import React, { useRef, useEffect, useState } from "react";
import "@mescius/wijmo.styles/wijmo.css";
import { FlexGrid as WjFlexGrid } from "@mescius/wijmo.react.grid";
import { FlexGrid as IFlexGrid } from "@mescius/wijmo.grid";
import { CollectionView } from "@mescius/wijmo";
import { FlexGridFilter } from "@mescius/wijmo.react.grid.filter";
import "@mescius/wijmo.cultures/wijmo.culture.ja";
import { Plus, Minus, Trash } from "lucide-react";
import { FlexGridColumn } from "../types/FlexGridColumn";

export interface FlexGridProps<T> {
  items: T[];
  columns: FlexGridColumn[];
  init: (grid: IFlexGrid) => void;
  addRow: () => void;
  removeRow: () => void;
}

export function FlexGrid<T>({
  items,
  columns,
  init,
  addRow,
  removeRow,
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
    <div ref={containerRef}>
      <WjFlexGrid
        itemsSource={view}
        columns={extendedColumns}
        initialized={onInitialized}
        style={{ height: `${gridHeight}px` }}
      >
        <FlexGridFilter />
      </WjFlexGrid>
      <button onClick={addRow} style={{ marginTop: "10px" }}>
        <Plus size={24} />
      </button>
      <button onClick={removeRow} style={{ marginTop: "10px" }}>
        <Minus size={24} />
      </button>
    </div>
  );
}
