// TASK 6: TRANSLATE TASK
// =======================================================================

import { useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
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

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="text-indigo-600" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold">Language Translator</h2>
                        <p className="text-xs sm:text-sm text-gray-500">Translate between languages</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">From</label>
                        <select
                            value={fromLang}
                            onChange={(e) => setFromLang(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-white"
                        >
                            {languages.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">To</label>
                        <select
                            value={toLang}
                            onChange={(e) => setToLang(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-white"
                        >
                            {languages.filter(l => l.code !== 'auto').map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Text to Translate *</label>
                        <textarea
                            placeholder="Enter text here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
                        />
                    </div>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full py-3 sm:py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
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
                    <div className="mt-6 border-t pt-6">
                        <h3 className="font-bold mb-4">Translation</h3>
                        <div className="bg-gray-50 border-2 rounded-lg p-4">
                            <pre className="text-xs sm:text-sm whitespace-pre-wrap">{result}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TranslateTask;