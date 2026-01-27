// TASK 1: Invoice Task
// =======================================================================

import { useState } from 'react';
import { FileText, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
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

            // Check if response contains failure message
            if (response.includes('🚨 AI SERVICE UNAVAILABLE') || response.includes('❌')) {
                console.error('AI service returned failure message');
            }
        } catch (error) {
            setResult(`❌ Error: ${error.message}\n\nPlease check your internet connection and API configuration.`);
            console.error('Task execution error:', error);
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
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Form Section */}
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Invoice Details</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Fill in the information below</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Business Name */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Business Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Acme Corporation"
                                value={business}
                                onChange={(e) => setBusiness(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        {/* Client Name */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Client Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., John Doe"
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        {/* Amount */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Total Amount (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 5000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        {/* Items/Services */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Items/Services (Optional)
                            </label>
                            <textarea
                                placeholder="e.g., Web Development - 40 hours, Design - 10 hours"
                                value={items}
                                onChange={(e) => setItems(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none transition-colors text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
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
                </div>

                {/* Result Section */}
                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Generated Invoice</h3>
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
                                        onClick={downloadInvoice}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            {/* Info Card */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> The AI will generate a professional invoice based on your inputs.
                    You can download or copy the result for your records.
                </p>
            </div>
        </div>
    );
}

export default InvoiceTask;