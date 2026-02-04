import { useState } from 'react';
import { DollarSign, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
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
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Finance & Investment</h2>
                <p className="text-gray-400">Investment analysis and planning</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Investment Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={investmentType}
                        onChange={(e) => setInvestmentType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select investment type...</option>
                        {investmentTypes.map(type => (
                            <option key={type} value={type} className="bg-gray-800">{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Investment Amount (₹) <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="number"
                        placeholder="e.g., 500000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Time Horizon <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., 5 years, 10+ years, Short-term"
                        value={timeHorizon}
                        onChange={(e) => setTimeHorizon(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Risk Tolerance
                    </label>
                    <select
                        value={riskTolerance}
                        onChange={(e) => setRiskTolerance(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select risk tolerance...</option>
                        {riskTolerances.map(risk => (
                            <option key={risk} value={risk} className="bg-gray-800">{risk}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Financial Goals
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Retirement, Home purchase, Education"
                        value={financialGoals}
                        onChange={(e) => setFinancialGoals(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>
            </div>

            <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3.5 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: THEME.primary }}
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

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Financial Investment Plan</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
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
                                onClick={handleDownload}
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
                    <strong>⚠️ Important:</strong> Past performance is not indicative of future results. Always consult with a certified financial advisor before making investment decisions.
                </p>
            </div>
        </div>
    );
}

export default FinanceTask;