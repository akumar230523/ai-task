import { useState } from 'react';
import { DollarSign, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

interface FinanceTaskProps {
    provider: AIProvider;
}

const FinanceTask = ({ provider }: FinanceTaskProps) => {
    const [investmentType, setInvestmentType] = useState('');
    const [amount, setAmount] = useState('');
    const [timeHorizon, setTimeHorizon] = useState('');
    const [riskTolerance, setRiskTolerance] = useState('');
    const [financialGoals, setFinancialGoals] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const investmentTypes = [
        'Stock Market',
        'Mutual Funds',
        'Real Estate',
        'Fixed Deposits',
        'Bonds',
        'Gold',
        'Cryptocurrency',
        'Retirement Planning',
        'Education Fund',
        'Wealth Management'
    ];

    const riskTolerances = [
        'Conservative',
        'Moderate',
        'Aggressive',
        'Very Aggressive'
    ];

    const handleGenerate = async () => {
        if (!investmentType || !amount || !timeHorizon) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As a financial advisor, provide investment guidance for ${investmentType}: 
                Investment Type: ${investmentType} 
                Amount: ₹${amount}
                Time Horizon: ${timeHorizon}
                Risk Tolerance: ${riskTolerance || 'Moderate'}
                Financial Goals: ${financialGoals || 'Wealth creation'}
                Please provide:
                    - Investment strategy and allocation
                    - Risk assessment and management
                    - Expected returns and volatility
                    - Tax implications
                    - Diversification recommendations
                    - Entry and exit strategies
                    - Performance monitoring plan
                    - Alternative investment options
                    - Market condition analysis
                    - Regulatory compliance considerations
                Format professionally with clear sections.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating financial advice. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `financial-advice-${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="text-green-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Finance & Investment</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Investment analysis and planning</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Investment Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={investmentType}
                                onChange={(e) => setInvestmentType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none bg-white transition-colors"
                            >
                                <option value="">Select investment type...</option>
                                {investmentTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Investment Amount (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 500000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Time Horizon <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., 5 years, 10+ years, Short-term"
                                value={timeHorizon}
                                onChange={(e) => setTimeHorizon(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Risk Tolerance
                            </label>
                            <select
                                value={riskTolerance}
                                onChange={(e) => setRiskTolerance(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none bg-white transition-colors"
                            >
                                <option value="">Select risk tolerance...</option>
                                {riskTolerances.map(risk => (
                                    <option key={risk} value={risk}>{risk}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Financial Goals
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Retirement, Home purchase, Education"
                                value={financialGoals}
                                onChange={(e) => setFinancialGoals(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Generating Financial Plan...</span>
                            </>
                        ) : (
                            <>
                                <DollarSign size={20} />
                                <span>Generate Investment Plan (₹99)</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Financial Investment Plan</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCopy}
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
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                    <strong>⚠️ Important:</strong> Past performance is not indicative of future results. Always consult with a certified financial advisor before making investment decisions.
                </p>
            </div>
        </div>
    );
}

export default FinanceTask;