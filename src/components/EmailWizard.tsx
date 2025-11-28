import React, { useState } from 'react';
import { X, Mail, Copy, ExternalLink } from 'lucide-react';
import { EMAIL_TEMPLATES, getFullEmailText, getInferiorExtensionSearchUrl, getBuyerSearchUrl } from '../utils/outboundLogic';
import { copyToClipboard } from '../utils/domainLogic';

interface EmailWizardProps {
    domain: string;
    isOpen: boolean;
    onClose: () => void;
}

const EmailWizard: React.FC<EmailWizardProps> = ({ domain, isOpen, onClose }) => {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleCopyTemplate = async (templateId: string) => {
        const emailText = getFullEmailText(templateId, domain);
        const success = await copyToClipboard(emailText);

        if (success) {
            setCopiedTemplate(templateId);
            setTimeout(() => setCopiedTemplate(null), 2000);
        }
    };

    const handleFindBuyers = () => {
        window.open(getBuyerSearchUrl(domain), '_blank', 'noopener,noreferrer');
    };

    const handleFindUpgradeOpportunities = () => {
        window.open(getInferiorExtensionSearchUrl(domain), '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Mail className="text-green-600" size={28} />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Cold Email Wizard</h2>
                            <p className="text-sm text-gray-600">Draft outbound sales emails for: <span className="font-semibold text-primary-700">{domain}</span></p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Email Templates */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">📧 Choose Email Template</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {EMAIL_TEMPLATES.map((template) => (
                                <div
                                    key={template.id}
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedTemplate === template.id
                                            ? 'border-green-600 bg-green-50'
                                            : 'border-gray-200 hover:border-green-400'
                                        }`}
                                    onClick={() => setSelectedTemplate(template.id)}
                                >
                                    <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopyTemplate(template.id);
                                        }}
                                        className={`w-full px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${copiedTemplate === template.id
                                                ? 'bg-green-600 text-white'
                                                : 'bg-green-600 text-white hover:bg-green-700'
                                            }`}
                                    >
                                        <Copy size={16} />
                                        {copiedTemplate === template.id ? 'Copied!' : 'Copy Template'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Find Buyers Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Find Potential Buyers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={handleFindBuyers}
                                className="p-4 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900">Find Companies</h4>
                                    <ExternalLink size={20} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <p className="text-sm text-gray-600">Search for companies/brands matching this domain</p>
                            </button>

                            <button
                                onClick={handleFindUpgradeOpportunities}
                                className="p-4 border-2 border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900">Find Upgrade Opportunities</h4>
                                    <ExternalLink size={20} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <p className="text-sm text-gray-600">Find companies using inferior extensions (.net, .org, .io)</p>
                            </button>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2">💡 Outbound Tips (Brady Style)</h4>
                        <ul className="text-sm text-yellow-800 space-y-1">
                            <li>• Replace [Name] and [Company] with actual details before sending</li>
                            <li>• Research the company first - mention something specific</li>
                            <li>• Keep emails short and direct - busy founders appreciate brevity</li>
                            <li>• Follow up 3-5 days later if no response</li>
                            <li>• Target companies that just raised funding or launched recently</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailWizard;
