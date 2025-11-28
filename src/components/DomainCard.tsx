import React from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { getAffiliateLink } from '../utils/domainLogic';

interface DomainCardProps {
    domain: string;
    value: number;
    status?: 'available' | 'taken' | 'unknown';
    onCheck?: () => void;
    loading?: boolean;
}

const DomainCard: React.FC<DomainCardProps> = ({
    domain,
    value,
    status,
    onCheck,
    loading = false
}) => {
    // CRITICAL: Safe currency formatting to prevent null crashes
    const formattedValue = `$${(value || 0).toLocaleString('en-US')}`;

    const handleBuyClick = () => {
        window.open(getAffiliateLink(domain), '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 break-all">
                    {domain}
                </h3>
                <p className="text-2xl font-bold text-primary-700">
                    {formattedValue}
                </p>
                <p className="text-sm text-gray-500">Estimated Value</p>
            </div>

            {status && (
                <div className="mb-4">
                    <StatusBadge status={status} />
                </div>
            )}

            <div className="flex gap-2">
                {onCheck && !status && (
                    <button
                        onClick={onCheck}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Checking...
                            </>
                        ) : (
                            'Check Availability'
                        )}
                    </button>
                )}

                <button
                    onClick={handleBuyClick}
                    className="flex-1 px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <ExternalLink size={16} />
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default DomainCard;
