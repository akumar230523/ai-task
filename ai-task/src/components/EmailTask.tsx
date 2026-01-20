// TASK 4: Email Writer
// =======================================================================

import React, { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';

import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

const EmailTask: React.FC<{ provider: AIProvider }> = ({ provider }) => {

    const [recipient, setRecipient] = useState('');
    const [purpose, setPurpose] = useState('');
    const [tone, setTone] = useState('professional');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        if (!recipient || !purpose) {
            alert('Fill all fields');
            return;
        }
        setLoading(true);
        const prompt = `Write a ${tone} email to ${recipient} about: ${purpose}`;
        const response = await callAI(prompt, provider);
        setResult(response);
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Mail className="text-orange-600" size={24} />
                    </div>
                    <h2 className="text-xl font-bold">Professional Email Writer</h2>
                </div>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Recipient Name/Company"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    />

                    <textarea
                        placeholder="Email purpose/context..."
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border rounded-lg"
                    />

                    <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="formal">Formal</option>
                        <option value="casual">Casual</option>
                    </select>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-400"
                    >
                        {loading ? <><Loader2 className="inline animate-spin mr-2" size={18} />Writing...</> : 'Generate Email (₹99)'}
                    </button>
                </div>

                {result && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between mb-2">
                            <h3 className="font-bold">Email Draft</h3>
                            <button className="text-orange-600 text-sm">Copy</button>
                        </div>
                        <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                    </div>
                )}
            </div>
        </div>
    );

};

export default EmailTask;

