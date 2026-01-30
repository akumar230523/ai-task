import { useState } from 'react';
import { FileEdit, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

interface EditingTaskProps {
    provider: AIProvider;
}

const EditingTask = ({ provider }: EditingTaskProps) => {
    const [content, setContent] = useState('');
    const [contentType, setContentType] = useState('');
    const [editingLevel, setEditingLevel] = useState('comprehensive');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const contentTypes = [
        'Article/Blog Post',
        'Academic Paper',
        'Business Document',
        'Marketing Copy',
        'Email/Letter',
        'Resume/CV',
        'Social Media Post',
        'Website Content'
    ];

    const editingLevels = [
        { value: 'light', label: 'Light Proofreading (Grammar & Spelling)' },
        { value: 'standard', label: 'Standard Editing (Grammar, Style, Clarity)' },
        { value: 'comprehensive', label: 'Comprehensive Edit (Full Rewrite)' }
    ];

    const handleGenerate = async () => {
        if (!content || !contentType) {
            alert('Please provide content and select type');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As a professional editor, review and improve this ${contentType}:

                ${content}

                Editing Level: ${editingLevel}
                Please provide:
                    - Edited version with improvements highlighted in [brackets]
                    - Summary of changes made
                    - Grammar and spelling corrections
                    - Style and clarity improvements
                    - Readability score before and after
                    - Suggestions for further improvement
                Format clearly showing original issues and corrections.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error editing content. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `edited-${contentType.toLowerCase().replace(/\s+/g, '-')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <FileEdit className="text-red-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Editing & Proofreading</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Professional content editing service</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={contentType}
                                onChange={(e) => setContentType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none bg-white transition-colors"
                            >
                                <option value="">Select content type...</option>
                                {contentTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Editing Level
                            </label>
                            <select
                                value={editingLevel}
                                onChange={(e) => setEditingLevel(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none bg-white transition-colors"
                            >
                                {editingLevels.map(level => (
                                    <option key={level.value} value={level.value}>{level.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content to Edit <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Paste your content here for editing and proofreading..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={12}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none resize-none font-mono text-sm transition-colors"
                            />
                            <div className="mt-1 text-xs text-gray-500">
                                Characters: {content.length} | Words: {content.split(/\s+/).filter(Boolean).length}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Editing Content...</span>
                            </>
                        ) : (
                            <>
                                <FileEdit size={20} />
                                <span>Edit Content (₹99)</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Edited Content</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 border-2 border-gray-300 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                                    >
                                        {copied ? (
                                            <>
                                                <Check size={16} />
                                                <span className="hidden sm:inline">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={16} />
                                                <span className="hidden sm:inline">Copy</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm"
                                    >
                                        <Download size={16} />
                                        <span className="hidden sm:inline">Download</span>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6 max-h-96 overflow-y-auto">
                                <pre className="text-xs sm:text-sm whitespace-pre-wrap font-mono text-gray-800">
                                    {result}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    AI editing improves grammar, clarity, and style. For critical documents, consider human proofreading as well.
                </p>
            </div>
        </div>
    );
}

export default EditingTask;