import { useState } from 'react';
import { ClipboardList, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

interface ProjectManagementTaskProps {
    provider: AIProvider;
}

const ProjectManagementTask = ({ provider }: ProjectManagementTaskProps) => {
    const [projectType, setProjectType] = useState('');
    const [projectScope, setProjectScope] = useState('');
    const [timeline, setTimeline] = useState('');
    const [budget, setBudget] = useState('');
    const [teamSize, setTeamSize] = useState('');
    const [requirements, setRequirements] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const projectTypes = [
        'Software Development',
        'Construction',
        'Marketing Campaign',
        'Product Launch',
        'Event Planning',
        'Research Project',
        'Business Process Improvement',
        'Infrastructure Development',
        'Training Program',
        'Consulting Engagement'
    ];

    const generate = async () => {
        if (!projectType || !projectScope || !timeline) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As a project manager, create a project plan for ${projectType}:
Project Type: ${projectType}
Project Scope: ${projectScope}
Timeline: ${timeline}
Budget: ${budget || 'To be determined'}
Team Size: ${teamSize || 'Standard project team'}
Specific Requirements: ${requirements || 'Standard project management'}

Please provide:
1. Project charter and objectives
2. Work breakdown structure (WBS)
3. Project schedule with milestones
4. Resource allocation plan
5. Risk management plan
6. Quality management plan
7. Communication plan
8. Budget breakdown
9. Stakeholder management
10. Success criteria and KPIs

Format professionally with clear sections.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating project plan. Please try again.');
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

    const downloadPlan = () => {
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project-plan-${projectType.toLowerCase()}-${Date.now()}.txt`;
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
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <ClipboardList className="text-orange-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Project Management</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Project planning and tracking</p>
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
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors bg-white text-sm sm:text-base"
                            >
                                <option value="">Select project type...</option>
                                {projectTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Scope <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Briefly describe what the project aims to achieve"
                                value={projectScope}
                                onChange={(e) => setProjectScope(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Timeline <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., 3 months, 6 weeks, 1 year"
                                value={timeline}
                                onChange={(e) => setTimeline(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget (₹)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 1000000"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Team Size
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., 5 members, Cross-functional team"
                                value={teamSize}
                                onChange={(e) => setTeamSize(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Specific Requirements
                            </label>
                            <textarea
                                placeholder="Any specific constraints, methodologies (Agile/Waterfall), tools, etc."
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none transition-colors text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="w-full mt-6 py-3 sm:py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Generating Project Plan...</span>
                            </>
                        ) : (
                            <>
                                <ClipboardList size={20} />
                                <span>Generate Project Plan (₹99)</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Project Management Plan</h3>
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
                                        onClick={downloadPlan}
                                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors text-sm"
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

            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                    <strong>Tip:</strong> Regularly monitor project progress and adjust plans as needed. Effective communication is key to project success.
                </p>
            </div>
        </div>
    );
}

export default ProjectManagementTask;