
import React from 'react';
import type { QueryResult } from '../types';

interface ResultsTableProps {
    queryResult: QueryResult | null;
    isLoading: boolean;
    error: string | null;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ queryResult, isLoading, error }) => {

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-full p-8">
                    <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-4 text-slate-400">Executing query...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-4 text-center bg-red-900/20 border border-red-500/30 rounded-lg">
                    <h3 className="font-semibold text-red-400">Query Failed</h3>
                    <p className="text-red-300 text-sm mt-1 font-mono">{error}</p>
                </div>
            );
        }

        if (!queryResult || queryResult.rows.length === 0) {
            return (
                <div className="text-center text-slate-500 p-8">
                    <p>No results to display. Execute a query to see the output here.</p>
                </div>
            );
        }

        return (
            <>
                <div className="overflow-auto max-h-96 border border-slate-700 rounded-t-lg">
                    <table className="min-w-full divide-y divide-slate-700">
                        <thead className="bg-slate-800 sticky top-0">
                            <tr>
                                {queryResult.columns.map((col, index) => (
                                    <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-slate-900 divide-y divide-slate-800">
                            {queryResult.rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-slate-800/50">
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                            {cell === null ? <i className="text-slate-500">NULL</i> : String(cell)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-slate-800 text-xs text-slate-400 px-4 py-2 rounded-b-lg border-x border-b border-slate-700">
                    Showing {queryResult.rows.length} of {queryResult.rowCount} total rows. {queryResult.truncated && "(Result set truncated)"}
                </div>
            </>
        );
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2 text-slate-200">Query Results</h3>
            <div className="bg-slate-900 rounded-lg min-h-[100px] flex flex-col justify-center">
                {renderContent()}
            </div>
        </div>
    );
};
