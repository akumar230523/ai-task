import { useState } from 'react';
import { Building2, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

interface ArchitectureTaskProps {
    provider: AIProvider;
}

const ArchitectureTask = ({ provider }: ArchitectureTaskProps) => {
    const [projectType, setProjectType] = useState('');
    const [area, setArea] = useState('');
    const [budget, setBudget] = useState('');
    const [requirements, setRequirements] = useState('');
    const [location, setLocation] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const projectTypes = [
        'Residential House',
        'Commercial Building',
        'Office Space',
        'Apartment Complex',
        'Hospital/Healthcare',
        'Educational Institution',
        'Hotel/Resort',
        'Industrial Building'
    ];

    const handleGenerate = async () => {
        if (!projectType || !area || !budget) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As a professional architect, design a ${projectType} with these specifications: 
                Project Type: ${projectType} 
                Area: ${area} sq.ft
                Budget: ₹${budget}
                Location: ${location || 'Not specified'}
                Requirements: ${requirements}
                Please provide:
                    - Architectural concept and design approach
                    - Space planning and layout
                    - Material recommendations
                    - Structural considerations
                    - Compliance with building codes
                    - Sustainability features
                    - Estimated timeline
                    - Cost breakdown
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
        link.download = `architecture-design-${Date.now()}.txt`;
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
                        <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
                            <Building2 className="text-stone-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Architecture Design</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Architectural planning and design</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={projectType}
                                onChange={(e) => setProjectType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-stone-500 focus:outline-none transition-colors bg-white"
                            >
                                <option value="">Select project type...</option>
                                {projectTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Area (sq.ft) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 2000"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-stone-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 5000000"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-stone-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Urban area, Suburban, Coastal"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-stone-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Requirements & Specifications
                            </label>
                            <textarea
                                placeholder="Describe your requirements: number of rooms, floors, special features, style preferences, etc."
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-stone-500 focus:outline-none resize-none transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-stone-600 hover:bg-stone-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Generating Design...</span>
                            </>
                        ) : (
                            <>
                                <Building2 size={20} />
                                <span>Generate Design (₹99)</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Architectural Design</h3>
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
                                        className="flex items-center gap-2 px-4 py-2 bg-stone-600 hover:bg-stone-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            <div className="mt-6 p-4 bg-stone-50 border border-stone-200 rounded-lg">
                <p className="text-sm text-stone-800">
                    <strong>Note:</strong> This is an AI-generated design. Always consult with a professional architect for official projects.
                </p>
            </div>
        </div>
    );
}

export default ArchitectureTask;