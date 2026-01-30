import { useState } from 'react';
import { TrendingUp, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
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
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-lime-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Digital Marketing</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Marketing strategy and content planning</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Campaign Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={campaignType}
                                onChange={(e) => setCampaignType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-lime-500 focus:outline-none transition-colors bg-white"
                            >
                                <option value="">Select campaign type...</option>
                                {campaignTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Industry <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., E-commerce, SaaS, Healthcare, Education"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-lime-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Audience <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Describe your target audience in detail: demographics, interests, online behavior"
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-lime-500 focus:outline-none resize-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget (₹)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 50000"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-lime-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Campaign Goals
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Increase sales by 20%, Generate 1000 leads"
                                value={goals}
                                onChange={(e) => setGoals(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-lime-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-lime-600 hover:bg-lime-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
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
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Digital Marketing Strategy</h3>
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
                                        className="flex items-center gap-2 px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            <div className="mt-6 p-4 bg-lime-50 border border-lime-200 rounded-lg">
                <p className="text-sm text-lime-800">
                    <strong>Tip:</strong> Regularly track and analyze campaign performance. Be prepared to adjust strategies based on data insights.
                </p>
            </div>
        </div>
    );
}

export default DigitalMarketingTask;