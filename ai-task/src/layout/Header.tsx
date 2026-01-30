import { useState, useEffect, useRef } from 'react';
import { Settings, ChevronDown } from 'lucide-react';
import { TASKS } from '../lib/constants';
import { type AIProvider } from '../types/ai';

interface HeaderProps {
    provider: AIProvider;
    onProviderChange: (provider: AIProvider) => void;
    kioskMode: boolean;
    onToggleKiosk: () => void;
    onToggleSidebar: () => void;
    sidebarOpen: boolean; // Added to track sidebar state
}

export default function Header({
    provider,
    onProviderChange,
    kioskMode,
    onToggleKiosk,
    onToggleSidebar,
    sidebarOpen, // Added prop
}: HeaderProps) {
    const [showProviders, setShowProviders] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const providersRef = useRef<HTMLDivElement>(null);
    const settingsRef = useRef<HTMLDivElement>(null);

    const providers = [
        { id: 'edenai', name: 'Eden AI', description: 'Multi-model aggregator' },
        { id: 'openrouter', name: 'OpenRouter', description: 'Access to 100+ models' },
        { id: 'gemini', name: 'Google Gemini', description: 'Google\'s AI model' }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (providersRef.current && !providersRef.current.contains(event.target as Node)) {
                setShowProviders(false);
            }
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="w-full px-4 py-3 sm:py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 sm:gap-4">

                    {/* Left: Logo and Title */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                            AI
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">
                                AI Task Platform
                            </h1>
                            {kioskMode && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium inline-block mt-0.5">
                                    Kiosk Mode
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

                        {/* Provider Selector */}
                        {!kioskMode && (
                            <div className="relative" ref={providersRef}>
                                <button
                                    onClick={() => setShowProviders(!showProviders)}
                                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 font-medium border border-blue-100 transition-colors text-sm sm:text-base"
                                >
                                    <span className="hidden sm:inline">
                                        {providers.find(p => p.id === provider)?.name}
                                    </span>
                                    <span className="sm:hidden uppercase">
                                        {provider.slice(0, 3)}
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className={`text-gray-500 transition-transform duration-200 ${showProviders ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {showProviders && (
                                    <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-lg shadow-lg border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-2 border-b">
                                            <p className="text-sm font-medium text-gray-700">Select AI Provider</p>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {providers.map(p => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => {
                                                        onProviderChange(p.id as AIProvider);
                                                        setShowProviders(false);
                                                    }}
                                                    className={`w-full flex flex-col gap-0.5 px-4 py-3 hover:bg-gray-50 text-left transition-colors ${provider === p.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                                                >
                                                    <span className="font-medium text-sm sm:text-base">{p.name}</span>
                                                    <span className="text-xs text-gray-500">{p.description}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tasks Selector */}
                        {!kioskMode && (
                            <button
                                onClick={onToggleSidebar}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 font-medium border border-blue-100 transition-colors text-sm sm:text-base"
                            >
                                <span className="hidden sm:inline">All Tasks</span>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                                    {TASKS.length}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-500 transition-transform duration-200 ${sidebarOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                        )}

                        {/* Settings Button */}
                        <div className="relative" ref={settingsRef}>
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Settings size={20} className="text-gray-600" />
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-500 transition-transform duration-200 ${showSettings ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {showSettings && (
                                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2 border-b">
                                        <p className="font-medium text-gray-900">Settings</p>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-4 pb-4 border-b">
                                            <div>
                                                <span className="font-medium text-sm sm:text-base">Kiosk Mode</span>
                                                <p className="text-xs text-gray-500 mt-0.5">Fullscreen touch interface</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    onToggleKiosk();
                                                    setShowSettings(false);
                                                }}
                                                className={`w-12 h-6 rounded-full transition-colors ${kioskMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                                            >
                                                <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${kioskMode ? 'translate-x-7' : 'translate-x-1'} mt-0.5`} />
                                            </button>
                                        </div>
                                        {/* Usage Stats Content remains the same... */}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}