// TASK 1: Invoice Generator
// =======================================================================

import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';

import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

const InvoiceTask: React.FC<{ provider: AIProvider }> = ({ provider }) => {

    const [business, setBusiness] = useState('');
    const [client, setClient] = useState('');
    const [amount, setAmount] = useState('');
    const [items, setItems] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        if (!business || !client || !amount) {
            alert('Fill all fields');
            return;
        }
        setLoading(true);
        const prompt = `Generate professional invoice:\nFrom: ${business}\nTo: ${client}\nAmount: ₹${amount}\nItems: ${items}`;
        const response = await callAI(prompt, provider);
        setResult(response);
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="text-blue-600" size={24} />
                    </div>
                    <h2 className="text-xl font-bold">Invoice Generator</h2>
                </div>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Your Business Name"
                        value={business}
                        onChange={(e) => setBusiness(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="text"
                        placeholder="Client Name"
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="number"
                        placeholder="Total Amount (₹)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <textarea
                        placeholder="Items/Services (optional)"
                        value={items}
                        onChange={(e) => setItems(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg"
                    />

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? <><Loader2 className="inline animate-spin mr-2" size={18} />Generating...</> : 'Generate Invoice (₹99)'}
                    </button>
                </div>

                {result && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between mb-2">
                            <h3 className="font-bold">Generated Invoice</h3>
                            <button className="text-blue-600 text-sm">Download</button>
                        </div>
                        <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                    </div>
                )}
            </div>
        </div>
    );

};

export default InvoiceTask;