declare module 'string-table' {
  interface StringTableOptions {
    capitalizeHeaders?: boolean;
    pad?: {
      left?: string;
      right?: string;
    };
    headerSeparator?: string;
    rowSeparator?: string;
    outerBorder?: string;
    innerBorder?: string;
    rowInnerBorder?: string;
    headerInnerBorder?: string;
  }

  function createTable(data: any[], options?: StringTableOptions): string;
  export = createTable;
}