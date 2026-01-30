import { useState } from 'react';
import { Scale, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

interface LegalTaskProps {
    provider: AIProvider;
}

const LegalTask = ({ provider }: LegalTaskProps) => {
    const [docType, setDocType] = useState('');
    const [details, setDetails] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const documentTypes = [
        { value: 'NDA', label: 'Non-Disclosure Agreement (NDA)' },
        { value: 'Service Agreement', label: 'Service Agreement' },
        { value: 'Employment Contract', label: 'Employment Contract' },
        { value: 'Partnership Agreement', label: 'Partnership Agreement' },
        { value: 'Rental Agreement', label: 'Rental/Lease Agreement' },
        { value: 'Terms of Service', label: 'Terms of Service' },
        { value: 'Privacy Policy', label: 'Privacy Policy' },
    ];

    const generate = async () => {
        if (!docType || !details) {
            alert('Please select document type and provide details');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `Draft a professional ${docType} with the following specifications: ${details}
Please create a comprehensive legal document with:
1. Proper legal structure and sections
2. Clear terms and conditions
3. Standard clauses relevant to this document type
4. Professional legal language
5. Date and signature sections

Note: This is a template and should be reviewed by a legal professional.`;
            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating document. Please try again.');
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
        a.download = `${docType.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`;
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
                            <Scale className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Legal Document Drafting</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Select type and provide requirements</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Document Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={docType}
                                onChange={(e) => setDocType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base bg-white"
                            >
                                <option value="">Select a document type...</option>
                                {documentTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Document Requirements <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder={`Enter key terms, clauses, and requirements. For example:\n\n- Party 1: Company Name, Address\n- Party 2: Individual Name, Address\n- Term: 2 years\n- Confidential information includes: trade secrets, customer data\n- Governing law: [State/Country]`}
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                rows={10}
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
                                <span>Drafting Document...</span>
                            </>
                        ) : (
                            <>
                                <Scale size={20} />
                                <span>Generate Document (₹99)</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Legal Document</h3>
                                    <p className="text-xs text-gray-500 mt-1">Review with a legal professional</p>
                                </div>
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

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                    <strong>⚠️ Legal Disclaimer:</strong> This AI-generated document is a template only.
                    Always consult with a qualified legal professional before using any legal document.
                </p>
            </div>
        </div>
    );
}

export default LegalTask;