// Footer component with platform info
// =======================================================================

import React from 'react';

interface FooterProps {
    provider: string;
    kioskMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ provider, kioskMode }) => {
    return (
        <footer className="mt-12 border-t bg-white py-6 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/*  */}
                <div className="text-center md:text-left">
                    <p className="text-gray-700 font-medium">
                        AI Task Platform v1.0
                    </p>
                    <p className="text-sm text-gray-500">
                        Ready for commercial deployment
                    </p>
                </div>
                {/*  */}
                <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div>
                        <span className="font-medium">Provider:</span>{' '}
                        {provider.toUpperCase()}
                    </div>
                    <div>
                        <span className="font-medium">Mode:</span>{' '}
                        {kioskMode ? 'Kiosk' : 'Standard'}
                    </div>
                    <div>
                        <span className="font-medium">Pricing:</span> ₹99/task
                    </div>
                </div>
            </div>
        </footer>
    );

}

export default Footer;
