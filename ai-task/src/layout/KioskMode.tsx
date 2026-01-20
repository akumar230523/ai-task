// Kiosk Mode
// =======================================================================

import React, { useEffect, useState } from 'react';
import { Shield, Lock } from 'lucide-react';

interface KioskModeProps {
    isEnabled: boolean;
    onExit: () => void;
}

export const KioskMode: React.FC<KioskModeProps> = ({ isEnabled, onExit }) => {

    const [showExitPrompt, setShowExitPrompt] = useState(false);

    const disableRightClick = (e: MouseEvent) => {
        e.preventDefault();
    };

    const blockDevShortcuts = (e: KeyboardEvent) => {
        const blocked =
            e.key === 'F12' ||
            (e.ctrlKey &&
                e.shiftKey &&
                ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
            (e.ctrlKey && e.key.toLowerCase() === 'u');

        if (blocked) e.preventDefault();
    };

    const enterFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
        } catch {
            console.log('Fullscreen not supported');
        }
    };

    const exitFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }
    };

    // Kiosk lifecycle
    useEffect(() => {
        if (!isEnabled) return;

        document.addEventListener('contextmenu', disableRightClick);
        document.addEventListener('keydown', blockDevShortcuts);
        enterFullscreen();

        return () => {
            document.removeEventListener('contextmenu', disableRightClick);
            document.removeEventListener('keydown', blockDevShortcuts);
            exitFullscreen();
        };
    }, [isEnabled]);

    const confirmExit = () => {
        onExit();
        setShowExitPrompt(false);
    };

    if (!isEnabled) return null;

    return (
        <>
            {/* Kiosk Top Bar */}
            <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 z-40 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Shield size={18} />
                    <span className="font-bold text-sm">SECURE KIOSK MODE</span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                        ACTIVE
                    </span>
                </div>

                <button
                    onClick={() => setShowExitPrompt(true)}
                    className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition"
                >
                    <Lock size={14} />
                    Exit Kiosk
                </button>
            </div>
            {/* Exit Confirmation Modal */}
            {showExitPrompt && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Lock size={24} className="text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">
                                Exit Kiosk Mode?
                            </h3>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowExitPrompt(false)}
                                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmExit}
                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
                            >
                                Exit Kiosk Mode
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Kiosk Styles */}
            <style>
                {`
                    body {
                        user-select: none;
                        -webkit-user-select: none;
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    body::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>
        </>
    );

}



