import { useState } from 'react';
import { FileUser, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
import type { AIProvider } from '../types/ai';

interface ResumeTaskProps {
    provider: AIProvider;
}

const ResumeTask = ({ provider }: ResumeTaskProps) => {
    const [fullName, setFullName] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [experience, setExperience] = useState('');
    const [education, setEducation] = useState('');
    const [skills, setSkills] = useState('');
    const [achievements, setAchievements] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generate = async () => {
        if (!fullName || !targetRole || !experience) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `Create a professional, ATS-optimized resume for:
Personal Information:
- Name: ${fullName}
- Target Role: ${targetRole}

Work Experience:
${experience}

Education:
${education || 'Not provided'}

Skills:
${skills || 'Not provided'}

Achievements:
${achievements || 'Not provided'}

Please create a comprehensive resume with:
1. Professional summary tailored to the target role
2. Work experience with bullet points highlighting achievements and impact
3. Education section
4. Skills section organized by category
5. Additional sections (certifications, achievements, etc.) if relevant
6. ATS-friendly formatting
7. Action verbs and quantifiable results
8. Keywords relevant to the target role

Format the resume in a clean, professional structure that can be easily customized.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating resume. Please try again.');
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

    const downloadResume = () => {
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume-${fullName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Resume Builder</h2>
                <p className="text-gray-400">Create professional, ATS-optimized resumes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Target Job Role <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Senior Software Engineer, Marketing Manager"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Work Experience <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        placeholder="List your work history with company names, positions, dates, and key responsibilities/achievements."
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Education
                    </label>
                    <textarea
                        placeholder="List your educational qualifications"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Skills
                    </label>
                    <textarea
                        placeholder="List your technical and soft skills"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Achievements & Certifications
                    </label>
                    <textarea
                        placeholder="Notable achievements, awards, certifications, publications, etc."
                        value={achievements}
                        onChange={(e) => setAchievements(e.target.value)}
                        rows={4}
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
                        <span>Generating Resume...</span>
                    </>
                ) : (
                    <>
                        <FileUser size={20} />
                        <span>Generate Resume (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Professional Resume</h3>
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
                                onClick={downloadResume}
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
                    Review and customize the generated resume to match your personal style and ensure all information is accurate and up-to-date.
                </p>
            </div>
        </div>
    );
}

export default ResumeTask;