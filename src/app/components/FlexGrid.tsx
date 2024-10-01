"use client";

import React, { useRef, useEffect, useState } from "react";
import "@mescius/wijmo.styles/wijmo.css";
import { FlexGrid as WjFlexGrid } from "@mescius/wijmo.react.grid";
import { FlexGrid as IFlexGrid } from "@mescius/wijmo.grid";
import { FlexGridFilter } from "@mescius/wijmo.react.grid.filter";
import "@mescius/wijmo.cultures/wijmo.culture.ja";
import { Plus } from "lucide-react";

export interface FlexGridProps<T> {
  items: T[];
  columns: { header: string; binding: string }[];
  init: (grid: IFlexGrid) => void;
  addRow: () => void;
}

export function FlexGrid<T>({
  items,
  columns,
  init,
  addRow,
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

  return (
    <div ref={containerRef}>
      <WjFlexGrid
        itemsSource={items}
        columns={columns}
        initialized={onInitialized}
        style={{ height: `${gridHeight}px` }}
      >
        <FlexGridFilter />
      </WjFlexGrid>
      <button onClick={addRow} style={{ marginTop: "10px" }}>
        <Plus size={24} />
      </button>
    </div>
  );
}
