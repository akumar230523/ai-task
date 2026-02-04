import { useEffect, useState } from 'react';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

interface KioskModeProps {
    isEnabled: boolean;
    onExit: () => void;
}

export default function KioskMode({ isEnabled, onExit }: KioskModeProps) {
    const [showExitPrompt, setShowExitPrompt] = useState(false);
    const [exitCode, setExitCode] = useState('');
    const [error, setError] = useState('');

    const disableRightClick = (e: MouseEvent) => {
        e.preventDefault();
    };

    const blockDevShortcuts = (e: KeyboardEvent) => {
        const blocked =
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
            (e.ctrlKey && e.key.toLowerCase() === 'u') ||
            (e.altKey && e.key === 'F4');

        if (blocked) {
            e.preventDefault();
            return false;
        }
    };

    const enterFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
        } catch (err) {
            console.warn('Fullscreen not supported:', err);
        }
    };

    const exitFullscreen = async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.warn('Error exiting fullscreen:', err);
        }
    };

    useEffect(() => {
        if (!isEnabled) return;

        document.addEventListener('contextmenu', disableRightClick);
        document.addEventListener('keydown', blockDevShortcuts);
        enterFullscreen();

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && isEnabled) {
                setTimeout(() => enterFullscreen(), 100);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('contextmenu', disableRightClick);
            document.removeEventListener('keydown', blockDevShortcuts);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            exitFullscreen();
        };
    }, [isEnabled]);

    const handleExitAttempt = () => {
        setShowExitPrompt(true);
        setExitCode('');
        setError('');
    };

    const confirmExit = () => {
        const correctPin = '1234';
        if (exitCode === correctPin) {
            onExit();
            setShowExitPrompt(false);
            setError('');
        } else {
            setError('Invalid PIN. Please try again.');
            setExitCode('');
        }
    };

    if (!isEnabled) return null;

    return (
        <>
            {/* Kiosk Top Bar */}
            <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white py-2 px-4 z-50 shadow-lg border-b border-gray-700">
                <div className="flex justify-between items-center max-w-6xl mx-auto">
                    <div className="flex items-center gap-3">
                        <Shield className="text-blue-400" size={18} />
                        <span className="font-bold text-sm">SECURE KIOSK MODE</span>
                        <span className="text-xs bg-blue-500/20 px-2 py-0.5 rounded animate-pulse border border-blue-500/30">
                            ACTIVE
                        </span>
                    </div>

                    <button
                        onClick={handleExitAttempt}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm font-medium transition-colors border border-gray-700 flex items-center gap-2"
                    >
                        <Lock size={14} />
                        <span>Exit Kiosk</span>
                    </button>
                </div>
            </div>

            {/* Exit Confirmation Modal */}
            {showExitPrompt && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                                    <Lock size={24} className="text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        Exit Kiosk Mode
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-0.5">
                                        Enter PIN to continue
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-4">
                            {/* Warning */}
                            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-yellow-300">
                                    Exiting kiosk mode will disable security features and allow full system access.
                                </p>
                            </div>

                            {/* PIN Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Admin PIN
                                </label>
                                <input
                                    type="password"
                                    value={exitCode}
                                    onChange={(e) => setExitCode(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && confirmExit()}
                                    placeholder="Enter 4-digit PIN"
                                    maxLength={4}
                                    className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-center text-2xl font-mono tracking-widest text-white"
                                    autoFocus
                                />
                                {error && (
                                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                        <AlertTriangle size={14} />
                                        {error}
                                    </p>
                                )}
                            </div>

                            {/* Hint for Demo */}
                            <p className="text-xs text-gray-500 text-center">
                                Demo PIN: 1234
                            </p>
                        </div>

                        {/* Modal Actions */}
                        <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex gap-3">
                            <button
                                onClick={() => {
                                    setShowExitPrompt(false);
                                    setError('');
                                    setExitCode('');
                                }}
                                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg border border-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmExit}
                                disabled={exitCode.length !== 4}
                                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                            >
                                Exit Kiosk
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}