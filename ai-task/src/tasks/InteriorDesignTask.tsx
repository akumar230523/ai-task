import { useState } from 'react';
import { Sofa, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
import type { AIProvider } from '../types/ai';

interface InteriorDesignTaskProps {
    provider: AIProvider;
}

const InteriorDesignTask = ({ provider }: InteriorDesignTaskProps) => {
    const [spaceType, setSpaceType] = useState('');
    const [area, setArea] = useState('');
    const [style, setStyle] = useState('');
    const [budget, setBudget] = useState('');
    const [requirements, setRequirements] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const spaceTypes = [
        'Living Room',
        'Bedroom',
        'Kitchen',
        'Bathroom',
        'Home Office',
        'Dining Room',
        'Commercial Space',
        'Hotel Room',
        'Restaurant',
        'Retail Store'
    ];

    const styles = [
        'Modern',
        'Contemporary',
        'Minimalist',
        'Industrial',
        'Scandinavian',
        'Traditional',
        'Bohemian',
        'Coastal',
        'Mid-century Modern',
        'Transitional'
    ];

    const generate = async () => {
        if (!spaceType || !area || !style) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As an interior designer, create design concepts for ${spaceType}:
Space Type: ${spaceType}
Area: ${area} sq.ft.
Style: ${style}
Budget: ${budget || 'Medium range'}
Requirements: ${requirements || 'Standard design'}

Please provide:
1. Color palette recommendations
2. Furniture selection and layout
3. Lighting design
4. Material and finish suggestions
5. Decorative elements
6. Space optimization ideas
7. Storage solutions
8. Mood board description
9. Budget allocation breakdown
10. Implementation timeline`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating interior design. Please try again.');
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
        a.download = `interior-design-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Interior Design</h2>
                <p className="text-gray-400">Interior design concepts and planning</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Space Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={spaceType}
                        onChange={(e) => setSpaceType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="">Select space type...</option>
                        {spaceTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Area (sq.ft.) <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="number"
                        placeholder="e.g., 300"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Style <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="">Select style...</option>
                        {styles.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Budget (₹)
                    </label>
                    <input
                        type="number"
                        placeholder="e.g., 500000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Specific Requirements
                    </label>
                    <textarea
                        placeholder="Enter specific requirements: color preferences, furniture needs, special features, etc."
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        rows={4}
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
                        <span>Generating Design...</span>
                    </>
                ) : (
                    <>
                        <Sofa size={20} />
                        <span>Generate Interior Design (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Interior Design Concept</h3>
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
                    <strong>Tip:</strong> Consider natural lighting and traffic flow when planning interior layouts.
                </p>
            </div>
        </div>
    );
}

export default InteriorDesignTask;