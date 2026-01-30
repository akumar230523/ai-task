import { useState } from 'react';
import { Briefcase, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
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
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Briefcase className="text-slate-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Business Consulting</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Strategic business advice and planning</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Type <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Restaurant, E-commerce, Manufacturing, Service Company"
                                value={businessType}
                                onChange={(e) => setBusinessType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-slate-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Consulting Area <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={consultingArea}
                                onChange={(e) => setConsultingArea(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-slate-500 focus:outline-none transition-colors bg-white"
                            >
                                <option value="">Select area...</option>
                                {consultingAreas.map(area => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Challenges <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Describe the main challenges your business is facing"
                                value={challenges}
                                onChange={(e) => setChallenges(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-slate-500 focus:outline-none resize-none transition-colors"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Goals
                            </label>
                            <textarea
                                placeholder="What are your short-term and long-term business goals?"
                                value={goals}
                                onChange={(e) => setGoals(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-slate-500 focus:outline-none resize-none transition-colors"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available Budget (₹)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 500000"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-slate-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-slate-600 hover:bg-slate-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
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
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Business Consulting Report</h3>
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
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-sm text-slate-800">
                    <strong>Tip:</strong> Implement changes gradually and measure results at each stage for continuous improvement.
                </p>
            </div>
        </div>
    );
}

export default BusinessConsultingTask;