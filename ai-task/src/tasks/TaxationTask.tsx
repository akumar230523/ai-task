import { useState } from 'react';
import { Receipt, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
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
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Tax Planning & Filing</h2>
                <p className="text-gray-400">Get personalized tax planning advice</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tax Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={taxType}
                        onChange={(e) => setTaxType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="">Select tax type...</option>
                        {taxTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Annual Income (₹) <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="number"
                        placeholder="e.g., 1200000"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Financial Year <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={financialYear}
                        onChange={(e) => setFinancialYear(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="2024-25">2024-25</option>
                        <option value="2023-24">2023-24</option>
                        <option value="2025-26">2025-26</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Claimed Deductions (₹)
                    </label>
                    <input
                        type="number"
                        placeholder="e.g., 150000 (80C, 80D, HRA, etc.)"
                        value={deductions}
                        onChange={(e) => setDeductions(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Additional Information
                    </label>
                    <textarea
                        placeholder="Provide any additional details: income sources, investments, property ownership, business details, etc."
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        rows={4}
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
                        <span>Generating Tax Plan...</span>
                    </>
                ) : (
                    <>
                        <Receipt size={20} />
                        <span>Generate Tax Plan (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Tax Planning Report</h3>
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
                                onClick={downloadPlan}
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
                    Tax planning advice is for informational purposes only. Always consult with a certified tax professional or CA for official tax filing.
                </p>
            </div>
        </div>
    );
}

export default TaxationTask;