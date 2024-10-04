import { type ICellTemplateContext } from "@mescius/wijmo.grid";
export type FlexGridColumn<T> = {
  header: string;
  binding: string;
  isRequired?: boolean;
  cssClass?: string;
  width?: number;
  cellTemplate?: (ctx: ICellTemplateContext) => React.ReactNode;
  rule?: (item: T, value: string) => string | null;
};
