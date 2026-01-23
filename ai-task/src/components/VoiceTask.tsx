// TASK 3: Voice Transcription
// =======================================================================

import { useState } from 'react';
import { Mic, Play, StopCircle, Loader2, Copy, Check, RotateCcw } from 'lucide-react';
import { callAI } from '../lib/ai';
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
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Header */}
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Mic className="text-green-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Voice Transcription</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Record and transcribe audio</p>
                        </div>
                    </div>

                    {/* Recording Interface */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 sm:p-12 text-center bg-gradient-to-br from-gray-50 to-green-50">

                        {/* Initial State */}
                        {!isRecording && !hasRecording && (
                            <div className="space-y-6">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <Mic size={36} className="text-green-600 sm:w-12 sm:h-12" />
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                        Ready to Record
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 mb-6">
                                        Click the button below to start recording your voice
                                    </p>
                                </div>
                                <button
                                    onClick={startRecording}
                                    className="px-6 sm:px-8 py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2 mx-auto text-sm sm:text-base"
                                >
                                    <Play size={20} />
                                    <span>Start Recording</span>
                                </button>
                            </div>
                        )}

                        {/* Recording State */}
                        {isRecording && (
                            <div className="space-y-6">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-600 rounded-full" />
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-red-600 mb-2">
                                        Recording...
                                    </h3>
                                    <p className="text-2xl sm:text-3xl font-mono font-bold text-gray-900 mb-2">
                                        {formatTime(recordingTime)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Maximum duration: 30 seconds
                                    </p>
                                </div>
                                <button
                                    onClick={stopRecording}
                                    className="px-6 sm:px-8 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2 mx-auto text-sm sm:text-base"
                                >
                                    <StopCircle size={20} />
                                    <span>Stop Recording</span>
                                </button>
                            </div>
                        )}

                        {/* Recording Complete State */}
                        {hasRecording && !isRecording && (
                            <div className="space-y-6">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                    <Mic size={36} className="text-blue-600 sm:w-12 sm:h-12" />
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                        Recording Complete
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 mb-2">
                                        Duration: {formatTime(recordingTime)}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        Ready to transcribe
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <button
                                        onClick={reset}
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors flex items-center gap-2 justify-center text-sm sm:text-base"
                                    >
                                        <RotateCcw size={18} />
                                        <span>Record Again</span>
                                    </button>
                                    <button
                                        onClick={transcribe}
                                        disabled={loading}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2 justify-center text-sm sm:text-base"
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
                </div>

                {/* Result Section */}
                {result && (
                    <div className="border-t bg-gray-50">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Transcription</h3>
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 border-2 border-gray-300 text-gray-700 font-medium rounded-lg transition-colors text-sm"
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

                            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6 max-h-96 overflow-y-auto">
                                <pre className="text-xs sm:text-sm whitespace-pre-wrap font-mono text-gray-800">
                                    {result}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Info Card */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                    <strong>Note:</strong> This is a demo interface. In production, actual audio recording
                    and transcription APIs would be integrated.
                </p>
            </div>
        </div>
    );
}

export default VoiceTask;