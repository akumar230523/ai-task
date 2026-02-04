import { useState } from 'react';
import { Plane, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
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
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Immigration & Visa Assistance</h2>
                <p className="text-gray-400">Immigration documentation and guidance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Destination Country <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={destinationCountry}
                        onChange={(e) => setDestinationCountry(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select country...</option>
                        {countries.map(country => (
                            <option key={country} value={country} className="bg-gray-800">{country}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Visa Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={visaType}
                        onChange={(e) => setVisaType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select visa type...</option>
                        {visaTypes.map(type => (
                            <option key={type} value={type} className="bg-gray-800">{type}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Purpose <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        placeholder="Explain the purpose of your travel/stay: study, work, tourism, etc."
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Immigration Status
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., First-time applicant, Renewal, Change of status"
                        value={currentStatus}
                        onChange={(e) => setCurrentStatus(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Specific Requirements/Details
                    </label>
                    <textarea
                        placeholder="Any specific details: previous rejections, special circumstances, etc."
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
                        <span>Generating Guidance...</span>
                    </>
                ) : (
                    <>
                        <Plane size={20} />
                        <span>Generate Immigration Guide (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Immigration Guidance</h3>
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
                    <strong>⚠️ Important:</strong> Immigration laws change frequently. Always verify information with official government sources and consult with licensed immigration attorneys.
                </p>
            </div>
        </div>
    );
}

export default ImmigrationTask;