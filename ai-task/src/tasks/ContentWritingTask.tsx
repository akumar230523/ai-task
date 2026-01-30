import { useState } from 'react';
import { PenTool, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

interface ContentWritingTaskProps {
    provider: AIProvider;
}

const ContentWritingTask = ({ provider }: ContentWritingTaskProps) => {
    const [contentType, setContentType] = useState('');
    const [topic, setTopic] = useState('');
    const [wordCount, setWordCount] = useState('500');
    const [tone, setTone] = useState('professional');
    const [keywords, setKeywords] = useState('');
    const [audience, setAudience] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const contentTypes = [
        'Blog Post', 'Article', 'Social Media Post', 'Product Description',
        'Press Release', 'Newsletter', 'Website Copy', 'Case Study',
        'White Paper', 'How-to Guide'
    ];

    const tones = [
        { value: 'professional', label: 'Professional' },
        { value: 'casual', label: 'Casual & Friendly' },
        { value: 'formal', label: 'Formal' },
        { value: 'conversational', label: 'Conversational' },
        { value: 'persuasive', label: 'Persuasive' },
        { value: 'informative', label: 'Informative' },
        { value: 'entertaining', label: 'Entertaining' },
        { value: 'authoritative', label: 'Authoritative' }
    ];

    const handleGenerate = async () => {
        if (!contentType || !topic || !wordCount) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `Write a ${contentType} about "${topic}".
                Content Specifications:
                    - Word Count: Approximately ${wordCount} words
                    - Tone: ${tone}
                    - Target Audience: ${audience || 'General audience'}
                    ${keywords ? `- SEO Keywords: ${keywords}` : ''}
                Requirements:
                    - Engaging title/headline
                    - Clear structure with proper headings
                    - Well-researched and accurate information
                    - Natural keyword integration (if provided)
                    - Strong introduction and conclusion
                    - Readable and engaging writing style
                    - Call-to-action (if appropriate)
                Write comprehensive, high-quality content that is original and engaging.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating content. Please try again.');
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
        link.download = `content-${contentType.toLowerCase().replace(/\s+/g, '-')}.txt`;
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
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <PenTool className="text-yellow-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Content Writing</h2>
                            <p className="text-xs sm:text-sm text-gray-500">AI-powered content creation</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={contentType}
                                onChange={(e) => setContentType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none bg-white transition-colors"
                            >
                                <option value="">Select content type...</option>
                                {contentTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Topic <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Benefits of Cloud Computing for Small Businesses"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Word Count <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="500"
                                value={wordCount}
                                onChange={(e) => setWordCount(e.target.value)}
                                min="100"
                                max="5000"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tone <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none bg-white transition-colors"
                            >
                                {tones.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Audience
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Small business owners, Tech enthusiasts, Marketing professionals"
                                value={audience}
                                onChange={(e) => setAudience(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                SEO Keywords (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., cloud computing, digital transformation, SaaS"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Generating Content...</span>
                            </>
                        ) : (
                            <>
                                <PenTool size={20} />
                                <span>Generate Content (₹99)</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Generated Content</h3>
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
                                        className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    AI-generated content should be reviewed and fact-checked. Customize it to match your brand voice and add personal insights.
                </p>
            </div>
        </div>
    );
}

export default ContentWritingTask;