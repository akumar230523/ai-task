// TASK 2: Legal Document Drafter
// =======================================================================

import React, { useState } from 'react';
import { Scale, Loader2 } from 'lucide-react';

import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

const LegalTask: React.FC<{ provider: AIProvider }> = ({ provider }) => {

    const [docType, setDocType] = useState('');
    const [details, setDetails] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        if (!docType || !details) {
            alert('Fill all fields');
            return;
        }
        setLoading(true);
        const prompt = `Draft ${docType} with these details:\n${details}`;
        const response = await callAI(prompt, provider);
        setResult(response);
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Scale className="text-purple-600" size={24} />
                    </div>
                    <h2 className="text-xl font-bold">Legal Document Drafter</h2>
                </div>

                <div className="space-y-4">
                    <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        <option value="">Select Document Type</option>
                        <option value="NDA">NDA (Non-Disclosure Agreement)</option>
                        <option value="Service Agreement">Service Agreement</option>
                        <option value="Employment Contract">Employment Contract</option>
                        <option value="Partnership Agreement">Partnership Agreement</option>
                        <option value="Rental Agreement">Rental Agreement</option>
                    </select>

                    <textarea
                        placeholder="Enter key terms and clauses..."
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-2 border rounded-lg"
                    />

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400"
                    >
                        {loading ? <><Loader2 className="inline animate-spin mr-2" size={18} />Drafting...</> : 'Generate Document (₹99)'}
                    </button>
                </div>

                {result && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between mb-2">
                            <h3 className="font-bold">Legal Document</h3>
                            <button className="text-purple-600 text-sm">Download</button>
                        </div>
                        <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                    </div>
                )}
            </div>
        </div>
    );
    
};

export default LegalTask;