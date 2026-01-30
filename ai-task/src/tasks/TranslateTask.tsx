import { useState } from 'react';
import { MessageSquare, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

interface TranslateTaskProps {
    provider: AIProvider;
}

const TranslateTask = ({ provider }: TranslateTaskProps) => {
    const [text, setText] = useState('');
    const [fromLang, setFromLang] = useState('auto');
    const [toLang, setToLang] = useState('es');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const languages = [
        { code: 'auto', name: 'Auto-detect' },
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'hi', name: 'Hindi' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ar', name: 'Arabic' },
    ];

    const generate = async () => {
        if (!text) {
            alert('Please provide text to translate');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `Translate the following text ${fromLang === 'auto' ? '' : `from ${fromLang}`} to ${toLang}: ${text}
Provide only the translation.`;
            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error translating text');
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

    const downloadTranslation = () => {
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `translation-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <MessageSquare className="text-indigo-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Language Translator</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Translate between languages</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                            <select
                                value={fromLang}
                                onChange={(e) => setFromLang(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-white text-sm sm:text-base"
                            >
                                {languages.map(lang => (
                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                            <select
                                value={toLang}
                                onChange={(e) => setToLang(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-white text-sm sm:text-base"
                            >
                                {languages.filter(l => l.code !== 'auto').map(lang => (
                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Text to Translate <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Enter text here..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none transition-colors text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Translating...</span>
                            </>
                        ) : (
                            <>
                                <MessageSquare size={20} />
                                <span>Translate (₹99)</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Translation</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={copyToClipboard}
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
                                        onClick={downloadTranslation}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-sm text-indigo-800">
                    <strong>Tip:</strong> For complex translations, consider reviewing with a native speaker for accuracy.
                </p>
            </div>
        </div>
    );
}

export default TranslateTask;