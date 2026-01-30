// File: src/components/tasks/HRTask.tsx
// =======================================================================

import { useState } from 'react';
import { Users, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

interface HRTaskProps {
    provider: AIProvider;
}

const HRTask = ({ provider }: HRTaskProps) => {
    const [hrDocumentType, setHrDocumentType] = useState('');
    const [position, setPosition] = useState('');
    const [companyType, setCompanyType] = useState('');
    const [requirements, setRequirements] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const hrDocumentTypes = [
        'Job Description',
        'Employment Offer Letter',
        'Performance Review Form',
        'Employee Handbook Section',
        'Interview Questions',
        'Onboarding Checklist',
        'Exit Interview Form',
        'Policy Document',
        'Training Manual',
        'Recruitment Strategy'
    ];

    const generate = async () => {
        if (!hrDocumentType || !position || !companyType) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As an HR professional, create ${hrDocumentType}:
Document Type: ${hrDocumentType}
Position: ${position}
Company Type: ${companyType}
Specific Requirements: ${requirements || 'Standard format'}

Please provide:
1. Professional and legally compliant content
2. Clear structure and formatting
3. Industry best practices
4. Compliance with labor laws
5. Company culture alignment
6. Measurable objectives (if applicable)
7. Actionable items
8. Review and approval process
9. Implementation guidelines

Format professionally with clear sections.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating HR document. Please try again.');
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

    const downloadDocument = () => {
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hr-${hrDocumentType.toLowerCase()}-${Date.now()}.txt`;
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
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">HR & Recruitment</h2>
                            <p className="text-xs sm:text-sm text-gray-500">HR documentation and recruitment materials</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Document Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={hrDocumentType}
                                onChange={(e) => setHrDocumentType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors bg-white text-sm sm:text-base"
                            >
                                <option value="">Select document type...</option>
                                {hrDocumentTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Position/Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Software Engineer, Marketing Manager, Sales Executive"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Type <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Tech Startup, Manufacturing, Consulting Firm"
                                value={companyType}
                                onChange={(e) => setCompanyType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Specific Requirements
                            </label>
                            <textarea
                                placeholder="Any specific details: salary range, qualifications, company policies, etc."
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none transition-colors text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Generating Document...</span>
                            </>
                        ) : (
                            <>
                                <Users size={20} />
                                <span>Generate HR Document (₹99)</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">HR Document</h3>
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
                                        onClick={downloadDocument}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800">
                    <strong>Note:</strong> Always consult with legal counsel for compliance with local labor laws and regulations.
                </p>
            </div>
        </div>
    );
}

export default HRTask;