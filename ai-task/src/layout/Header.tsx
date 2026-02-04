import { useState, useEffect, useRef } from 'react';
import { Menu, X, Sparkles, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AI_PROVIDERS, THEME } from '../lib/constants';
import { type AIProvider } from '../types/ai';

interface HeaderProps {
    provider: AIProvider;
    onProviderChange: (provider: AIProvider) => void;
    onToggleKiosk: () => void;
    onToggleSidebar: () => void;
    sidebarOpen: boolean;
}

const Header = ({ provider, onProviderChange, onToggleKiosk, onToggleSidebar, sidebarOpen }: HeaderProps) => {
    const [showProviders, setShowProviders] = useState(false);
    const providersRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (providersRef.current && !providersRef.current.contains(event.target as Node)) {
                setShowProviders(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getProviderColor = (id: AIProvider) => {
        switch (id) {
            case 'edenai': return 'bg-purple-400';
            case 'openrouter': return 'bg-emerald-400';
            case 'gemini': return 'bg-blue-400';
            default: return 'bg-gray-400';
        }
    };

    return (
        <header
            className="w-full bg-gray-900 border-b border-gray-800 sticky top-0 z-50"
            style={{ backgroundColor: THEME.background }}
        >
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Left: Logo + Title */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-6">
                            <Link
                                to="/"
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{
                                        background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary})`
                                    }}
                                >
                                    <Sparkles className="text-white" size={15} />
                                </div>
                                <h1 className="text-lg font-bold text-white"> 
                                    AI Task 
                                </h1>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="flex items-center gap-4">

                        {/* AI Provider Selector */}
                        <div className="relative" ref={providersRef}>
                            <button
                                onClick={() => setShowProviders(!showProviders)}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <div className={`w-2 h-2 rounded-full ${getProviderColor(provider)} animate-pulse`} />
                                <span className="text-sm font-medium text-gray-300">
                                    {AI_PROVIDERS.find(p => p.id === provider)?.name}
                                </span>
                            </button>

                            {showProviders && (
                                <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-2 z-50">
                                    <div className="px-3 py-2 border-b border-gray-700">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Select AI Provider
                                        </p>
                                    </div>
                                    <div className="py-1">
                                        {AI_PROVIDERS.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => {
                                                    onProviderChange(p.id as AIProvider);
                                                    setShowProviders(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-700/50 transition-colors ${provider === p.id ? 'bg-blue-500/10' : ''}`}
                                            >
                                                <div className="flex flex-col items-start">
                                                    <span className="text-sm font-medium text-gray-300">{p.name}</span>
                                                    <span className="text-xs text-gray-500 mt-0.5">{p.description}</span>
                                                </div>
                                                <div className={`w-2 h-2 rounded-full ${getProviderColor(p.id as AIProvider)} animate-pulse`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Kiosk Mode Toggle */}
                        <button
                            onClick={onToggleKiosk}
                            className="flex items-center cursor-pointer"
                        >
                            <Monitor className="text-gray-400 hover:text-blue-400" size={18} />
                        </button>

                        {/* MENU BUTTON */}
                        <button
                            onClick={onToggleSidebar}
                            className="cursor-pointer"
                        >
                            {sidebarOpen ? (
                                <X className="text-gray-300 hover:text-blue-400" size={20} />
                            ) : (
                                <Menu className="text-gray-300 hover:text-blue-400" size={20} />
                            )}
                        </button>

                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;