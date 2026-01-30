import { useState } from 'react';
import { Smartphone, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

interface UIUXDesignTaskProps {
    provider: AIProvider;
}

const UIUXDesignTask = ({ provider }: UIUXDesignTaskProps) => {
    const [platform, setPlatform] = useState('');
    const [appType, setAppType] = useState('');
    const [targetUsers, setTargetUsers] = useState('');
    const [keyFeatures, setKeyFeatures] = useState('');
    const [requirements, setRequirements] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const platforms = [
        'Web Application',
        'Mobile App (iOS)',
        'Mobile App (Android)',
        'Desktop Application',
        'Responsive Website',
        'Dashboard/Admin Panel',
        'E-commerce Platform'
    ];

    const generate = async () => {
        if (!platform || !appType || !targetUsers) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As a UI/UX designer, create design specifications for ${appType} on ${platform}:

Platform: ${platform}
Application Type: ${appType}
Target Users: ${targetUsers}
Key Features: ${keyFeatures || 'Standard features'}
Specific Requirements: ${requirements || 'None'}

Please provide:
1. User flow diagrams and user journeys
2. Information architecture and sitemap
3. Wireframe recommendations
4. UI design system (colors, typography, spacing)
5. Component library suggestions
6. Interaction design patterns
7. Accessibility considerations
8. Responsive design guidelines
9. Usability testing recommendations
10. Prototyping suggestions

Format professionally with clear sections.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating design specifications. Please try again.');
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

    const downloadDesign = () => {
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `uiux-design-${Date.now()}.txt`;
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
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Smartphone className="text-indigo-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">UI/UX Design</h2>
                            <p className="text-xs sm:text-sm text-gray-500">User interface and experience design</p>
                        </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Platform <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors bg-white"
                                >
                                    <option value="">Select platform...</option>
                                    {platforms.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Application Type <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Social media app, Productivity tool, E-commerce site"
                                    value={appType}
                                    onChange={(e) => setAppType(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Users <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Describe your target audience: demographics, tech proficiency, needs, etc."
                                value={targetUsers}
                                onChange={(e) => setTargetUsers(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Key Features
                            </label>
                            <textarea
                                placeholder="List the main features your application should have"
                                value={keyFeatures}
                                onChange={(e) => setKeyFeatures(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Specific Requirements
                            </label>
                            <textarea
                                placeholder="Any specific design requirements: brand guidelines, existing style guides, etc."
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Generating Design Specs...</span>
                            </>
                        ) : (
                            <>
                                <Smartphone size={20} />
                                <span>Generate UI/UX Design (₹99)</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">UI/UX Design Specifications</h3>
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
                                        onClick={downloadDesign}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-sm text-indigo-800">
                    <strong>Tip:</strong> Focus on user-centered design principles. Test designs with real users for optimal results.
                </p>
            </div>
        </div>
    );
}

export default UIUXDesignTask;