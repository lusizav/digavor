import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <p className="text-gray-600 mb-2">
                        © {new Date().getFullYear()} DomainHunter. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-500 italic">
                        AI-Powered Valuation Model (Beta)
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        Domain valuations are estimates and may not reflect actual market value.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
