import { useState } from 'react';
import { FileText, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
import type { AIProvider } from '../types/ai';

interface InvoiceTaskProps {
    provider: AIProvider;
}

const InvoiceTask = ({ provider }: InvoiceTaskProps) => {
    const [business, setBusiness] = useState('');
    const [client, setClient] = useState('');
    const [amount, setAmount] = useState('');
    const [items, setItems] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generate = async () => {
        if (!business || !client || !amount) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `Generate a professional invoice with the following details: 
                Business/Seller: ${business} 
                Client/Buyer: ${client}
                Total Amount: ₹${amount}
                Items/Services: ${items || 'Not specified'}
                Please format it professionally with:
                    - Invoice number and date
                    - Business and client details
                    - Itemized list
                    - Subtotal, tax (if applicable), and total
                    - Payment terms`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating Invoice. Please try again.');
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

    const downloadInvoice = () => {
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Invoice Generator</h2>
                <p className="text-gray-400">Create professional invoices instantly with AI</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Business Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Acme Corporation"
                        value={business}
                        onChange={(e) => setBusiness(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Client Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., John Doe"
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Total Amount (₹) <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="number"
                        placeholder="e.g., 5000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Items/Services (Optional)
                    </label>
                    <textarea
                        placeholder="e.g., Web Development - 40 hours, Design - 10 hours"
                        value={items}
                        onChange={(e) => setItems(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
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
                        <span>Generating Invoice...</span>
                    </>
                ) : (
                    <>
                        <FileText size={20} />
                        <span>Generate Invoice (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Generated Invoice</h3>
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
                                onClick={downloadInvoice}
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
                    <strong>Tip:</strong> The AI will generate a professional invoice based on your inputs.
                    You can download or copy the result for your records.
                </p>
            </div>
        </div>
    );
}

export default InvoiceTask;