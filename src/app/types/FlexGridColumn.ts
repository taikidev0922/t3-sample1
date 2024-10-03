import { ICellTemplateContext } from "@mescius/wijmo.grid";
export type FlexGridColumn = {
  header: string;
  binding: string;
  isRequired?: boolean;
  cssClass?: string;
  width?: number;
  cellTemplate?: (ctx: ICellTemplateContext) => React.ReactNode;
};
