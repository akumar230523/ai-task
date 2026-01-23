// Kiosk Mode with Security Features
// =======================================================================

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

    // Security: Disable right-click
    const disableRightClick = (e: MouseEvent) => {
        e.preventDefault();
    };

    // Security: Block developer shortcuts
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

    // Enter fullscreen mode
    const enterFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
        } catch (err) {
            console.warn('Fullscreen not supported:', err);
        }
    };

    // Exit fullscreen mode
    const exitFullscreen = async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.warn('Error exiting fullscreen:', err);
        }
    };

    // Kiosk lifecycle
    useEffect(() => {
        if (!isEnabled) return;

        document.addEventListener('contextmenu', disableRightClick);
        document.addEventListener('keydown', blockDevShortcuts);
        enterFullscreen();

        // Prevent accidental fullscreen exit
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
        // Simple PIN check (in production, use proper authentication)
        const correctPin = '1234'; // Should be environment variable

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
            <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 z-50 shadow-lg">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Shield size={18} className="sm:w-5 sm:h-5" />
                        <span className="font-bold text-xs sm:text-sm">SECURE KIOSK MODE</span>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded animate-pulse">
                            ACTIVE
                        </span>
                    </div>

                    <button
                        onClick={handleExitAttempt}
                        className="flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded text-xs sm:text-sm font-medium transition-colors"
                    >
                        <Lock size={14} />
                        <span className="hidden sm:inline">Exit Kiosk</span>
                        <span className="sm:hidden">Exit</span>
                    </button>
                </div>
            </div>

            {/* Exit Confirmation Modal */}
            {showExitPrompt && (
                <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="p-6 border-b">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Lock size={24} className="text-red-600" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Exit Kiosk Mode
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-0.5">
                                        Enter PIN to continue
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-4">
                            {/* Warning */}
                            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-yellow-800">
                                    Exiting kiosk mode will disable security features and allow full system access.
                                </p>
                            </div>

                            {/* PIN Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Admin PIN
                                </label>
                                <input
                                    type="password"
                                    value={exitCode}
                                    onChange={(e) => setExitCode(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && confirmExit()}
                                    placeholder="Enter 4-digit PIN"
                                    maxLength={4}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-center text-2xl font-mono tracking-widest"
                                    autoFocus
                                />
                                {error && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
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
                        <div className="p-6 border-t bg-gray-50 flex gap-3">
                            <button
                                onClick={() => {
                                    setShowExitPrompt(false);
                                    setError('');
                                    setExitCode('');
                                }}
                                className="flex-1 px-4 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-lg border-2 border-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmExit}
                                disabled={exitCode.length !== 4}
                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                            >
                                Exit Kiosk
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Global Kiosk Styles */}
            <style>
                {`
          body {
            user-select: none;
            -webkit-user-select: none;
            -webkit-touch-callout: none;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          body::-webkit-scrollbar {
            display: none;
          }
          * {
            -webkit-tap-highlight-color: transparent;
          }
        `}
            </style>
        </>
    );
}