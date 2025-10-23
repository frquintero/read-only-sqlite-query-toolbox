
export interface Column {
    name: string;
    type: string;
    isPrimaryKey: boolean;
}

export interface Table {
    name: string;
    columns: Column[];
}

export interface Schema {
    tables: {
        [tableName: string]: Table;
    };
}

export interface QueryResult {
    columns: string[];
    rows: (string | number | null)[][];
    rowCount: number;
    truncated: boolean;
}
