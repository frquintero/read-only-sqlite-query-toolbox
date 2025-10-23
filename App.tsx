import React, { useState, useCallback, useEffect } from 'react';
import { FileUploader } from './components/FileUploader';
import { SchemaViewer } from './components/SchemaViewer';
import { QueryEditor } from './components/QueryEditor';
import { ResultsTable } from './components/ResultsTable';
import { ProjectTracker } from './components/ProjectTracker';
import type { Schema, QueryResult, Table } from './types';
import { generateSqlFromNaturalLanguage } from './services/geminiService';
import { initDb, getDbSchema, executeQuery, closeDb } from './services/dbService';

const App: React.FC = () => {
    const [dbFile, setDbFile] = useState<File | null>(null);
    const [schema, setSchema] = useState<Schema | null>(null);
    const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'query' | 'plan'>('query');

    useEffect(() => {
        // Close the database connection when the component unmounts
        return () => {
            closeDb();
        };
    }, []);

    const handleFileSelect = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);
        setQueryResult(null);
        setSchema(null);
        setDbFile(file);

        try {
            await initDb(file);
            const dbSchema = getDbSchema();
            setSchema(dbSchema);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to load database: ${errorMessage}`);
            setDbFile(null); // Reset file if loading fails
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleQueryExecute = useCallback((sql: string) => {
        if (!sql.trim()) {
            setError("Query cannot be empty.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setQueryResult(null);

        // Using a timeout to make the loading state visible, as local queries can be very fast
        setTimeout(() => {
            try {
                const result = executeQuery(sql);
                setQueryResult(result);
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
                setError(`Query Error: ${errorMessage}`);
            } finally {
                setIsLoading(false);
            }
        }, 500);
    }, []);

    const handleNaturalLanguageQuery = useCallback(async (nlQuery: string) => {
        if (!schema) {
            setError("Please load a database to view its schema before generating SQL.");
            return '';
        }
        setIsLoading(true);
        setError(null);
        try {
            // FIX: Cast result of Object.entries to [string, Table][] to resolve TypeScript inference issue.
            const schemaString = (Object.entries(schema.tables) as [string, Table][]).map(([tableName, table]) => {
                const columns = table.columns.map(c => `${c.name} ${c.type}`).join(', ');
                return `Table \`${tableName}\`: ${columns}`;
            }).join('\n');
            const generatedSql = await generateSqlFromNaturalLanguage(nlQuery, schemaString);
            return generatedSql;
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to generate SQL from natural language: ${errorMessage}`);
            return '';
        } finally {
            setIsLoading(false);
        }
    }, [schema]);


    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 font-sans p-4 lg:p-6">
            <main className="max-w-screen-2xl mx-auto">
                <header className="mb-6 pb-4 border-b border-slate-700">
                    <h1 className="text-3xl lg:text-4xl font-bold text-cyan-400 tracking-tight">
                        Read-Only SQLite Query Toolbox
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Upload a SQLite database, view its schema, and run read-only queries with AI assistance.
                    </p>
                </header>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column */}
                    <aside className="lg:w-1/4 xl:w-1/5 flex flex-col gap-6">
                        <FileUploader onFileSelect={handleFileSelect} isLoading={isLoading && !schema} />
                        {schema && <SchemaViewer schema={schema} />}
                    </aside>

                    {/* Right Column */}
                    <div className="lg:w-3/4 xl:w-4/5 flex flex-col gap-6">
                        <div className="bg-slate-800/50 rounded-lg border border-slate-700">
                            <div className="flex border-b border-slate-700">
                                <button
                                    onClick={() => setActiveTab('query')}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'query' ? 'bg-slate-700 text-cyan-400' : 'text-slate-400 hover:bg-slate-700/50'}`}
                                >
                                    Query Interface
                                </button>
                                <button
                                    onClick={() => setActiveTab('plan')}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'plan' ? 'bg-slate-700 text-cyan-400' : 'text-slate-400 hover:bg-slate-700/50'}`}
                                >
                                    Project Verification Workflow
                                </button>
                            </div>
                            <div className="p-4">
                                {activeTab === 'query' ? (
                                    <>
                                        <QueryEditor
                                            onExecute={handleQueryExecute}
                                            onNaturalLanguageQuery={handleNaturalLanguageQuery}
                                            isExecutionDisabled={!dbFile || isLoading}
                                        />
                                        <div className="mt-4 min-h-[200px]">
                                            <ResultsTable 
                                                queryResult={queryResult} 
                                                isLoading={isLoading} 
                                                error={error} 
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <ProjectTracker />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;