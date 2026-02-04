import { useState } from 'react';
import { Heart, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
import type { AIProvider } from '../types/ai';

interface HealthcareTaskProps {
    provider: AIProvider;
}

const HealthcareTask = ({ provider }: HealthcareTaskProps) => {
    const [documentType, setDocumentType] = useState('');
    const [patientType, setPatientType] = useState('');
    const [condition, setCondition] = useState('');
    const [requirements, setRequirements] = useState('');
    const [compliance, setCompliance] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const documentTypes = [
        'Patient Consent Form',
        'Medical History Form',
        'Treatment Plan',
        'Discharge Summary',
        'Prescription Template',
        'Medical Report',
        'Insurance Claim Form',
        'HIPAA Compliance Document',
        'Clinical Trial Consent',
        'Healthcare Policy'
    ];

    const patientTypes = [
        'Adult',
        'Pediatric',
        'Geriatric',
        'Emergency',
        'Inpatient',
        'Outpatient',
        'Chronic Care',
        'Rehabilitation'
    ];

    const generate = async () => {
        if (!documentType || !patientType || !condition) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As a healthcare administrator, create ${documentType} for ${patientType} patient:
Document Type: ${documentType}
Patient Type: ${patientType}
Medical Condition: ${condition}
Specific Requirements: ${requirements || 'Standard medical documentation'}
Compliance Requirements: ${compliance || 'HIPAA and standard medical ethics'}

Please provide:
1. Professionally formatted document
2. Required medical terminology
3. Patient privacy protections
4. Legal compliance elements
5. Signature and consent sections
6. Date and verification requirements
7. Follow-up instructions (if applicable)
8. Emergency contact information
9. Insurance information section
10. Medication and treatment details

Format professionally with clear sections.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating healthcare document. Please try again.');
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
        a.download = `healthcare-${documentType.toLowerCase()}-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Healthcare Administration</h2>
                <p className="text-gray-400">Healthcare documentation and administration</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Document Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="bg-gray-800">Select document type...</option>
                        {documentTypes.map(type => (
                            <option key={type} value={type} className="bg-gray-800">{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Patient Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={patientType}
                        onChange={(e) => setPatientType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="bg-gray-800">Select patient type...</option>
                        {patientTypes.map(type => (
                            <option key={type} value={type} className="bg-gray-800">{type}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Medical Condition <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Diabetes, Hypertension, Post-operative care"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Specific Requirements
                    </label>
                    <textarea
                        placeholder="Any specific medical requirements, treatments, or special considerations"
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Compliance Requirements
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., HIPAA, GDPR, Local healthcare regulations"
                        value={compliance}
                        onChange={(e) => setCompliance(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
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
                        <span>Generating Document...</span>
                    </>
                ) : (
                    <>
                        <Heart size={20} />
                        <span>Generate Healthcare Document (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Healthcare Document</h3>
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
                    <strong>⚠️ Medical Disclaimer:</strong> This is for administrative purposes only. Always consult with qualified healthcare professionals for medical advice and treatment.
                </p>
            </div>
        </div>
    );
}

export default HealthcareTask;