import { useState } from 'react';
import { Receipt, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

interface TaxationTaskProps {
    provider: AIProvider;
}

const TaxationTask = ({ provider }: TaxationTaskProps) => {
    const [taxType, setTaxType] = useState('');
    const [income, setIncome] = useState('');
    const [deductions, setDeductions] = useState('');
    const [financialYear, setFinancialYear] = useState('2024-25');
    const [details, setDetails] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const taxTypes = [
        'Income Tax (Individual)',
        'Income Tax (Business)',
        'GST (Goods & Services Tax)',
        'TDS (Tax Deducted at Source)',
        'Corporate Tax',
        'Capital Gains Tax',
        'Professional Tax',
        'Property Tax'
    ];

    const generate = async () => {
        if (!taxType || !income) {
            alert('Please fill required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As a tax consultant, provide comprehensive tax planning advice for:
Tax Type: ${taxType}
Annual Income: ₹${income}
Claimed Deductions: ${deductions || 'None specified'}
Financial Year: ${financialYear}
Additional Details: ${details || 'None'}

Please provide:
1. Tax liability calculation breakdown
2. Available deductions and exemptions
3. Tax-saving strategies and recommendations
4. Filing requirements and deadlines
5. Documents needed for filing
6. Penalty implications for late filing
7. Tips for next financial year

Format as a comprehensive tax planning guide.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating tax plan. Please try again.');
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

    const downloadPlan = () => {
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tax-plan-${financialYear}.txt`;
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
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Receipt className="text-amber-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Tax Planning & Filing</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Get personalized tax planning advice</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tax Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={taxType}
                                onChange={(e) => setTaxType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none bg-white transition-colors text-sm sm:text-base"
                            >
                                <option value="">Select tax type...</option>
                                {taxTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Annual Income (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 1200000"
                                value={income}
                                onChange={(e) => setIncome(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Financial Year <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={financialYear}
                                onChange={(e) => setFinancialYear(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none bg-white transition-colors text-sm sm:text-base"
                            >
                                <option value="2024-25">2024-25</option>
                                <option value="2023-24">2023-24</option>
                                <option value="2025-26">2025-26</option>
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Claimed Deductions (₹)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 150000 (80C, 80D, HRA, etc.)"
                                value={deductions}
                                onChange={(e) => setDeductions(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Information
                            </label>
                            <textarea
                                placeholder="Provide any additional details: income sources, investments, property ownership, business details, etc."
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none resize-none transition-colors text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Generating Tax Plan...</span>
                            </>
                        ) : (
                            <>
                                <Receipt size={20} />
                                <span>Generate Tax Plan (₹99)</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Tax Planning Report</h3>
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
                                        onClick={downloadPlan}
                                        className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                    Tax planning advice is for informational purposes only. Always consult with a certified tax professional or CA for official tax filing.
                </p>
            </div>
        </div>
    );
}

export default TaxationTask;