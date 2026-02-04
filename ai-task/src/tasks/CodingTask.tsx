import { useState } from 'react';
import { Code, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
import type { AIProvider } from '../types/ai';

interface CodingTaskProps {
    provider: AIProvider;
}

const CodingTask = ({ provider }: CodingTaskProps) => {
    const [language, setLanguage] = useState('');
    const [taskType, setTaskType] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const languages = [
        'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#',
        'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'SQL', 'HTML/CSS'
    ];

    const taskTypes = [
        'Write New Code',
        'Debug Existing Code',
        'Optimize Code',
        'Add Features',
        'Refactor Code',
        'Write Tests',
        'Code Review',
        'Documentation'
    ];

    const handleGenerate = async () => {
        if (!language || !taskType || !description) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As an expert ${language} developer, help with this coding task: 
                Task Type: ${taskType} 
                Language: ${language}
                Description: ${description}
                ${requirements ? `Additional Requirements: ${requirements}` : ''}
                Please provide:
                    - Clean, production-ready code with comments
                    - Explanation of the implementation approach
                    - Best practices followed
                    - Error handling included
                    - Usage examples
                    - Testing considerations
                    - Performance optimizations (if applicable)
                Format with proper syntax highlighting markers and clear documentation.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating code. Please try again.');
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
        link.download = `code-${language.toLowerCase()}-${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Software Development</h2>
                <p className="text-gray-400">AI-powered code generation and debugging</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Programming Language <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select programming language...</option>
                        {languages.map(lang => (
                            <option key={lang} value={lang} className="bg-gray-800">{lang}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Task Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select task type...</option>
                        {taskTypes.map(type => (
                            <option key={type} value={type} className="bg-gray-800">{type}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Task Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        placeholder="Describe what you need the code to do. Be specific about functionality, inputs, outputs, and expected behavior..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none font-mono text-sm transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Additional Requirements (Optional)
                    </label>
                    <textarea
                        placeholder="Any specific requirements: libraries to use, coding standards, performance constraints, security considerations, etc."
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none font-mono text-sm transition-colors"
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
                        <span>Generating Code...</span>
                    </>
                ) : (
                    <>
                        <Code size={20} />
                        <span>Generate Code (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Generated Code</h3>
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
                    <strong>⚠️ Important:</strong> AI-generated code should be reviewed and tested before use in production. Always verify security and performance.
                </p>
            </div>
        </div>
    );
}

export default CodingTask;