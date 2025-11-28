import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Heart } from 'lucide-react';

const Navbar: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const linkClass = (path: string) => {
        const base = "px-4 py-2 rounded-lg font-medium transition-colors";
        if (isActive(path)) {
            return `${base} bg-primary-700 text-white`;
        }
        return `${base} text-gray-700 hover:bg-primary-50 hover:text-primary-700`;
    };

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-700 hover:text-primary-800 transition-colors">
                        <Globe size={32} />
                        <span>DomainHunter</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-2">
                        <Link to="/" className={linkClass('/')}>
                            Home
                        </Link>
                        <Link to="/bulk" className={linkClass('/bulk')}>
                            Bulk Sniper
                        </Link>
                        <Link to="/mixer" className={linkClass('/mixer')}>
                            Creative Mixer
                        </Link>
                        <Link to="/saved" className={linkClass('/saved')}>
                            <div className="flex items-center gap-1">
                                <Heart size={16} />
                                Saved
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
