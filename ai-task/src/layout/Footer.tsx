// Footer
// =======================================================================

interface FooterProps {
    provider: string;
    kioskMode: boolean;
}

export default function Footer({ provider, kioskMode }: FooterProps) {
    return (
        <footer className="w-full mt-auto border-t bg-white">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                <div className="max-w-7xl mx-auto">
                    {/* Main Footer Content */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
                        {/* Left: Platform Info */}
                        <div className="text-center md:text-left">
                            <p className="text-gray-800 font-semibold text-sm sm:text-base flex items-center justify-center md:justify-start gap-2">
                                <span className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                    AI
                                </span>
                                <span>AI Task Platform v1.0</span>
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                Commercial-ready deployment
                            </p>
                        </div>

                        {/* Right: Status Info */}
                        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Provider:</span>
                                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-semibold border border-blue-200">
                                    {provider.toUpperCase()}
                                </span>
                            </div>

                            <div className="hidden sm:block w-px h-5 bg-gray-300" />

                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Mode:</span>
                                <span className={`px-2.5 py-1 rounded-md font-semibold border ${kioskMode
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-gray-100 text-gray-700 border-gray-200'
                                    }`}>
                                    {kioskMode ? 'Kiosk' : 'Standard'}
                                </span>
                            </div>

                            <div className="hidden sm:block w-px h-5 bg-gray-300" />

                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Pricing:</span>
                                <span className="text-blue-600 font-bold text-base">₹99/task</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar - Only on Desktop */}
                    <div className="hidden lg:flex items-center justify-center gap-4 mt-5 pt-5 border-t border-gray-200">
                        <div className="flex items-center gap-6 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                All systems operational
                            </span>
                            <span>•</span>
                            <span>Powered by Vercel AI SDK</span>
                            <span>•</span>
                            <span>Multi-provider support</span>
                            <span>•</span>
                            <span>Kiosk-ready deployment</span>
                        </div>
                    </div>

                    {/* Mobile Bottom Info */}
                    <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <span>All systems operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}