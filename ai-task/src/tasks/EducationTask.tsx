import { useState } from 'react';
import { GraduationCap, Loader2, Download, Copy, Check } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
import type { AIProvider } from '../types/ai';

interface EducationTaskProps {
    provider: AIProvider;
}

const EducationTask = ({ provider }: EducationTaskProps) => {
    const [subject, setSubject] = useState('');
    const [educationLevel, setEducationLevel] = useState('');
    const [topic, setTopic] = useState('');
    const [learningObjectives, setLearningObjectives] = useState('');
    const [duration, setDuration] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const subjects = [
        'Mathematics',
        'Science',
        'History',
        'Geography',
        'English Language',
        'Computer Science',
        'Business Studies',
        'Economics',
        'Psychology',
        'Art & Design'
    ];

    const educationLevels = [
        'Primary School',
        'Middle School',
        'High School',
        'Undergraduate',
        'Graduate',
        'Professional Development',
        'Adult Education'
    ];

    const handleGenerate = async () => {
        if (!subject || !educationLevel || !topic) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const prompt = `As an educational expert, create a learning plan for ${subject}: 
                Subject: ${subject} 
                Education Level: ${educationLevel}
                Topic: ${topic}
                Learning Objectives: ${learningObjectives || 'Understand core concepts'}
                Duration: ${duration || 'One week'}
                Please provide:
                    - Lesson plan structure
                    - Learning objectives and outcomes
                    - Teaching methodology and activities
                    - Resources and materials needed
                    - Assessment strategies
                    - Differentiation for different learners
                    - Homework and practice exercises
                    - Real-world applications
                    - Technology integration ideas
                    - Evaluation rubric
                Format professionally with clear sections.`;

            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error generating educational content. Please try again.');
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
        link.download = `education-plan-${subject.toLowerCase()}-${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Education & Tutoring</h2>
                <p className="text-gray-400">Educational content creation and lesson planning</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Subject <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="bg-gray-800">Select subject...</option>
                        {subjects.map(sub => (
                            <option key={sub} value={sub} className="bg-gray-800">{sub}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Education Level <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                        <option value="" className="bg-gray-800">Select level...</option>
                        {educationLevels.map(level => (
                            <option key={level} value={level} className="bg-gray-800">{level}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Topic <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Algebra Basics, World War II, Photosynthesis"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Learning Objectives
                    </label>
                    <textarea
                        placeholder="What should students learn? Be specific about knowledge and skills."
                        value={learningObjectives}
                        onChange={(e) => setLearningObjectives(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Duration
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., 2 hours, One week, 5 sessions"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
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
                        <span>Generating Lesson Plan...</span>
                    </>
                ) : (
                    <>
                        <GraduationCap size={20} />
                        <span>Generate Lesson Plan (₹99)</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Educational Lesson Plan</h3>
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
                    <strong>Tip:</strong> Adapt the lesson plan to your students' specific needs and learning styles for optimal results.
                </p>
            </div>
        </div>
    );
}

export default EducationTask;