import { useState } from 'react';
import { Smartphone, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
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
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">UI/UX Design</h2>
                <p className="text-gray-400">User interface and experience design</p>
            </div>

            <div className="space-y-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Platform <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                        >
                            <option value="" className="text-gray-500">Select platform...</option>
                            {platforms.map(p => (
                                <option key={p} value={p} className="bg-gray-800">{p}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Application Type <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Social media app, Productivity tool, E-commerce site"
                            value={appType}
                            onChange={(e) => setAppType(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Target Users <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        placeholder="Describe your target audience: demographics, tech proficiency, needs, etc."
                        value={targetUsers}
                        onChange={(e) => setTargetUsers(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Key Features
                    </label>
                    <textarea
                        placeholder="List the main features your application should have"
                        value={keyFeatures}
                        onChange={(e) => setKeyFeatures(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Specific Requirements
                    </label>
                    <textarea
                        placeholder="Any specific design requirements: brand guidelines, existing style guides, etc."
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
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
                        <span>Generating Design Specs...</span>
                    </>
                ) : (
                    <>
                        <Smartphone size={20} />
                        <span>Generate UI/UX Design (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">UI/UX Design Specifications</h3>
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
                                onClick={downloadDesign}
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
                    <strong>Tip:</strong> Focus on user-centered design principles. Test designs with real users for optimal results.
                </p>
            </div>
        </div>
    );
}

export default UIUXDesignTask;