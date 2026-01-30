import { useState } from 'react';
import { Sofa, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

interface InteriorDesignTaskProps {
    provider: AIProvider;
}

const InteriorDesignTask = ({ provider }: InteriorDesignTaskProps) => {
    const [roomType, setRoomType] = useState('');
    const [style, setStyle] = useState('');
    const [budget, setBudget] = useState('');
    const [roomSize, setRoomSize] = useState('');
    const [requirements, setRequirements] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const roomTypes = [
        'Living Room',
        'Bedroom',
        'Kitchen',
        'Bathroom',
        'Home Office',
        'Dining Room',
        'Kids Room',
        'Studio Apartment'
    ];

    const styles = [
        'Modern',
        'Minimalist',
        'Contemporary',
        'Traditional',
        'Industrial',
        'Scandinavian',
        'Bohemian',
        'Coastal',
        'Mid-Century Modern'
    ];

    const generate = async () => {
        if (!roomType || !style || !budget) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As an interior designer, create a ${style} design for a ${roomType}:
Room Type: ${roomType}
Style: ${style}
Budget: ₹${budget}
Room Size: ${roomSize || 'Not specified'}
Requirements: ${requirements || 'None'}

Please provide:
1. Color scheme and palette
2. Furniture selection and placement
3. Lighting design
4. Material and texture recommendations
5. Decorative elements
6. Space optimization tips
7. Budget breakdown
8. Shopping list with approximate costs

Format professionally with clear sections.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating design. Please try again.');
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
        a.download = `interior-design-${roomType.toLowerCase()}-${Date.now()}.txt`;
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
                        <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                            <Sofa className="text-rose-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Interior Design</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Create beautiful interior spaces</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Room Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={roomType}
                                onChange={(e) => setRoomType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none transition-colors bg-white text-sm sm:text-base"
                            >
                                <option value="">Select room type...</option>
                                {roomTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Style <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none transition-colors bg-white text-sm sm:text-base"
                            >
                                <option value="">Select style...</option>
                                {styles.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 500000"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Room Size (sq.ft)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., 12x15 ft or 180 sq.ft"
                                value={roomSize}
                                onChange={(e) => setRoomSize(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Specific Requirements
                            </label>
                            <textarea
                                placeholder="Any specific needs: existing furniture to keep, color preferences, functionality requirements, etc."
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                rows={5}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none resize-none transition-colors text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Generating Design...</span>
                            </>
                        ) : (
                            <>
                                <Sofa size={20} />
                                <span>Generate Design (₹99)</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Interior Design Plan</h3>
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
                                        className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-lg">
                <p className="text-sm text-rose-800">
                    <strong>Tip:</strong> Consider lighting conditions and room orientation when implementing the design.
                </p>
            </div>
        </div>
    );
}

export default InteriorDesignTask;