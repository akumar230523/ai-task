import { useState } from 'react';
import { BarChart3, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
import type { AIProvider } from '../types/ai';

interface DataAnalysisTaskProps {
    provider: AIProvider;
}

const DataAnalysisTask = ({ provider }: DataAnalysisTaskProps) => {
    const [dataType, setDataType] = useState('');
    const [analysisGoal, setAnalysisGoal] = useState('');
    const [dataDescription, setDataDescription] = useState('');
    const [specificQuestions, setSpecificQuestions] = useState('');
    const [tools, setTools] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const dataTypes = [
        'Sales Data',
        'Customer Data',
        'Financial Data',
        'Marketing Analytics',
        'Operational Data',
        'Survey Results',
        'Web Analytics',
        'Social Media Metrics',
        'IoT Sensor Data',
        'Healthcare Data'
    ];

    const handleGenerate = async () => {
        if (!dataType || !analysisGoal) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As a data analyst, provide analysis guidance for ${dataType}: 
                Data Type: ${dataType} 
                Analysis Goal: ${analysisGoal}
                Data Description: ${dataDescription || 'Not provided'}
                Specific Questions: ${specificQuestions || 'None'}
                Preferred Tools: ${tools || 'Any'}
                Please provide:
                    - Recommended analysis approach and methodology
                    - Key metrics to calculate
                    - Visualization recommendations
                    - Statistical techniques to apply
                    - Potential insights to look for
                    - Data cleaning and preprocessing steps
                    - Model suggestions (if applicable)
                    - Interpretation guidelines
                    - Reporting best practices
                Format professionally with clear sections.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating analysis plan. Please try again.');
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
        link.download = `data-analysis-plan-${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Data Analysis</h2>
                <p className="text-gray-400">Data insights and visualization guidance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Data Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={dataType}
                        onChange={(e) => setDataType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select data type...</option>
                        {dataTypes.map(type => (
                            <option key={type} value={type} className="bg-gray-800">{type}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Analysis Goal <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Identify sales trends, Customer segmentation, Predict churn"
                        value={analysisGoal}
                        onChange={(e) => setAnalysisGoal(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Data Description
                    </label>
                    <textarea
                        placeholder="Describe your data: number of records, columns, data types, etc."
                        value={dataDescription}
                        onChange={(e) => setDataDescription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Specific Questions
                    </label>
                    <textarea
                        placeholder="What specific questions do you want answered through analysis?"
                        value={specificQuestions}
                        onChange={(e) => setSpecificQuestions(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Preferred Tools/Languages
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Python (pandas, matplotlib), R, Tableau, Excel, Power BI"
                        value={tools}
                        onChange={(e) => setTools(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>
            </div>

            <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3.5 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: THEME.primary }}
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Generating Analysis Plan...</span>
                    </>
                ) : (
                    <>
                        <BarChart3 size={20} />
                        <span>Generate Analysis Plan (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Data Analysis Plan</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
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
                                onClick={handleDownload}
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
                    <strong>Tip:</strong> Ensure data quality and consistency before analysis. Consider statistical significance when interpreting results.
                </p>
            </div>
        </div>
    );
}

export default DataAnalysisTask;