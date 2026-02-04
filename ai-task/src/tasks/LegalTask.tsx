import { useState } from 'react';
import { Scale, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
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
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Legal Document Drafting</h2>
                <p className="text-gray-400">Select type and provide requirements</p>
            </div>

            <div className="space-y-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Document Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="">Select a document type...</option>
                        {documentTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Document Requirements <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        placeholder={`Enter key terms, clauses, and requirements. For example:\n\n- Party 1: Company Name, Address\n- Party 2: Individual Name, Address\n- Term: 2 years\n- Confidential information includes: trade secrets, customer data\n- Governing law: [State/Country]`}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        rows={8}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors font-mono text-sm"
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
                        <span>Drafting Document...</span>
                    </>
                ) : (
                    <>
                        <Scale size={20} />
                        <span>Generate Document (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">Legal Document</h3>
                            <p className="text-sm text-gray-500 mt-1">Review with a legal professional</p>
                        </div>
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
                                onClick={downloadDocument}
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
                    <strong>⚠️ Legal Disclaimer:</strong> This AI-generated document is a template only.
                    Always consult with a qualified legal professional before using any legal document.
                </p>
            </div>
        </div>
    );
}

export default LegalTask;