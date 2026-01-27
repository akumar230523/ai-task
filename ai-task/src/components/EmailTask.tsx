// TASK 4: EMAIL TASK
// =======================================================================

import { useState } from 'react';
import { Mail, Loader2, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

interface EmailTaskProps {
    provider: AIProvider;
}

const EmailTask = ({ provider }: EmailTaskProps) => {
    const [recipient, setRecipient] = useState('');
    const [purpose, setPurpose] = useState('');
    const [tone, setTone] = useState('professional');
    const [details, setDetails] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generate = async () => {
        if (!recipient || !purpose) {
            alert('Please fill required fields');
            return;
        }

        setLoading(true);
        try {
            const prompt = `Write a ${tone} email with these details: To: ${recipient} Purpose: ${purpose} Additional Context: ${details || 'None'} 
                Please write a well-structured email with subject line, greeting, body, and closing.`;
            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating email.  Please try again.');
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

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Mail className="text-orange-600" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold">Email Writer</h2>
                        <p className="text-xs sm:text-sm text-gray-500">Compose professional emails</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Recipient *</label>
                        <input
                            type="text"
                            placeholder="e.g., Client, Manager, Team"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Purpose *</label>
                        <input
                            type="text"
                            placeholder="e.g., Follow-up on meeting, Request information"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Tone</label>
                        <select
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none bg-white"
                        >
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="formal">Formal</option>
                            <option value="casual">Casual</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Additional Details</label>
                        <textarea
                            placeholder="Any specific points to include..."
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none"
                        />
                    </div>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full py-3 sm:py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Writing Email...</span>
                            </>
                        ) : (
                            <>
                                <Mail size={20} />
                                <span>Generate Email (₹99)</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="mt-6 border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Generated Email</h3>
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 px-4 py-2 bg-white border-2 hover:bg-gray-50 rounded-lg text-sm"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                            </button>
                        </div>
                        <div className="bg-gray-50 border-2 rounded-lg p-4 max-h-96 overflow-y-auto">
                            <pre className="text-xs sm:text-sm whitespace-pre-wrap">{result}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmailTask;