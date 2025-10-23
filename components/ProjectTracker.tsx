
import React, { useState } from 'react';
import { VERIFICATION_WORKFLOW } from '../constants';

export const ProjectTracker: React.FC = () => {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    const handleCheck = (id: string) => {
        const newCheckedItems = new Set(checkedItems);
        if (newCheckedItems.has(id)) {
            newCheckedItems.delete(id);
        } else {
            newCheckedItems.add(id);
        }
        setCheckedItems(newCheckedItems);
    };

    const progress = (checkedItems.size / VERIFICATION_WORKFLOW.length) * 100;

    return (
        <div className="p-2">
            <h2 className="text-xl font-bold text-slate-200 mb-2">A-Z Verification Checklist</h2>
            <p className="text-sm text-slate-400 mb-4">
                This checklist ensures all components are correctly set up and functional before deployment.
            </p>

            <div className="mb-6">
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div
                        className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-right text-sm text-slate-400 mt-1">
                    {Math.round(progress)}% Complete ({checkedItems.size}/{VERIFICATION_WORKFLOW.length})
                </p>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {VERIFICATION_WORKFLOW.map(item => (
                    <div
                        key={item.id}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                            checkedItems.has(item.id) ? 'bg-green-900/30 border-green-500/40' : 'bg-slate-800 border-slate-700'
                        }`}
                    >
                        <label className="flex items-start cursor-pointer">
                            <input
                                type="checkbox"
                                checked={checkedItems.has(item.id)}
                                onChange={() => handleCheck(item.id)}
                                className="mt-1 h-4 w-4 rounded border-slate-500 bg-slate-700 text-cyan-600 focus:ring-cyan-500"
                            />
                            <div className="ml-3">
                                <span className={`font-semibold ${checkedItems.has(item.id) ? 'text-green-300' : 'text-slate-200'}`}>
                                    {item.id}. {item.text}
                                </span>
                                <p className={`text-xs mt-1 ${checkedItems.has(item.id) ? 'text-green-400/80' : 'text-slate-400'}`}>
                                    {item.details}
                                </p>
                            </div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};
