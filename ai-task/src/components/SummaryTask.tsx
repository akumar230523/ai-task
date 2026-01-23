// TASK 5: SUMMARY TASK
// =======================================================================

import { useState } from 'react';
import { FileSearch, Loader2, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

interface SummaryTaskProps {
    provider: AIProvider;
}

const SummaryTask = ({ provider }: SummaryTaskProps) => {
    const [content, setContent] = useState('');
    const [length, setLength] = useState('medium');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generate = async () => {
        if (!content) {
            alert('Please provide content to summarize');
            return;
        }

        setLoading(true);
        try {
            const prompt = `Summarize the following content in a ${length} format: ${content} Provide a clear, concise summary that captures the main points.`;
            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating summary');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                        <FileSearch className="text-pink-600" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold">Content Summarizer</h2>
                        <p className="text-xs sm:text-sm text-gray-500">Summarize long text</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Content to Summarize *</label>
                        <textarea
                            placeholder="Paste your content here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={10}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Summary Length</label>
                        <select
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none bg-white"
                        >
                            <option value="brief">Brief (2-3 sentences)</option>
                            <option value="medium">Medium (1 paragraph)</option>
                            <option value="detailed">Detailed (multiple paragraphs)</option>
                        </select>
                    </div>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full py-3 sm:py-4 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Summarizing...</span>
                            </>
                        ) : (
                            <>
                                <FileSearch size={20} />
                                <span>Generate Summary (₹99)</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="mt-6 border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Summary</h3>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(result);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-white border-2 hover:bg-gray-50 rounded-lg text-sm"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                        <div className="bg-gray-50 border-2 rounded-lg p-4">
                            <pre className="text-xs sm:text-sm whitespace-pre-wrap">{result}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SummaryTask;
