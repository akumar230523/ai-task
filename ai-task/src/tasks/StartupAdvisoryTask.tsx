import { useState } from 'react';
import { Rocket, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

interface StartupAdvisoryTaskProps {
    provider: AIProvider;
}

const StartupAdvisoryTask = ({ provider }: StartupAdvisoryTaskProps) => {
    const [startupStage, setStartupStage] = useState('');
    const [industry, setIndustry] = useState('');
    const [idea, setIdea] = useState('');
    const [teamSize, setTeamSize] = useState('');
    const [fundingStage, setFundingStage] = useState('');
    const [challenges, setChallenges] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const startupStages = [
        'Ideation',
        'Validation',
        'Early Traction',
        'Growth',
        'Scale',
        'Expansion'
    ];

    const fundingStages = [
        'Bootstrapped',
        'Pre-Seed',
        'Seed',
        'Series A',
        'Series B',
        'Series C+'
    ];

    const generate = async () => {
        if (!startupStage || !industry || !idea) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As a startup advisor, provide guidance for ${startupStage} stage startup:
Startup Stage: ${startupStage}
Industry: ${industry}
Business Idea: ${idea}
Team Size: ${teamSize || 'Small team'}
Funding Stage: ${fundingStage || 'Early stage'}
Challenges: ${challenges || 'Standard startup challenges'}

Please provide:
1. Market analysis and opportunity assessment
2. Business model recommendations
3. Go-to-market strategy
4. Funding roadmap and investor pitch guidance
5. Team building and hiring strategy
6. Key metrics to track
7. Risk assessment and mitigation
8. Growth hacking techniques
9. Legal and compliance considerations
10. Exit strategy options

Format professionally with clear sections.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating startup advice. Please try again.');
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

    const downloadAdvice = () => {
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `startup-advisory-${Date.now()}.txt`;
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
                        <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                            <Rocket className="text-violet-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Startup Advisory</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Startup strategy and planning guidance</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Startup Stage <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={startupStage}
                                onChange={(e) => setStartupStage(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none transition-colors bg-white text-sm sm:text-base"
                            >
                                <option value="">Select stage...</option>
                                {startupStages.map(stage => (
                                    <option key={stage} value={stage}>{stage}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Industry <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., FinTech, HealthTech, EdTech, SaaS"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Idea <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Briefly describe your startup idea, target market, and unique value proposition"
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none resize-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Team Size
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Solo founder, 3 co-founders, 10+ employees"
                                value={teamSize}
                                onChange={(e) => setTeamSize(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Funding Stage
                            </label>
                            <select
                                value={fundingStage}
                                onChange={(e) => setFundingStage(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none transition-colors bg-white text-sm sm:text-base"
                            >
                                <option value="">Select funding stage...</option>
                                {fundingStages.map(stage => (
                                    <option key={stage} value={stage}>{stage}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Challenges
                            </label>
                            <textarea
                                placeholder="What specific challenges are you facing right now?"
                                value={challenges}
                                onChange={(e) => setChallenges(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none resize-none transition-colors text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Generating Advisory...</span>
                            </>
                        ) : (
                            <>
                                <Rocket size={20} />
                                <span>Generate Startup Advice (₹99)</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Startup Advisory Report</h3>
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
                                        onClick={downloadAdvice}
                                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            <div className="mt-6 p-4 bg-violet-50 border border-violet-200 rounded-lg">
                <p className="text-sm text-violet-800">
                    <strong>Tip:</strong> Focus on achieving product-market fit before scaling. Validate assumptions with real customers.
                </p>
            </div>
        </div>
    );
}

export default StartupAdvisoryTask;