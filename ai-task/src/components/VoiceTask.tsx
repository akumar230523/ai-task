// TASK 3: Voice Transcription
// =======================================================================

import React, { useState } from 'react';
import { Mic, Play } from 'lucide-react';

import { callAI } from '../lib/ai';
import type { AIProvider } from '../types/ai';

const VoiceTask: React.FC<{ provider: AIProvider }> = ({ provider }) => {

    const [isRecording, setIsRecording] = useState(false);
    const [hasRecording, setHasRecording] = useState(false);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const startRecording = () => {
        setIsRecording(true);
        setTimeout(() => {
            setIsRecording(false);
            setHasRecording(true);
        }, 3000);
    };

    const transcribe = async () => {
        setLoading(true);
        const response = await callAI('Transcribe this audio recording', provider);
        setResult(response);
        setLoading(false);
    };

    const reset = () => {
        setHasRecording(false);
        setResult('');
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Mic className="text-green-600" size={24} />
                    </div>
                    <h2 className="text-xl font-bold">Voice Transcription</h2>
                </div>

                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    {!isRecording && !hasRecording && (
                        <div>
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mic size={32} className="text-green-600" />
                            </div>
                            <p className="text-gray-600 mb-4">Click to start recording</p>
                            <button
                                onClick={startRecording}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <Play className="inline mr-2" size={18} />Start Recording
                            </button>
                        </div>
                    )}

                    {isRecording && (
                        <div>
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                            </div>
                            <p className="text-red-600 font-medium">Recording...</p>
                        </div>
                    )}

                    {hasRecording && !isRecording && (
                        <div>
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mic size={32} className="text-blue-600" />
                            </div>
                            <p className="text-gray-600 mb-4">Recording complete!</p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={reset}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                >
                                    Record Again
                                </button>
                                <button
                                    onClick={transcribe}
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    {loading ? 'Transcribing...' : 'Transcribe (₹99)'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {result && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-bold mb-2">Transcription</h3>
                        <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                    </div>
                )}
            </div>
        </div>
    );

};

export default VoiceTask;
