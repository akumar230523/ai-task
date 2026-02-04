import { useState } from 'react';
import { ClipboardList, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
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
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Project Management</h2>
                <p className="text-gray-400">Project planning and tracking</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Project Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="text-gray-500">Select project type...</option>
                        {projectTypes.map(type => (
                            <option key={type} value={type} className="bg-gray-800">{type}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Project Scope <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        placeholder="Briefly describe what the project aims to achieve"
                        value={projectScope}
                        onChange={(e) => setProjectScope(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Timeline <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., 3 months, 6 weeks, 1 year"
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Budget (₹)
                    </label>
                    <input
                        type="number"
                        placeholder="e.g., 1000000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Team Size
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., 5 members, Cross-functional team"
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Specific Requirements
                    </label>
                    <textarea
                        placeholder="Any specific constraints, methodologies (Agile/Waterfall), tools, etc."
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
                        <span>Generating Project Plan...</span>
                    </>
                ) : (
                    <>
                        <ClipboardList size={20} />
                        <span>Generate Project Plan (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Project Management Plan</h3>
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
                                onClick={downloadPlan}
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
                    <strong>Tip:</strong> Regularly monitor project progress and adjust plans as needed. Effective communication is key to project success.
                </p>
            </div>
        </div>
    );
}

export default ProjectManagementTask;