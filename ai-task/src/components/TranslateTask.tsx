// TASK 6: Language Translator
// =======================================================================

import React, { useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';

import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

const TranslateTask: React.FC<{ provider: AIProvider }> = ({ provider }) => {

    const [text, setText] = useState('');
    const [fromLang, setFromLang] = useState('english');
    const [toLang, setToLang] = useState('hindi');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic'];

    const translate = async () => {
        if (!text) {
            alert('Enter text to translate');
            return;
        }
        setLoading(true);
        const prompt = `Translate from ${fromLang} to ${toLang}:\n${text}`;
        const response = await callAI(prompt, provider);
        setResult(response);
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="text-indigo-600" size={24} />
                    </div>
                    <h2 className="text-xl font-bold">Language Translator</h2>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <select
                            value={fromLang}
                            onChange={(e) => setFromLang(e.target.value)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            {languages.map(lang => <option key={lang} value={lang.toLowerCase()}>{lang}</option>)}
                        </select>
                        <select
                            value={toLang}
                            onChange={(e) => setToLang(e.target.value)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            {languages.map(lang => <option key={lang} value={lang.toLowerCase()}>{lang}</option>)}
                        </select>
                    </div>

                    <textarea
                        placeholder="Enter text to translate..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-2 border rounded-lg"
                    />

                    <button
                        onClick={translate}
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                        {loading ? <><Loader2 className="inline animate-spin mr-2" size={18} />Translating...</> : 'Translate (₹99)'}
                    </button>
                </div>

                {result && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-bold mb-2">Translation</h3>
                        <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                    </div>
                )}
            </div>
        </div>
    );

};

export default TranslateTask;
