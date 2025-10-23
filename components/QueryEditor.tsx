import React, { useState } from 'react';

interface QueryEditorProps {
    onExecute: (sql: string) => void;
    onNaturalLanguageQuery: (nlQuery: string) => Promise<string>;
    isExecutionDisabled: boolean;
}

const GenerateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
    </svg>
);

const ExecuteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);


export const QueryEditor: React.FC<QueryEditorProps> = ({ onExecute, onNaturalLanguageQuery, isExecutionDisabled }) => {
    const [sqlQuery, setSqlQuery] = useState<string>("");
    const [nlQuery, setNlQuery] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateClick = async () => {
        if (!nlQuery.trim()) return;
        setIsGenerating(true);
        const generatedSql = await onNaturalLanguageQuery(nlQuery);
        if (generatedSql) {
            setSqlQuery(generatedSql);
        }
        setIsGenerating(false);
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="nl-query" className="block text-sm font-medium text-slate-300 mb-1">
                    1. Ask a question in natural language
                </label>
                <div className="flex gap-2">
                    <input
                        id="nl-query"
                        type="text"
                        value={nlQuery}
                        onChange={(e) => setNlQuery(e.target.value)}
                        placeholder="e.g., How many customers live in Detroit?"
                        className="flex-grow bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                        disabled={isExecutionDisabled || isGenerating}
                    />
                    <button
                        onClick={handleGenerateClick}
                        disabled={isExecutionDisabled || isGenerating}
                        className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                    >
                        {isGenerating ? (
                             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                           <><GenerateIcon /> Generate SQL</>
                        )}
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="sql-query" className="block text-sm font-medium text-slate-300 mb-1">
                    2. Edit and execute the SQL query
                </label>
                <textarea
                    id="sql-query"
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    rows={6}
                    className="w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm font-mono"
                    placeholder="SELECT * FROM your_table;"
                    disabled={isExecutionDisabled}
                />
            </div>
            
            <button
                onClick={() => onExecute(sqlQuery)}
                disabled={isExecutionDisabled}
                className="w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
            >
                <ExecuteIcon /> Execute Query
            </button>
        </div>
    );
};