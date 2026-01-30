// File: src/components/tasks/HealthcareTask.tsx
// =======================================================================

import { useState } from 'react';
import { Heart, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
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
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Heart className="text-red-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Healthcare Administration</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Healthcare documentation and administration</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Document Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors bg-white text-sm sm:text-base"
                            >
                                <option value="">Select document type...</option>
                                {documentTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Patient Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={patientType}
                                onChange={(e) => setPatientType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors bg-white text-sm sm:text-base"
                            >
                                <option value="">Select patient type...</option>
                                {patientTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Medical Condition <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Diabetes, Hypertension, Post-operative care"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Specific Requirements
                            </label>
                            <textarea
                                placeholder="Any specific medical requirements, treatments, or special considerations"
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none resize-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Compliance Requirements
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., HIPAA, GDPR, Local healthcare regulations"
                                value={compliance}
                                onChange={(e) => setCompliance(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
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
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Healthcare Document</h3>
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
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                    <strong>⚠️ Medical Disclaimer:</strong> This is for administrative purposes only. Always consult with qualified healthcare professionals for medical advice and treatment.
                </p>
            </div>
        </div>
    );
}

export default HealthcareTask;