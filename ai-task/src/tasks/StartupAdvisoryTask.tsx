import { useState } from 'react';
import { Rocket, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
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
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Startup Advisory</h2>
                <p className="text-gray-400">Startup strategy and planning guidance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Startup Stage <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={startupStage}
                        onChange={(e) => setStartupStage(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select stage...</option>
                        {startupStages.map(stage => (
                            <option key={stage} value={stage} className="bg-gray-800">{stage}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Industry <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., FinTech, HealthTech, EdTech, SaaS"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Business Idea <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        placeholder="Briefly describe your startup idea, target market, and unique value proposition"
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Team Size
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Solo founder, 3 co-founders, 10+ employees"
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Funding Stage
                    </label>
                    <select
                        value={fundingStage}
                        onChange={(e) => setFundingStage(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select funding stage...</option>
                        {fundingStages.map(stage => (
                            <option key={stage} value={stage} className="bg-gray-800">{stage}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Challenges
                    </label>
                    <textarea
                        placeholder="What specific challenges are you facing right now?"
                        value={challenges}
                        onChange={(e) => setChallenges(e.target.value)}
                        rows={3}
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
                        <span>Generating Advisory...</span>
                    </>
                ) : (
                    <>
                        <Rocket size={20} />
                        <span>Generate Startup Advice (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Startup Advisory Report</h3>
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
                                onClick={downloadAdvice}
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
                    <strong>Tip:</strong> Focus on achieving product-market fit before scaling. Validate assumptions with real customers.
                </p>
            </div>
        </div>
    );
}

export default StartupAdvisoryTask;