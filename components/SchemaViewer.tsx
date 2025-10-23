import React from 'react';
// FIX: Import the Table type to use for casting.
import type { Schema, Table } from '../types';

interface SchemaViewerProps {
    schema: Schema;
}

const TableIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const ColumnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10V7" />
    </svg>
);

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-2 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
    </svg>
);

export const SchemaViewer: React.FC<SchemaViewerProps> = ({ schema }) => {
    return (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 flex-grow">
            <h2 className="text-lg font-semibold text-slate-200 mb-3 border-b border-slate-700 pb-2">Database Schema</h2>
            <div className="space-y-3">
                {/* FIX: Cast result of Object.values to Table[] to resolve TypeScript inference issue. */}
                {(Object.values(schema.tables) as Table[]).map(table => (
                    <div key={table.name}>
                        <div className="flex items-center">
                            <TableIcon />
                            <span className="font-bold text-slate-300">{table.name}</span>
                        </div>
                        <ul className="pl-6 mt-1 border-l border-slate-600">
                            {table.columns.map(column => (
                                <li key={column.name} className="flex items-center justify-between text-sm py-1">
                                    <div className="flex items-center">
                                        <ColumnIcon />
                                        <span>{column.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-slate-500 font-mono text-xs mr-2">{column.type}</span>
                                        {column.isPrimaryKey && <KeyIcon />}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};
