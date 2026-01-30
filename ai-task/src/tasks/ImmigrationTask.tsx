import { useState } from 'react';
import { Plane, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

interface ImmigrationTaskProps {
    provider: AIProvider;
}

const ImmigrationTask = ({ provider }: ImmigrationTaskProps) => {
    const [destinationCountry, setDestinationCountry] = useState('');
    const [visaType, setVisaType] = useState('');
    const [purpose, setPurpose] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');
    const [requirements, setRequirements] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const visaTypes = [
        'Tourist Visa',
        'Student Visa',
        'Work Visa',
        'Business Visa',
        'Permanent Residency',
        'Family Sponsorship',
        'Investor Visa',
        'Refugee/Asylum'
    ];

    const countries = [
        'United States',
        'Canada',
        'United Kingdom',
        'Australia',
        'Germany',
        'France',
        'Japan',
        'Singapore',
        'UAE',
        'New Zealand'
    ];

    const generate = async () => {
        if (!destinationCountry || !visaType || !purpose) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As an immigration consultant, provide guidance for ${visaType} to ${destinationCountry}:
Destination Country: ${destinationCountry}
Visa Type: ${visaType}
Purpose: ${purpose}
Current Status: ${currentStatus || 'New application'}
Specific Requirements: ${requirements || 'Standard requirements'}

Please provide:
1. Eligibility criteria and requirements
2. Document checklist
3. Application process and timeline
4. Fees and costs
5. Interview preparation (if applicable)
6. Common reasons for rejection and how to avoid them
7. Post-approval requirements
8. Legal considerations
9. Alternative pathways (if applicable)
10. Contact information for official resources

Format professionally with clear sections.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating immigration guidance. Please try again.');
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
        a.download = `immigration-${visaType.toLowerCase()}-${Date.now()}.txt`;
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
                        <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                            <Plane className="text-sky-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Immigration & Visa Assistance</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Immigration documentation and guidance</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Destination Country <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={destinationCountry}
                                onChange={(e) => setDestinationCountry(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors bg-white text-sm sm:text-base"
                            >
                                <option value="">Select country...</option>
                                {countries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Visa Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={visaType}
                                onChange={(e) => setVisaType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors bg-white text-sm sm:text-base"
                            >
                                <option value="">Select visa type...</option>
                                {visaTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Purpose <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Explain the purpose of your travel/stay: study, work, tourism, etc."
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none resize-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Immigration Status
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., First-time applicant, Renewal, Change of status"
                                value={currentStatus}
                                onChange={(e) => setCurrentStatus(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Specific Requirements/Details
                            </label>
                            <textarea
                                placeholder="Any specific details: previous rejections, special circumstances, etc."
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none resize-none transition-colors text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Generating Guidance...</span>
                            </>
                        ) : (
                            <>
                                <Plane size={20} />
                                <span>Generate Immigration Guide (₹99)</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Immigration Guidance</h3>
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
                                        onClick={downloadGuidance}
                                        className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            <div className="mt-6 p-4 bg-sky-50 border border-sky-200 rounded-lg">
                <p className="text-sm text-sky-800">
                    <strong>⚠️ Important:</strong> Immigration laws change frequently. Always verify information with official government sources and consult with licensed immigration attorneys.
                </p>
            </div>
        </div>
    );
}

export default ImmigrationTask;