import { useState } from 'react';
import { Home, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
import type { AIProvider } from '../types/ai';

interface RealEstateTaskProps {
    provider: AIProvider;
}

const RealEstateTask = ({ provider }: RealEstateTaskProps) => {
    const [propertyType, setPropertyType] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [location, setLocation] = useState('');
    const [budget, setBudget] = useState('');
    const [requirements, setRequirements] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const propertyTypes = [
        'Residential Apartment',
        'Independent House',
        'Commercial Office',
        'Retail Space',
        'Industrial Property',
        'Agricultural Land',
        'Vacation Home',
        'Plot/Land'
    ];

    const transactionTypes = [
        'Purchase',
        'Rent/Lease',
        'Sale',
        'Investment Analysis',
        'Property Valuation',
        'Legal Documentation'
    ];

    const generate = async () => {
        if (!propertyType || !transactionType || !location) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As a real estate expert, provide guidance for ${transactionType} ${propertyType}:
Property Type: ${propertyType}
Transaction Type: ${transactionType}
Location: ${location}
Budget: ${budget || 'Not specified'}
Requirements: ${requirements || 'Standard'}

Please provide:
1. Market analysis for the area
2. Property valuation guidelines
3. Legal documentation requirements
4. Due diligence checklist
5. Negotiation strategies
6. Financing options and considerations
7. Tax implications
8. Risk assessment
9. Property management considerations
10. Exit strategy (if investment)

Format professionally with clear sections.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating real estate guidance. Please try again.');
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

    const downloadGuidance = () => {
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `real-estate-${transactionType.toLowerCase()}-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Real Estate Documentation</h2>
                <p className="text-gray-400">Real estate guidance and documentation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Property Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select property type...</option>
                        {propertyTypes.map(type => (
                            <option key={type} value={type} className="bg-gray-800">{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Transaction Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select transaction type...</option>
                        {transactionTypes.map(type => (
                            <option key={type} value={type} className="bg-gray-800">{type}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., City, Area, Neighborhood"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Budget (₹)
                    </label>
                    <input
                        type="number"
                        placeholder="e.g., 5000000"
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
                        placeholder="Any specific requirements: size, amenities, legal status, etc."
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
                        <span>Generating Guidance...</span>
                    </>
                ) : (
                    <>
                        <Home size={20} />
                        <span>Generate Real Estate Guide (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Real Estate Guidance</h3>
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
                                onClick={downloadGuidance}
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
                    <strong>Important:</strong> Always verify property documents with a legal expert and conduct physical inspections before transactions.
                </p>
            </div>
        </div>
    );
}

export default RealEstateTask;