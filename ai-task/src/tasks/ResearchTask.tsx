import { useState } from 'react';
import { Search, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
import type { AIProvider } from '../types/ai';

interface ResearchTaskProps {
    provider: AIProvider;
}

const ResearchTask = ({ provider }: ResearchTaskProps) => {
    const [researchField, setResearchField] = useState('');
    const [researchType, setResearchType] = useState('');
    const [topic, setTopic] = useState('');
    const [researchQuestions, setResearchQuestions] = useState('');
    const [methodology, setMethodology] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const researchFields = [
        'Computer Science',
        'Medicine',
        'Engineering',
        'Social Sciences',
        'Business',
        'Education',
        'Psychology',
        'Environmental Science',
        'Biotechnology',
        'Economics'
    ];

    const researchTypes = [
        'Literature Review',
        'Experimental Research',
        'Case Study',
        'Survey Research',
        'Qualitative Research',
        'Quantitative Research',
        'Mixed Methods',
        'Systematic Review',
        'Meta-analysis',
        'Action Research'
    ];

    const generate = async () => {
        if (!researchField || !researchType || !topic) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As a research expert, create a research plan for ${topic}:
Research Field: ${researchField}
Research Type: ${researchType}
Topic: ${topic}
Research Questions: ${researchQuestions || 'To be developed'}
Methodology Preferences: ${methodology || 'Standard research methods'}

Please provide:
1. Research problem statement
2. Literature review guidelines
3. Research objectives and questions
4. Methodology and research design
5. Data collection methods
6. Data analysis techniques
7. Ethical considerations
8. Timeline and milestones
9. Expected outcomes and contributions
10. Publication and dissemination plan

Format professionally with clear sections.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating research plan. Please try again.');
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
        a.download = `research-plan-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Research & Analytics</h2>
                <p className="text-gray-400">Research and data analysis planning</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Research Field <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={researchField}
                        onChange={(e) => setResearchField(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select field...</option>
                        {researchFields.map(field => (
                            <option key={field} value={field} className="bg-gray-800">{field}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Research Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={researchType}
                        onChange={(e) => setResearchType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select type...</option>
                        {researchTypes.map(type => (
                            <option key={type} value={type} className="bg-gray-800">{type}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Research Topic <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Impact of AI on Education, Renewable Energy Adoption"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Research Questions
                    </label>
                    <textarea
                        placeholder="List your main research questions or hypotheses"
                        value={researchQuestions}
                        onChange={(e) => setResearchQuestions(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Methodology Preferences
                    </label>
                    <textarea
                        placeholder="Any preferred research methods, tools, or approaches"
                        value={methodology}
                        onChange={(e) => setMethodology(e.target.value)}
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
                        <span>Generating Research Plan...</span>
                    </>
                ) : (
                    <>
                        <Search size={20} />
                        <span>Generate Research Plan (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Research Plan</h3>
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
                    <strong>Tip:</strong> Ensure research ethics compliance and obtain necessary approvals before data collection.
                </p>
            </div>
        </div>
    );
}

export default ResearchTask;