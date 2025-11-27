import React from 'react';
import { Heart, TrendingUp, BarChart3 } from 'lucide-react';
import { formatNumber } from '../utils/expiredDomainGenerator';

/**
 * Enhanced Expired Domain Card Component
 * Displays comprehensive domain metrics with grid/list view support
 */
export default function ExpiredDomainCard({ domain, viewMode, onToggleFavorite }) {
    const {
        name,
        age,
        backlinks,
        domainAuthority,
        trustFlow,
        citationFlow,
        referringDomains,
        monthlyTraffic,
        dropDate,
        price,
        status,
        isTrending,
        favorite
    } = domain;

    if (viewMode === 'list') {
        return (
            <div className="card p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between gap-6">
                    {/* Domain Name & Status */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-900 truncate">{name}</h3>

                            <span className="badge bg-blue-100 text-blue-700">Demo Data</span>

                            {isTrending && (
                                <span className="badge bg-orange-100 text-orange-700 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    Trending
                                </span>
                            )}

                            <button
                                onClick={() => onToggleFavorite(name)}
                                className={`ml-auto p-2 rounded-full transition-colors ${favorite ? 'text-pink-600 bg-pink-50' : 'text-slate-400 hover:text-pink-600 hover:bg-pink-50'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                        <p className="text-sm text-slate-500">{dropDate}</p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-xs text-slate-500 uppercase mb-1">Age</div>
                            <div className="text-lg font-bold text-slate-700">{age}y</div>
                        </div>

                        <div className="text-center">
                            <div className="text-xs text-slate-500 uppercase mb-1">DA</div>
                            <div className="text-lg font-bold text-purple-600">{domainAuthority}</div>
                        </div>

                        <div className="text-center">
                            <div className="text-xs text-slate-500 uppercase mb-1">Backlinks</div>
                            <div className="text-lg font-bold text-blue-600">{formatNumber(backlinks)}</div>
                        </div>

                        <div className="text-center">
                            <div className="text-xs text-slate-500 uppercase mb-1">Traffic</div>
                            <div className="text-lg font-bold text-green-600">{formatNumber(monthlyTraffic)}/mo</div>
                        </div>
                    </div>

                    {/* Price & Action */}
                    <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase mb-1">Est. Value</div>
                        <div className="text-2xl font-bold text-primary-700 mb-3">${price}</div>
                        <a
                            href={`https://www.namecheap.com/domains/registration/results/?domain=${name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Check on Namecheap
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Grid View
    return (
        <div className="card p-6 hover:shadow-2xl transition-all duration-300 relative">
            {/* Trending Badge */}
            {isTrending && (
                <div className="absolute top-3 right-3">
                    <span className="badge bg-orange-100 text-orange-700 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                    </span>
                </div>
            )}

            {/* Favorite Button */}
            <button
                onClick={() => onToggleFavorite(name)}
                className={`absolute top-3 left-3 p-2 rounded-full transition-colors ${favorite ? 'text-pink-600 bg-pink-50' : 'text-slate-400 hover:text-pink-600 hover:bg-pink-50'
                    }`}
            >
                <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
            </button>

            {/* Domain Name & Status */}
            <div className="mt-8 mb-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-900 truncate">{name}</h3>
                    <span className="badge bg-blue-100 text-blue-700 flex-shrink-0">Demo Data</span>
                </div>
                <p className="text-sm text-slate-500">{dropDate}</p>
            </div>

            {/* Primary Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b-2 border-slate-100">
                <div className="text-center">
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Age</div>
                    <div className="text-lg font-bold text-slate-700">{age}y</div>
                </div>

                <div className="text-center">
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">DA</div>
                    <div className="text-lg font-bold text-purple-600">{domainAuthority}</div>
                </div>

                <div className="text-center">
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Backlinks</div>
                    <div className="text-lg font-bold text-blue-600">{formatNumber(backlinks)}</div>
                </div>
            </div>

            {/* Secondary Metrics */}
            <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Trust Flow:</span>
                    <span className="font-semibold text-slate-900">{trustFlow}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Citation Flow:</span>
                    <span className="font-semibold text-slate-900">{citationFlow}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Ref. Domains:</span>
                    <span className="font-semibold text-slate-900">{formatNumber(referringDomains)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        Traffic/mo:
                    </span>
                    <span className="font-semibold text-green-600">{formatNumber(monthlyTraffic)}</span>
                </div>
            </div>

            {/* Price */}
            <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg border border-primary-100">
                <div className="text-xs text-primary-700 uppercase tracking-wide mb-1">Estimated Value</div>
                <div className="text-3xl font-black text-primary-700">${price}</div>
            </div>

            {/* Action Button */}
            <a
                href={`https://www.namecheap.com/domains/registration/results/?domain=${name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center font-semibold rounded-lg hover:shadow-xl transition-all"
            >
                Verify Availability on Namecheap
            </a>

            <p className="text-xs text-center text-slate-500 mt-2">
                ⚠️ Always verify before purchasing
            </p>
        </div>
    );
}
