import { useState } from 'react';
import { TrendingUp, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
import type { AIProvider } from '../types/ai';

interface DigitalMarketingTaskProps {
    provider: AIProvider;
}

const DigitalMarketingTask = ({ provider }: DigitalMarketingTaskProps) => {
    const [campaignType, setCampaignType] = useState('');
    const [industry, setIndustry] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [budget, setBudget] = useState('');
    const [goals, setGoals] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const campaignTypes = [
        'Social Media Campaign',
        'Search Engine Marketing',
        'Email Marketing',
        'Content Marketing',
        'Influencer Marketing',
        'Video Marketing',
        'Affiliate Marketing',
        'Brand Awareness',
        'Lead Generation',
        'Product Launch'
    ];

    const handleGenerate = async () => {
        if (!campaignType || !industry || !targetAudience) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As a digital marketing expert, create a strategy for ${campaignType}: 
                Campaign Type: ${campaignType} 
                Industry: ${industry}
                Target Audience: ${targetAudience}
                Budget: ${budget || 'Not specified'}
                Goals: ${goals || 'Increase brand awareness and sales'}
                Please provide:
                    - Campaign objectives and KPIs
                    - Target platform recommendations
                    - Content strategy and calendar
                    - Ad copy and creative guidelines
                    - Budget allocation plan
                    - Timeline and milestones
                    - Competitor analysis approach
                    - Measurement and analytics plan
                    - Optimization strategies
                    - ROI calculation methodology
                Format professionally with clear sections.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating marketing strategy. Please try again.');
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
        link.download = `digital-marketing-${campaignType.toLowerCase()}-${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Digital Marketing</h2>
                <p className="text-gray-400">Marketing strategy and content planning</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Campaign Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={campaignType}
                        onChange={(e) => setCampaignType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select campaign type...</option>
                        {campaignTypes.map(type => (
                            <option key={type} value={type} className="bg-gray-800">{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Industry <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., E-commerce, SaaS, Healthcare, Education"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Target Audience <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        placeholder="Describe your target audience in detail: demographics, interests, online behavior"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Budget (₹)
                    </label>
                    <input
                        type="number"
                        placeholder="e.g., 50000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Campaign Goals
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Increase sales by 20%, Generate 1000 leads"
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
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
                        <span>Generating Strategy...</span>
                    </>
                ) : (
                    <>
                        <TrendingUp size={20} />
                        <span>Generate Marketing Strategy (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Digital Marketing Strategy</h3>
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
                    <strong>Tip:</strong> Regularly track and analyze campaign performance. Be prepared to adjust strategies based on data insights.
                </p>
            </div>
        </div>
    );
}

export default DigitalMarketingTask;