import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import {
    Zap, CheckCircle, Clock, Package, ChevronRight, X,
    MapPin, Phone, User as UserIcon, Home, Download, Share2,
    MessageCircle, Star, Edit, LogOut, Instagram, Facebook
} from 'lucide-react';
import html2canvas from 'html2canvas';

// --- Components Ported from Mobile ---

// Circuit Pattern SVG
const CircuitPattern = ({ color, isGold, isTeal }: { color?: string, isGold?: boolean, isTeal?: boolean }) => {
    const strokeColor = color || (isGold ? "#d4a574" : isTeal ? "#00d9cc" : "#00ccaa");
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.4, pointerEvents: 'none' }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Horizontal lines */}
                <line x1="10%" y1="20%" x2="30%" y2="20%" stroke={strokeColor} strokeWidth="2" />
                <line x1="12%" y1="35%" x2="32%" y2="35%" stroke={strokeColor} strokeWidth="2" />
                <line x1="8%" y1="55%" x2="25%" y2="55%" stroke={strokeColor} strokeWidth="1.5" />
                <line x1="14%" y1="75%" x2="35%" y2="75%" stroke={strokeColor} strokeWidth="1.5" />

                {/* Diagonal segments */}
                <path d="M 150 60 L 190 75 L 250 75" stroke={strokeColor} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                <path d="M 170 110 L 210 125 L 280 125" stroke={strokeColor} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />

                {/* Right side lines */}
                <line x1="75%" y1="15%" x2="92%" y2="15%" stroke={strokeColor} strokeWidth="1.5" />
                <line x1="77%" y1="30%" x2="94%" y2="30%" stroke={strokeColor} strokeWidth="1.5" />

                {/* Circuit nodes */}
                <circle cx="30%" cy="20%" r="2.5" fill={strokeColor} />
                <circle cx="35%" cy="28%" r="2.5" fill={strokeColor} />
                <circle cx="32%" cy="35%" r="2.5" fill={strokeColor} />
                <circle cx="25%" cy="55%" r="2.5" fill={strokeColor} />
                <circle cx="35%" cy="75%" r="2.5" fill={strokeColor} />
                <circle cx="80%" cy="45%" r="2.5" fill={strokeColor} />
            </svg>
        </div>
    );
};

// QR Code Grid Pattern
const QRCodeGrid = ({ size = 65, color = '#1f2937' }: { size?: number, color?: string }) => {
    const cols = 5;
    const cellSize = size / cols;
    const filledIndices = [0, 1, 2, 4, 5, 6, 10, 14, 18, 20, 21, 22, 24];

    return (
        <div style={{ width: size, height: size, display: 'flex', flexWrap: 'wrap' }}>
            {Array.from({ length: 25 }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: filledIndices.includes(i) ? color : 'transparent',
                        padding: 1.5
                    }}
                />
            ))}
        </div>
    );
};

// Theme Configs
const THEMES = {
    gold: {
        gradient: 'linear-gradient(to right, #3a2817, #4a3520, #5a4228)',
        primaryColor: '#d4a574',
        badgeGradient: 'linear-gradient(to right, rgba(212, 165, 116, 0.25), rgba(180, 130, 50, 0.15))',
        badgeBorder: '#d4a574',
        partnersGradient: 'linear-gradient(to right, rgba(160, 110, 40, 0.55), rgba(180, 130, 50, 0.45))',
        partnersBorder: 'rgba(200, 150, 70, 0.7)',
        qrColor: '#3a2817'
    },
    teal: {
        gradient: 'linear-gradient(to right, #0a4d4d, #0d5f5f, #107373)',
        primaryColor: '#00d9cc',
        badgeGradient: 'linear-gradient(to right, rgba(0, 217, 204, 0.25), rgba(0, 217, 204, 0.15))',
        badgeBorder: '#00d9cc',
        partnersGradient: 'linear-gradient(to right, rgba(0, 180, 180, 0.4), rgba(0, 200, 200, 0.35))',
        partnersBorder: 'rgba(0, 217, 204, 0.6)',
        qrColor: '#0a3434'
    },
    green: {
        gradient: 'linear-gradient(to right, #0a1929, #0d3a5c, #1565c0)',
        primaryColor: '#64b5f6',
        badgeGradient: 'linear-gradient(to right, rgba(100, 181, 246, 0.25), rgba(100, 181, 246, 0.15))',
        badgeBorder: '#42a5f5',
        partnersGradient: 'linear-gradient(to right, rgba(66, 165, 245, 0.3), rgba(66, 165, 245, 0.2))',
        partnersBorder: 'rgba(100, 181, 246, 0.5)',
        qrColor: '#0a3434'
    },
};

const IDCardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const cardRef = useRef<HTMLDivElement>(null);

    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [cardOrdered, setCardOrdered] = useState(false);
    const [isOrderLoading, setIsOrderLoading] = useState(false);

    // Order Form State
    const [orderForm, setOrderForm] = useState({
        fullName: user?.fullName || '',
        address: '',
        city: user?.city || '',
        pincode: user?.pincode || '',
        mobile: user?.phoneNumber || '',
    });

    useEffect(() => {
        const checkCardOrderStatus = async () => {
            if (!user?.id) return;
            try {
                const result = await api.getCardOrderStatus(user.id);
                if (result.cardOrdered) {
                    setCardOrdered(true);
                }
            } catch (error) {
                console.error('Error checking order status:', error);
                // Silently fail or retry
            }
        };
        checkCardOrderStatus();
    }, [user?.id]);


    // --- Logic Helpers ---

    const getRoleLabel = () => {
        const role = user?.role;
        const cleanRole = (role || "").replace(/^Verified\s+/i, "");

        if (role === 'technician' && user?.domain === 'BS6') {
            const category = user?.vehicle_category ? ` (${user.vehicle_category})` : '';
            return `BS6 Technician${category}`;
        }

        switch (cleanRole.toLowerCase()) {
            case "technician": return t('evTechnician') || 'EV Technician';
            case "sales": return 'EV Showroom Manager';
            case "workshop": return 'EV Workshop Manager';
            case "aspirant": return t('fresher') || 'Fresher';
            default: return cleanRole || 'Professional';
        }
    };

    const getVerificationProgress = () => {
        const role = user?.role;
        const status = user?.verificationStatus;
        const step = user?.verificationStep || 0;

        // BS6 Technician Logic
        if (user?.domain === 'BS6' && role === 'technician') {
            if (status === 'verified') return t('allTestsPassed') || 'All Tests Passed';
            if (status === 'failed') return t('retryAfter7Days') || 'Retry after 7 days';
            if (step === 0) return "Basic Verification Pending";
            if (step === 1) return "Engine Expert";
            if (step === 2) return "Diagnosis Expert(Electrical)";
            return "Diagnosis + Engine Expert";
        }

        const isSingleStepRole = role === 'sales' || role === 'workshop' || role === 'aspirant';
        if (status === 'verified') return isSingleStepRole ? (t('testPassed') || 'Test Passed') : (t('allTestsPassed') || 'All Tests Passed');
        if (status === 'failed') return t('retryAfter7Days') || 'Retry after 7 days';
        if (status === 'step1_completed' && !isSingleStepRole) return "One Test Passed";
        return "Complete Your Verification";
    };

    const getExperienceLabel = (exp?: string) => {
        if (!exp || exp.toLowerCase() === 'fresher') return t('fresher') || 'Fresher';

        // Handle values that already have "year" in them (from AuthPage dropdown)
        if (exp.toLowerCase().includes('year')) {
            // Just return the translated string if possible, or keep as is but try to translate "years"
            return exp.replace(/years?/i, t('yearExperienced') || 'Year Exp.');
        }

        if (exp === '0-1') return `0-1 ${t('yearExperienced') || 'Year Exp.'}`;
        if (exp === '1-2') return `1+ ${t('yearExperienced') || 'Year Exp.'}`;
        if (exp === '2-5') return `2+ ${t('yearExperienced') || 'Year Exp.'}`;
        if (exp === '5+') return `5+ ${t('yearExperienced') || 'Year Exp.'}`;
        return `${exp} ${t('yearExperienced') || 'Year Exp.'}`;
    };

    // --- Theme & Data derivation ---

    const role = (user?.role || "").toLowerCase();
    const isGold = role === 'sales';
    const isTeal = role === 'workshop';
    const theme = isGold ? THEMES.gold : isTeal ? THEMES.teal : THEMES.green;

    // Verification Logic
    const hasPassedTest = user?.verificationStatus === 'verified' || user?.verificationStatus === 'approved';
    const isFullyVerified = hasPassedTest && (user?.is_admin_verified === true);

    const showGreenTick = isFullyVerified;
    const showYellowTick = hasPassedTest && !isFullyVerified;
    const accentColor = theme.primaryColor;
    const roleTitle = getRoleLabel();
    const experienceText = getExperienceLabel(user?.experience);

    // Experience Partners
    const userBrands = user?.brands || [];
    const experiencePartners = useMemo(() => {
        const role = (user?.role || "").toLowerCase();
        const experience = (user?.experience || "").toLowerCase();

        if (role === 'aspirant' || !experience || experience === 'fresher') {
            return [];
        }

        const validBrands = userBrands.filter(b => b && b !== 'Other');
        if (validBrands.length > 0) {
            return validBrands.slice(0, 3).map((brand, index) => ({
                name: brand,
                sub: "",
                color: index === 0 ? theme.primaryColor : "#ffffff"
            }));
        }
        return [];
    }, [userBrands, theme.primaryColor, user?.role, user?.experience]);


    // --- Actions ---

    const handleDownload = async () => {
        if (!cardRef.current) return;
        try {
            const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
            const link = document.createElement('a');
            link.download = `EVerified-Card-${user?.fullName}.png`;
            link.href = canvas.toDataURL();
            link.click();
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download card');
        }
    };

    const handleOrderCard = async () => {
        if (!orderForm.fullName || !orderForm.address || !orderForm.pincode || !orderForm.mobile) {
            alert('Please fill all required fields');
            return;
        }

        setIsOrderLoading(true);
        try {
            if (user?.id) {
                await api.updateCardOrderStatus(user.id, true);
                setCardOrdered(true);
                alert('Order Placed! Your physical ID Card will be delivered in 7-10 days.');
                setShowOrderModal(false);
            }
        } catch (error) {
            console.error('Order error:', error);
            alert('Failed to place order.');
        } finally {
            setIsOrderLoading(false);
        }
    };

    const handleStartVerification = () => {
        // In web we handle step logic inside the page usually, but here we can just navigate
        navigate('/skill-verification');
    };

    if (!user) return <div style={{ padding: 20, textAlign: 'center' }}>Loading...</div>;

    // --- Premium Modern Styles ---
    const pageStyle: React.CSSProperties = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #172554 100%)', // Deep Slate to Blue
        color: '#f8fafc',
        fontFamily: "'Inter', sans-serif",
        paddingBottom: '80px',
        maxWidth: '100vw',
        overflowX: 'hidden'
    };

    const navStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    };

    const mainContainerStyle: React.CSSProperties = {
        maxWidth: '480px',
        margin: '0 auto',
        padding: '24px',
    };

    const glassCardStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '6px', // Inner padding for the card container
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        marginBottom: '32px',
        marginTop: '10px'
    };

    const cardContainerStyle: React.CSSProperties = {
        position: 'relative',
        width: '100%',
        aspectRatio: '1.586',
        borderRadius: '20px',
        overflow: 'hidden',
        background: theme.gradient,
        color: 'white',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: '14px',
        fontWeight: 600,
        color: '#94a3b8',
        marginBottom: '12px',
        letterSpacing: '0.05em',
        textTransform: 'uppercase'
    };

    const actionButtonStyle: React.CSSProperties = {
        flex: 1,
        padding: '14px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 500,
        fontSize: '12px',
        cursor: 'pointer',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#e2e8f0',
        transition: 'all 0.2s',
        backdropFilter: 'blur(10px)'
    };

    const verificationCardStyle: React.CSSProperties = {
        background: showGreenTick
            ? 'linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))'
            : 'linear-gradient(to right, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
        border: `1px solid ${showGreenTick ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '32px'
    };

    const premiumButtonStyle: React.CSSProperties = {
        width: '100%',
        background: 'linear-gradient(to right, #20dbd8, #50d5b7)', // Cyan to Teal
        border: 'none',
        padding: '18px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: cardOrdered ? 'default' : 'pointer',
        boxShadow: '0 10px 25px -5px rgba(32, 219, 216, 0.3)',
        color: '#0f172a', // Dark text on bright button
        marginTop: '16px',
        opacity: cardOrdered ? 0.8 : 1,
        transition: 'transform 0.2s',
    };

    const whatsAppButtonStyle: React.CSSProperties = {
        width: '100%',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        cursor: 'pointer',
        color: '#fff',
        marginTop: '16px',
        textDecoration: 'none'
    };

    return (
        <div style={pageStyle}>
            {/* Navbar */}
            <div style={navStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #20dbd8, #137a55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={20} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '-0.02em' }}>EVerified</span>
                </div>
                <button onClick={logout} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                    <LogOut size={16} />
                </button>
            </div>

            <div style={mainContainerStyle}>

                {/* Greeting */}
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {t('welcome')}, <span style={{ background: 'linear-gradient(to right, #20dbd8, #50d5b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user.fullName?.split(' ')[0]}</span>
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '15px' }}>{roleTitle} • {experienceText}</p>
                </div>

                {/* ID Card Glass Container */}
                <div style={glassCardStyle}>
                    <div
                        ref={cardRef}
                        style={cardContainerStyle}
                    >
                        <CircuitPattern color={accentColor} isGold={isGold} isTeal={isTeal} />

                        <div style={{ position: 'relative', zIndex: 10, padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {/* Card Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <Zap size={20} color="#00d9a3" fill="#00d9a3" />
                                <span style={{ fontWeight: 'bold', fontSize: '18px', letterSpacing: '0.05em' }}>
                                    <span style={{ color: '#00d9a3' }}>EV</span>erified
                                </span>
                            </div>

                            {/* User Details */}
                            <div style={{ marginBottom: '20px', maxWidth: '65%' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: 1.2, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.fullName}</h2>
                                <p style={{ fontWeight: 600, fontSize: '13px' }}>{roleTitle}</p>
                                <p style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>| {experienceText}</p>
                            </div>

                            {/* Verification Badge */}
                            <div style={{ marginBottom: 'auto' }}>
                                {showGreenTick ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid #00d9a3', backgroundColor: 'rgba(0, 217, 163, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CheckCircle size={28} color="#00d9a3" fill="#fff" />
                                        </div>
                                        <div>
                                            <div style={{ color: '#00d9a3', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.1em' }}>VERIFIED</div>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} color="#FFD700" fill="#FFD700" />)}
                                            </div>
                                        </div>
                                    </div>
                                ) : showYellowTick ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid #FFC107', backgroundColor: 'rgba(255, 193, 7, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CheckCircle size={28} color="#FFC107" fill="#fff" />
                                        </div>
                                        <div>
                                            <div style={{ color: '#FFC107', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.1em' }}>TEST PASSED</div>
                                            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px' }}>Pending Admin Approval</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ marginTop: '8px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #FFC107', backgroundColor: 'rgba(255, 193, 7, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ color: '#FFC107', fontSize: '6px', fontWeight: 'bold' }}>PENDING</div>
                                                <div style={{ color: '#FFC107', fontSize: '6px', fontWeight: 'bold' }}>VERIFICATION</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* QR Code Circle */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                right: '4%',
                                transform: 'translateY(-50%)',
                                width: '96px',
                                height: '96px',
                                borderRadius: '50%',
                                border: `2px solid ${accentColor}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(4px)'
                            }}>
                                <div style={{ backgroundColor: 'white', padding: '2px', borderRadius: '6px' }}>
                                    <QRCodeGrid size={45} color={theme.qrColor} />
                                </div>
                            </div>

                            {/* Experience Partners */}
                            {experiencePartners.length > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '2%',
                                    left: 0,
                                    right: 0,
                                    paddingLeft: '5%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '8px', fontWeight: 'bold', letterSpacing: '0.05em' }}>EXPERIENCE PARTNERS</span>
                                    <div style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-around',
                                        padding: '8px 16px',
                                        borderTopLeftRadius: '30px',
                                        borderBottomLeftRadius: '30px',
                                        borderLeft: `2px solid ${theme.partnersBorder}`,
                                        borderTop: `2px solid ${theme.partnersBorder}`,
                                        borderBottom: `2px solid ${theme.partnersBorder}`,
                                        background: theme.partnersGradient,
                                    }}>
                                        {experiencePartners.map((p, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                                <span style={{ fontSize: '11px', fontWeight: 'bold', color: p.color }}>{p.name}</span>
                                                {p.sub && <span style={{ fontSize: '9px', opacity: 0.85, color: p.color }}>{p.sub}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Verification Status */}
                <div style={verificationCardStyle}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: showGreenTick ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: showGreenTick ? '#34d399' : '#fbbf24'
                    }}>
                        {showGreenTick ? <CheckCircle size={24} /> : <Clock size={24} />}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontWeight: 'bold', fontSize: '16px', color: '#f1f5f9', margin: 0, marginBottom: '4px' }}>
                            {showGreenTick ? 'Profile Verified' : showYellowTick ? 'Test Passed' : 'Pending Verification'}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                            {showYellowTick && !showGreenTick ? 'Pending Admin Approval' : getVerificationProgress()}
                        </p>
                    </div>
                    {/* Verification Button Logic with Cooldown */
                        (() => {
                            const failedAt = user.quizFailedAt || user.quiz_failed_at;
                            let daysRemaining = 0;
                            let inCooldown = false;

                            if (user.verificationStatus === 'failed' && failedAt) {
                                const lastFailedDate = new Date(failedAt);
                                const now = new Date();
                                const diffTime = Math.abs(now.getTime() - lastFailedDate.getTime());
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                if (diffDays <= 7) {
                                    inCooldown = true;
                                    daysRemaining = 7 - Math.floor(diffTime / (1000 * 60 * 60 * 24));
                                }
                            }

                            if (hasPassedTest) return null;

                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                    <button
                                        onClick={handleStartVerification}
                                        disabled={inCooldown || user.verificationStatus === 'verified'} // verified check redundant but safe
                                        style={{
                                            background: inCooldown ? '#e2e8f0' : '#f8fafc',
                                            color: inCooldown ? '#94a3b8' : '#0f172a',
                                            padding: '10px 16px',
                                            borderRadius: '12px',
                                            fontSize: '13px',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            border: 'none',
                                            cursor: inCooldown ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {user.verificationStatus === 'step1_completed' ? 'Continue' : inCooldown ? 'Locked' : 'Start'}
                                    </button>
                                    {inCooldown && (
                                        <span style={{ fontSize: '10px', color: '#ef4444' }}>
                                            Retake in {daysRemaining} days
                                        </span>
                                    )}
                                </div>
                            );
                        })()}

                </div>

                {/* Quick Actions */}
                <h3 style={sectionTitleStyle}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                    <button onClick={() => navigate('/profile')} style={actionButtonStyle}>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%' }}>
                            <Edit size={20} />
                        </div>
                        Edit Profile
                    </button>
                    <button onClick={handleDownload} style={actionButtonStyle}>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%' }}>
                            <Download size={20} />
                        </div>
                        Save Card
                    </button>
                    <button onClick={() => setShowShareModal(true)} style={actionButtonStyle}>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%' }}>
                            <Share2 size={20} />
                        </div>
                        Share Profile
                    </button>
                </div>

                {/* Premium Services */}
                <h3 style={sectionTitleStyle}>Premium Services</h3>

                <button
                    onClick={() => !cardOrdered && setShowOrderModal(true)}
                    disabled={cardOrdered}
                    style={premiumButtonStyle}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.1)'
                        }}>
                            {cardOrdered ? <CheckCircle size={24} color="#0f172a" /> : <Package size={24} color="#0f172a" />}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <h3 style={{ fontWeight: 'bold', fontSize: '16px', color: '#0f172a', margin: 0, marginBottom: '2px' }}>
                                {cardOrdered ? 'Card Ordered' : 'Order Physical Card'}
                            </h3>
                            <p style={{ fontSize: '12px', color: 'rgba(15, 23, 42, 0.7)', margin: 0, fontWeight: 500 }}>
                                {cardOrdered ? 'Estimated delivery: 7-10 days' : 'Get premium PVC card for ₹199'}
                            </p>
                        </div>
                    </div>
                </button>

                {/* WhatsApp Support */}
                <a
                    href="https://wa.me/919473928468?text=Hi,%20I%20need%20help%20with%20EVerified%20app."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={whatsAppButtonStyle}
                >
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(37, 211, 102, 0.2)'
                    }}>
                        <MessageCircle size={22} color="#25D366" />
                    </div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                        <h3 style={{ fontWeight: 'bold', fontSize: '15px', color: '#f8fafc', margin: 0 }}>WhatsApp Support</h3>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Get instant help 24/7</p>
                    </div>
                    <ChevronRight size={18} color="#64748b" />
                </a>

            </div>

            {/* Order Modal (Themed) */}
            {showOrderModal && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{ backgroundColor: '#1e293b', width: '100%', maxWidth: '440px', borderRadius: '24px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: 'white' }}>Order Physical ID Card (₹199)</h2>
                            <button onClick={() => setShowOrderModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X color="#94a3b8" /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Input Field Helper */}
                            {[
                                { label: 'Full Name', key: 'fullName', icon: <UserIcon size={18} color="#94a3b8" /> },
                                { label: 'Address', key: 'address', icon: <Home size={18} color="#94a3b8" /> },
                            ].map((field) => (
                                <div key={field.key}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>{field.label} *</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#334155', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        {field.icon}
                                        <input
                                            style={{ backgroundColor: 'transparent', flex: 1, outline: 'none', border: 'none', fontSize: '14px', color: 'white' }}
                                            value={(orderForm as any)[field.key]}
                                            onChange={e => setOrderForm({ ...orderForm, [field.key]: e.target.value })}
                                            placeholder={`Enter ${field.label}`}
                                        />
                                    </div>
                                </div>
                            ))}

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>City *</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#334155', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <MapPin size={18} color="#94a3b8" />
                                        <input
                                            style={{ backgroundColor: 'transparent', flex: 1, outline: 'none', border: 'none', fontSize: '14px', color: 'white' }}
                                            value={orderForm.city}
                                            onChange={e => setOrderForm({ ...orderForm, city: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>Pincode *</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#334155', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <input
                                            style={{ backgroundColor: 'transparent', flex: 1, outline: 'none', border: 'none', fontSize: '14px', color: 'white' }}
                                            value={orderForm.pincode}
                                            onChange={e => setOrderForm({ ...orderForm, pincode: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>Mobile *</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#334155', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Phone size={18} color="#94a3b8" />
                                    <input
                                        style={{ backgroundColor: 'transparent', flex: 1, outline: 'none', border: 'none', fontSize: '14px', color: 'white' }}
                                        value={orderForm.mobile}
                                        onChange={e => setOrderForm({ ...orderForm, mobile: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleOrderCard}
                                disabled={isOrderLoading}
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(to right, #20dbd8, #50d5b7)',
                                    color: '#0f172a',
                                    padding: '16px',
                                    borderRadius: '14px',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    marginTop: '8px',
                                    border: 'none',
                                    cursor: isOrderLoading ? 'not-allowed' : 'pointer',
                                    opacity: isOrderLoading ? 0.7 : 1,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                }}
                            >
                                {isOrderLoading ? 'Processing...' : 'Place Order Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal (Themed) */}
            {showShareModal && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{ backgroundColor: '#1e293b', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '320px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px', margin: 0, color: 'white' }}>Share via</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px', marginBottom: '24px' }}>
                            {[
                                {
                                    name: 'WhatsApp',
                                    color: '#25D366',
                                    icon: <MessageCircle size={24} />,
                                    action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out my EV verified profile: ${window.location.origin}/profile/${user.id}`)}`, '_blank')
                                },
                                {
                                    name: 'Instagram',
                                    color: '#E4405F',
                                    icon: <Instagram size={24} />, // direct sharing not supported via web url usually, but we can open instagram
                                    action: () => window.open('https://instagram.com', '_blank')
                                },
                                {
                                    name: 'Facebook',
                                    color: '#1877F2',
                                    icon: <Facebook size={24} />,
                                    action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/profile/${user.id}`)}`, '_blank')
                                },
                            ].map(app => (
                                <button key={app.name} onClick={app.action} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: app.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)' }}>
                                        {app.icon}
                                    </div>
                                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8' }}>{app.name}</span>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setShowShareModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontWeight: 500, cursor: 'pointer', padding: '8px 16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)' }}>Close</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default IDCardPage;
