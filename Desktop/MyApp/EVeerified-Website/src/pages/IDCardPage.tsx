import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const IDCardPage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLanguage();

    const displayName = user?.fullName || user?.full_name || 'User Name';
    const phone = user?.phoneNumber || user?.phone_number || '';
    const status = user?.verificationStatus || user?.verification_status || 'pending';
    const role = user?.role || 'Technician';
    const domain = user?.domain || 'EV';
    const experience = user?.experience || 'Not specified';

    const qrData = JSON.stringify({
        id: user?.id,
        name: displayName,
        phone: phone,
        status: status,
        verified: status === 'verified' || status === 'approved',
    });

    const getStatusColor = () => {
        switch (status) {
            case 'verified':
            case 'approved':
                return '#22c55e';
            case 'rejected':
                return '#ef4444';
            default:
                return '#f59e0b';
        }
    };

    const handleDownload = () => {
        alert('Download feature coming soon! You can take a screenshot for now.');
    };

    const handleShare = async () => {
        const text = `Check out my EVerified ID!\nName: ${displayName}\nRole: ${role}\nDomain: ${domain}\nStatus: ${status}`;

        if (navigator.share) {
            try {
                await navigator.share({ title: 'EVerified ID Card', text });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(text);
            alert('ID details copied to clipboard!');
        }
    };

    return (
        <div className="container-sm" style={{ padding: '60px 20px' }}>
            <h1 className="text-center mb-6">{t('idCard')}</h1>

            {/* ID Card */}
            <div
                style={{
                    maxWidth: '400px',
                    margin: '0 auto',
                    background: 'linear-gradient(135deg, #00e676 0%, #00b8d4 100%)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    color: '#0a0e27',
                }}
            >
                {/* Header */}
                <div className="text-center mb-4">
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>EVerified</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>
                        Verified Professional
                    </div>
                </div>

                {/* Avatar */}
                <div className="text-center mb-4">
                    <div
                        style={{
                            width: '100px',
                            height: '100px',
                            margin: '0 auto',
                            background: 'rgba(10, 14, 39, 0.2)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                        }}
                    >
                        👤
                    </div>
                </div>

                {/* Name & Role */}
                <div className="text-center mb-4">
                    <h2 style={{ marginBottom: '0.5rem' }}>{displayName}</h2>
                    <div style={{ opacity: 0.8 }}>
                        {role} • {domain}
                    </div>
                </div>

                {/* Details */}
                <div
                    style={{
                        background: 'rgba(10, 14, 39, 0.2)',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                    }}
                >
                    <div className="flex justify-between mb-2">
                        <span>Phone:</span>
                        <strong>{phone ? `+91 ${phone}` : '--'}</strong>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Experience:</span>
                        <strong>{experience}</strong>
                    </div>
                    <div className="flex justify-between">
                        <span>Status:</span>
                        <strong style={{ color: getStatusColor() }}>{status.toUpperCase()}</strong>
                    </div>
                </div>

                {/* QR Code */}
                <div className="text-center">
                    <div
                        style={{
                            background: 'white',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            display: 'inline-block',
                        }}
                    >
                        <QRCodeSVG value={qrData} size={100} />
                    </div>
                    <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.8 }}>
                        Scan to verify
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6" style={{ maxWidth: '400px', margin: '1.5rem auto 0' }}>
                <button className="btn btn-primary" onClick={handleDownload} style={{ flex: 1 }}>
                    {t('download')}
                </button>
                <button className="btn btn-secondary" onClick={handleShare}>
                    {t('share')}
                </button>
            </div>
        </div>
    );
};

export default IDCardPage;
