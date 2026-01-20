// TASK 5: Content Summarizer
// =======================================================================

import React, { useState } from 'react';
import { FileSearch, Loader2 } from 'lucide-react';

import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

const SummaryTask: React.FC<{ provider: AIProvider }> = ({ provider }) => {

    const [content, setContent] = useState('');
    const [length, setLength] = useState('medium');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        if (!content) {
            alert('Enter content to summarize');
            return;
        }
        setLoading(true);
        const prompt = `Summarize this (${length} length):\n${content}`;
        const response = await callAI(prompt, provider);
        setResult(response);
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                        <FileSearch className="text-pink-600" size={24} />
                    </div>
                    <h2 className="text-xl font-bold">Content Summarizer</h2>
                </div>

                <div className="space-y-4">
                    <textarea
                        placeholder="Paste article, document, or any long text here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={8}
                        className="w-full px-4 py-2 border rounded-lg"
                    />

                    <select
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        <option value="short">Short Summary (2-3 sentences)</option>
                        <option value="medium">Medium Summary (1 paragraph)</option>
                        <option value="long">Detailed Summary (multiple paragraphs)</option>
                    </select>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 disabled:bg-gray-400"
                    >
                        {loading ? <><Loader2 className="inline animate-spin mr-2" size={18} />Summarizing...</> : 'Generate Summary (₹99)'}
                    </button>
                </div>

                {result && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-bold mb-2">Summary</h3>
                        <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                    </div>
                )}
            </div>
        </div>
    );

};

export default SummaryTask;
