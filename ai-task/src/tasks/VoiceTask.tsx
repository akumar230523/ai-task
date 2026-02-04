import { useState } from 'react';
import { Mic, Play, StopCircle, Loader2, Copy, Check, RotateCcw } from 'lucide-react';
import { callAI } from '../lib/ai';
import { THEME } from '../lib/constants';
import type { AIProvider } from '../types/ai';

interface VoiceTaskProps {
    provider: AIProvider;
}

const VoiceTask = ({ provider }: VoiceTaskProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const [hasRecording, setHasRecording] = useState(false);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const startRecording = () => {
        setIsRecording(true);
        setRecordingTime(0);

        // Simulate recording timer
        const interval = setInterval(() => {
            setRecordingTime(prev => {
                if (prev >= 30) {
                    clearInterval(interval);
                    stopRecording();
                    return prev;
                }
                return prev + 1;
            });
        }, 1000);

        // Auto-stop after 30 seconds for demo
        setTimeout(() => {
            clearInterval(interval);
            stopRecording();
        }, 30000);
    };

    const stopRecording = () => {
        setIsRecording(false);
        setHasRecording(true);
    };

    const transcribe = async () => {
        setLoading(true);
        setResult('');

        try {
            const prompt = `Transcribe and summarize the following audio recording: Duration: ${recordingTime} seconds 
                Content: [Voice recording captured] Please provide:
                1. Full transcription
                2. Summary of key points
                3. Any action items or important notes`;
            const response = await callAI(prompt, provider);
            setResult(response);
        } catch (error) {
            alert('Error transcribing audio. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setHasRecording(false);
        setResult('');
        setRecordingTime(0);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Voice Transcription</h2>
                <p className="text-gray-400">Record and transcribe audio with AI</p>
            </div>

            {/* Recording Interface */}
            <div className="border-2 border-dashed border-gray-700 rounded-2xl p-8 mb-8 text-center bg-gray-900/50">
                {!isRecording && !hasRecording && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${THEME.primary}20` }}
                        >
                            <Mic size={36} style={{ color: THEME.primary }} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                Ready to Record
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Click the button below to start recording your voice
                            </p>
                        </div>
                        <button
                            onClick={startRecording}
                            className="px-6 py-3 text-white font-medium rounded-lg transition-all duration-200 hover:opacity-90 flex items-center gap-2 mx-auto"
                            style={{ backgroundColor: THEME.primary }}
                        >
                            <Play size={20} />
                            <span>Start Recording</span>
                        </button>
                    </div>
                )}

                {isRecording && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center animate-pulse"
                            style={{ backgroundColor: '#ef444420' }}
                        >
                            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-400 mb-2">
                                Recording...
                            </h3>
                            <p className="text-2xl font-mono font-bold text-white mb-2">
                                {formatTime(recordingTime)}
                            </p>
                            <p className="text-sm text-gray-500">
                                Maximum duration: 30 seconds
                            </p>
                        </div>
                        <button
                            onClick={stopRecording}
                            className="px-6 py-3 text-white font-medium rounded-lg transition-all duration-200 hover:opacity-90 flex items-center gap-2 mx-auto"
                            style={{ backgroundColor: '#ef4444' }}
                        >
                            <StopCircle size={20} />
                            <span>Stop Recording</span>
                        </button>
                    </div>
                )}

                {hasRecording && !isRecording && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${THEME.primary}20` }}
                        >
                            <Mic size={36} style={{ color: THEME.primary }} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                Recording Complete
                            </h3>
                            <p className="text-gray-400 mb-2">
                                Duration: {formatTime(recordingTime)}
                            </p>
                            <p className="text-sm text-gray-500">
                                Ready to transcribe
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={reset}
                                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors flex items-center gap-2 justify-center"
                            >
                                <RotateCcw size={18} />
                                <span>Record Again</span>
                            </button>
                            <button
                                onClick={transcribe}
                                disabled={loading}
                                className="px-6 py-3 text-white font-medium rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                                style={{ backgroundColor: THEME.primary }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>Transcribing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Mic size={18} />
                                        <span>Transcribe (₹99)</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {result && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Transcription</h3>
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
                                    <span>Copy Text</span>
                                </>
                            )}
                        </button>
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
                    <strong>Note:</strong> This is a demo interface. In production, actual audio recording
                    and transcription APIs would be integrated.
                </p>
            </div>
        </div>
    );
}

export default VoiceTask;