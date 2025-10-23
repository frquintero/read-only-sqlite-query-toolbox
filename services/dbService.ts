import initSqlJs from 'sql.js';
import { type Database } from 'sql.js';
import type { Schema, QueryResult, Table, Column } from '../types';

let db: Database | null = null;

export async function initDb(file: File): Promise<void> {
    // In case a previous DB was loaded
    if (db) {
        db.close();
    }
    const SQL = await initSqlJs({
        // Point to the correct CDN path for the wasm file
        locateFile: (fileName: string) => `https://aistudiocdn.com/sql.js@1.13.0/dist/${fileName}`
    });
    const buffer = await file.arrayBuffer();
    const uInt8Array = new Uint8Array(buffer);
    db = new SQL.Database(uInt8Array);
}

export function getDbSchema(): Schema {
    if (!db) {
        throw new Error("Database not initialized.");
    }
    
    const schema: Schema = { tables: {} };

    const tablesResult = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
    
    if (!tablesResult || tablesResult.length === 0 || tablesResult[0].values.length === 0) {
        return schema;
    }

    const tableNames = tablesResult[0].values.flat() as string[];

    tableNames.forEach(tableName => {
        const table: Table = {
            name: tableName,
            columns: []
        };
        
        try {
            const columnsResult = db.exec(`PRAGMA table_info(\`${tableName}\`);`);
            if (columnsResult && columnsResult.length > 0) {
                columnsResult[0].values.forEach(row => {
                    // PRAGMA table_info returns: cid, name, type, notnull, dflt_value, pk
                    const column: Column = {
                        name: row[1] as string,
                        type: row[2] as string,
                        isPrimaryKey: row[5] === 1
                    };
                    table.columns.push(column);
                });
            }
            schema.tables[tableName] = table;
        } catch (e) {
            console.warn(`Could not get schema for table ${tableName}:`, e);
        }
    });

    return schema;
}

export function executeQuery(sql: string): QueryResult {
    if (!db) {
        throw new Error("Database not initialized.");
    }

    if (!/^\s*SELECT/i.test(sql)) {
        throw new Error("Only SELECT queries are allowed.");
    }

    try {
        const results = db.exec(sql);
        if (results.length === 0) {
            return { columns: ['Result'], rows: [['Query executed successfully, but returned no data.']], rowCount: 0, truncated: false };
        }
        
        const firstResult = results[0];
        const rowCount = firstResult.values.length;
        const ROW_LIMIT = 100;
        const truncated = rowCount > ROW_LIMIT;
        const rows = truncated ? firstResult.values.slice(0, ROW_LIMIT) : firstResult.values;

        return {
            columns: firstResult.columns,
            rows: rows as (string | number | null)[][],
            rowCount: rowCount,
            truncated: truncated
        };
    } catch (e: any) {
        console.error("SQL Error:", e);
        throw new Error(e.message);
    }
}

export function closeDb(): void {
    if (db) {
        db.close();
        db = null;
    }
}