declare module "react-window" {
  import * as React from "react";

  export interface ListChildComponentProps {
    index: number;
    style: React.CSSProperties;
    data: any;
  }

  export interface FixedSizeListProps {
    height: number;
    itemCount: number;
    itemSize: number;
    width: number | string;
    itemData?: any;
    children: React.ComponentType<ListChildComponentProps>;
  }

  export class FixedSizeList extends React.Component<FixedSizeListProps> {}
}