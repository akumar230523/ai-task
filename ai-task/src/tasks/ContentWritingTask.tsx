import { useState } from 'react';
import { PenTool, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
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
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Content Writing</h2>
                <p className="text-gray-400">AI-powered content creation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Content Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select content type...</option>
                        {contentTypes.map(type => (
                            <option key={type} value={type} className="bg-gray-800">{type}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Topic <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Benefits of Cloud Computing for Small Businesses"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Word Count <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="number"
                        placeholder="500"
                        value={wordCount}
                        onChange={(e) => setWordCount(e.target.value)}
                        min="100"
                        max="5000"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tone <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        {tones.map(t => (
                            <option key={t.value} value={t.value} className="bg-gray-800">{t.label}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Target Audience
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Small business owners, Tech enthusiasts, Marketing professionals"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        SEO Keywords (Optional)
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., cloud computing, digital transformation, SaaS"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
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
                        <span>Generating Content...</span>
                    </>
                ) : (
                    <>
                        <PenTool size={20} />
                        <span>Generate Content (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Generated Content</h3>
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
                    <strong>Tip:</strong> AI-generated content should be reviewed and fact-checked. Customize it to match your brand voice and add personal insights.
                </p>
            </div>
        </div>
    );
}

export default ContentWritingTask;