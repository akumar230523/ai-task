import { useState } from 'react';
import { Palette, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

interface GraphicDesignTaskProps {
    provider: AIProvider;
}

const GraphicDesignTask = ({ provider }: GraphicDesignTaskProps) => {
    const [designType, setDesignType] = useState('');
    const [purpose, setPurpose] = useState('');
    const [brandColors, setBrandColors] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [requirements, setRequirements] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const designTypes = [
        'Logo Design',
        'Business Card',
        'Flyer/Brochure',
        'Social Media Post',
        'Website Banner',
        'Presentation Template',
        'Product Packaging',
        'Book Cover',
        'Infographic',
        'Advertisement'
    ];

    const generate = async () => {
        if (!designType || !purpose) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As a graphic designer, create specifications for ${designType}:
Design Type: ${designType}
Purpose: ${purpose}
Brand Colors: ${brandColors || 'Not specified'}
Target Audience: ${targetAudience || 'General'}
Specific Requirements: ${requirements || 'None'}

Please provide:
1. Design concept and theme
2. Color palette recommendations
3. Typography suggestions
4. Layout and composition guidelines
5. Imagery and iconography recommendations
6. Design principles applied
7. File format recommendations
8. Print/digital specifications
9. Design variations (if applicable)

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
        a.download = `graphic-design-${designType.toLowerCase()}-${Date.now()}.txt`;
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
                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                            <Palette className="text-pink-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Graphic Design</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Visual design concepts and specifications</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Design Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={designType}
                                onChange={(e) => setDesignType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none transition-colors bg-white text-sm sm:text-base"
                            >
                                <option value="">Select design type...</option>
                                {designTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Purpose <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Brand promotion, Event announcement, Product launch"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Brand Colors
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., #FF0000 (Red), #0000FF (Blue)"
                                value={brandColors}
                                onChange={(e) => setBrandColors(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Audience
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Young professionals, Students, Parents"
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Specific Requirements
                            </label>
                            <textarea
                                placeholder="Any specific elements to include, style preferences, dimensions, etc."
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none resize-none transition-colors text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Generating Design...</span>
                            </>
                        ) : (
                            <>
                                <Palette size={20} />
                                <span>Generate Design Specs (₹99)</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Graphic Design Specifications</h3>
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
                                        className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            <div className="mt-6 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                <p className="text-sm text-pink-800">
                    <strong>Tip:</strong> Consider both digital and print requirements. Ensure designs are scalable and work in different contexts.
                </p>
            </div>
        </div>
    );
}

export default GraphicDesignTask;