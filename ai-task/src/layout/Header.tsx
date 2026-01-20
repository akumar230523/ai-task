// Header component with provider selector and kiosk toggle
// =======================================================================

import React, { useState } from "react";
import { Settings, Shield } from 'lucide-react';

interface HeaderProps {
    provider: string;
    onProviderChange: (provider: string) => void;
    kioskMode: boolean;
    onToggleKiosk: () => void;
}

const Header: React.FC<HeaderProps> = ({ provider, onProviderChange, kioskMode, onToggleKiosk }) => {

    const [showProviders, setShowProviders] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const providers = [
        { id: 'openai', name: 'Open AI' },
        { id: 'claude', name: 'Anthropic Claude' },
        { id: 'edenaI', name: 'Eden AI' },
        { id: 'openrouter', name: 'OpenRouter' },
        { id: 'vertex', name: 'Google Vertex' },
        { id: 'gemini', name: 'Google Gemini' }
    ];

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50 p-4">
            {/*  */}
            <div className="flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow">
                        AI
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900"> Ai-Task </h1>
                        {kioskMode && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                                Kiosk Mode Active
                            </span>
                        )}
                    </div>
                </div>
                {/* Controls */}
                <div className="flex items-center gap-3">
                    {/* Provider Selector - Hidden in Kiosk Mode */}
                    {!kioskMode && (
                        <div className="relative">
                            <button
                                onClick={() => setShowProviders(!showProviders)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
                            >
                                <span className="hidden sm:inline">{providers.find(p => p.id === provider)?.name}</span>
                                <svg className={`w-4 h-4 transition-transform ${showProviders ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {/*  */}
                            {showProviders && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm font-medium text-gray-700">Select AI Provider</p>
                                    </div>
                                    {providers.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => { onProviderChange(p.id); setShowProviders(false); }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left ${provider === p.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                                                }`}
                                        >
                                            <span className="font-medium">{p.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {/* Settings Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <Settings size={22} className="text-gray-600" />
                        </button>
                        {/*  */}
                        {showSettings && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
                                <div className="px-4 py-2 border-b">
                                    <p className="font-medium text-gray-900">Settings</p>
                                </div>
                                <button
                                    onClick={() => { onToggleKiosk(); setShowSettings(false); }}
                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <Shield size={18} className="text-blue-600" />
                                        <span className="font-medium">Kiosk Mode</span>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full transition ${kioskMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                        <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${kioskMode ? 'translate-x-7' : 'translate-x-1'} mt-0.5`}></div>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Status Bar - Hidden in Kiosk Mode */}
            {!kioskMode && (
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>All systems operational</span>
                    </div>
                    <span>•</span>
                    <span>Provider: {provider.toUpperCase()}</span>
                </div>
            )}
        </header>
    );

}

export default Header;


