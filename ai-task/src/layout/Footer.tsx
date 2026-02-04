import { THEME } from '../lib/constants';

interface FooterProps {
    provider: string;
    kioskMode: boolean;
}

export default function Footer({ provider, kioskMode }: FooterProps) {
    return (
        <footer
            className="w-full border-t"
            style={{
                backgroundColor: THEME.background,
                borderColor: THEME.border
            }}
        >
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Left: Platform Info */}
                        <div>
                            <p className="text-sm font-medium text-white">
                                AI Task Platform v1.0
                            </p>
                            <p className="text-xs" style={{ color: THEME.text.muted }}>
                                Commercial-ready deployment
                            </p>
                        </div>

                        {/* Center: Status Indicators */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full animate-pulse"
                                    style={{ backgroundColor: THEME.accent }}
                                ></div>
                                <span className="text-sm" style={{ color: THEME.text.secondary }}>
                                    Systems: <span style={{ color: THEME.accent }}>Operational</span>
                                </span>
                            </div>

                            <div className="h-4 w-px" style={{ backgroundColor: THEME.border }}></div>

                            <div className="text-sm" style={{ color: THEME.text.secondary }}>
                                Provider: <span className="font-medium" style={{ color: THEME.primary }}>
                                    {provider.toUpperCase()}
                                </span>
                            </div>

                            <div className="h-4 w-px" style={{ backgroundColor: THEME.border }}></div>

                            <div className="text-sm" style={{ color: THEME.text.secondary }}>
                                Mode: <span className={`px-2 py-1 rounded ${kioskMode ? 'text-emerald-400' : 'text-blue-400'}`}>
                                    {kioskMode ? 'Kiosk' : 'Standard'}
                                </span>
                            </div>
                        </div>

                        {/* Right: Pricing */}
                        <div className="text-sm" style={{ color: THEME.text.secondary }}>
                            Pricing: <span className="font-bold text-white">₹99</span>/task
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div
                        className="mt-4 pt-4 border-t text-center"
                        style={{ borderColor: THEME.border }}
                    >
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs"
                            style={{ color: THEME.text.muted }}
                        >
                            <span>Powered by Vercel AI SDK</span>
                            <span className="hidden sm:block">•</span>
                            <span>Multi-provider AI</span>
                            <span className="hidden sm:block">•</span>
                            <span>Enterprise Ready</span>
                            <span className="hidden sm:block">•</span>
                            <span>Kiosk Mode Supported</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}