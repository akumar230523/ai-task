import { useState } from 'react';
import { FileEdit, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
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

    const generate = async () => {
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

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadEdited = () => {
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `edited-${contentType.toLowerCase().replace(/\s+/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Editing & Proofreading</h2>
                <p className="text-gray-400">Professional content editing service</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Content Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="">Select content type...</option>
                        {contentTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Editing Level
                    </label>
                    <select
                        value={editingLevel}
                        onChange={(e) => setEditingLevel(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        {editingLevels.map(level => (
                            <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Content to Edit <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        placeholder="Paste your content here for editing and proofreading..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={12}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none font-mono text-sm transition-colors"
                    />
                    <div className="mt-1 text-xs text-gray-500">
                        Characters: {content.length} | Words: {content.split(/\s+/).filter(Boolean).length}
                    </div>
                </div>
            </div>

            <button
                onClick={generate}
                disabled={loading}
                className="w-full py-3.5 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: THEME.primary }}
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

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Edited Content</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={copyToClipboard}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={downloadEdited}
                                className="px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 hover:opacity-90"
                                style={{ backgroundColor: THEME.primary }}
                            >
                                <Download size={16} />
                                <span>Download</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto dark-scrollbar">
                        <pre className="text-sm whitespace-pre-wrap font-mono text-gray-300">
                            {result}
                        </pre>
                    </div>
                </div>
            )}

            <div
                className="mt-6 p-4 rounded-lg border"
                style={{
                    backgroundColor: `${THEME.primary}10`,
                    borderColor: `${THEME.primary}30`
                }}
            >
                <p className="text-sm" style={{ color: THEME.primary }}>
                    AI editing improves grammar, clarity, and style. For critical documents, consider human proofreading as well.
                </p>
            </div>
        </div>
    );
}

export default EditingTask;