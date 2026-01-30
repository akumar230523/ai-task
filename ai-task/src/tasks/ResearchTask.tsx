import { useState } from 'react';
import { Search, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
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
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-fuchsia-100 rounded-lg flex items-center justify-center">
                            <Search className="text-fuchsia-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Research & Analytics</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Research and data analysis planning</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Research Field <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={researchField}
                                onChange={(e) => setResearchField(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-fuchsia-500 focus:outline-none transition-colors bg-white text-sm sm:text-base"
                            >
                                <option value="">Select field...</option>
                                {researchFields.map(field => (
                                    <option key={field} value={field}>{field}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Research Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={researchType}
                                onChange={(e) => setResearchType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-fuchsia-500 focus:outline-none transition-colors bg-white text-sm sm:text-base"
                            >
                                <option value="">Select type...</option>
                                {researchTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Research Topic <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Impact of AI on Education, Renewable Energy Adoption"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-fuchsia-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Research Questions
                            </label>
                            <textarea
                                placeholder="List your main research questions or hypotheses"
                                value={researchQuestions}
                                onChange={(e) => setResearchQuestions(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-fuchsia-500 focus:outline-none resize-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Methodology Preferences
                            </label>
                            <textarea
                                placeholder="Any preferred research methods, tools, or approaches"
                                value={methodology}
                                onChange={(e) => setMethodology(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-fuchsia-500 focus:outline-none resize-none transition-colors text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
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
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Research Plan</h3>
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
                                        onClick={downloadPlan}
                                        className="flex items-center gap-2 px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            <div className="mt-6 p-4 bg-fuchsia-50 border border-fuchsia-200 rounded-lg">
                <p className="text-sm text-fuchsia-800">
                    <strong>Tip:</strong> Ensure research ethics compliance and obtain necessary approvals before data collection.
                </p>
            </div>
        </div>
    );
}

export default ResearchTask;