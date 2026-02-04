import { useState } from 'react';
import { Briefcase, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
import type { AIProvider } from '../types/ai';

interface BusinessConsultingTaskProps {
    provider: AIProvider;
}

const BusinessConsultingTask = ({ provider }: BusinessConsultingTaskProps) => {
    const [businessType, setBusinessType] = useState('');
    const [consultingArea, setConsultingArea] = useState('');
    const [challenges, setChallenges] = useState('');
    const [goals, setGoals] = useState('');
    const [budget, setBudget] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const consultingAreas = [
        'Strategic Planning',
        'Operations Improvement',
        'Financial Management',
        'Marketing Strategy',
        'Organizational Structure',
        'Process Optimization',
        'Technology Implementation',
        'Market Expansion',
        'Risk Management',
        'Business Transformation'
    ];

    const handleGenerate = async () => {
        if (!businessType || !consultingArea || !challenges) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As a business consultant, provide advice for ${businessType}: 
                Business Type: ${businessType} 
                Consulting Area: ${consultingArea}
                Current Challenges: ${challenges}
                Business Goals: ${goals || 'Growth and profitability'}
                Budget: ${budget || 'Not specified'}
                Please provide:
                    - Situation analysis and assessment
                    - Strategic recommendations
                    - Implementation roadmap
                    - Key performance indicators
                    - Risk assessment and mitigation
                    - Resource allocation plan
                    - Timeline with milestones
                    - Success measurement criteria
                    - Alternative approaches
                    - Monitoring and evaluation framework
                Format professionally with clear sections.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating consulting advice. Please try again.');
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
        link.download = `business-consulting-${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Business Consulting</h2>
                <p className="text-gray-400">Strategic business advice and planning</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Business Type <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Restaurant, E-commerce, Manufacturing, Service Company"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Consulting Area <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={consultingArea}
                        onChange={(e) => setConsultingArea(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select area...</option>
                        {consultingAreas.map(area => (
                            <option key={area} value={area} className="bg-gray-800">{area}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Challenges <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        placeholder="Describe the main challenges your business is facing"
                        value={challenges}
                        onChange={(e) => setChallenges(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Business Goals
                    </label>
                    <textarea
                        placeholder="What are your short-term and long-term business goals?"
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Available Budget (₹)
                    </label>
                    <input
                        type="number"
                        placeholder="e.g., 500000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
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
                        <span>Generating Consultation...</span>
                    </>
                ) : (
                    <>
                        <Briefcase size={20} />
                        <span>Generate Business Advice (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Business Consulting Report</h3>
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
                    <strong>Tip:</strong> Implement changes gradually and measure results at each stage for continuous improvement.
                </p>
            </div>
        </div>
    );
}

export default BusinessConsultingTask;