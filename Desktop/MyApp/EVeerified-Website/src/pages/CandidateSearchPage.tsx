import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { User } from '../services/api';
import { Search, MapPin, Briefcase, Phone, IndianRupee, CheckCircle, MessageCircle, Clock } from 'lucide-react';

const CandidateSearchPage: React.FC = () => {
    // const { t } = useLanguage(); // Unused
    const [candidates, setCandidates] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    // const [searched, setSearched] = useState(false); // Unused logic simplified

    // Filters matching the screenshot
    const [selectedRole, setSelectedRole] = useState('All');
    const [onlyVerified, setOnlyVerified] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const roleFilters = ['All', 'Technician', 'Showroom', 'Workshop'];

    // Map UI role names to API values
    const getApiRole = (uiRole: string) => {
        switch (uiRole) {
            case 'Technician': return 'technician';
            case 'Showroom': return 'sales'; // Assuming 'sales' maps to Showroom based on previous context
            case 'Workshop': return 'workshop';
            default: return '';
        }
    };

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            // Construct filters for API
            const apiFilters: any = {};
            if (selectedRole !== 'All') {
                apiFilters.role = getApiRole(selectedRole);
            }
            if (searchQuery) {
                // Assuming backend supports a general 'q' or we map to city/name
                apiFilters.city = searchQuery; // Simple fallback, ideally backend has 'q'
            }
            // For verified toggle, we might filter client-side or send param if API supports
            // The API types don't show a generic 'q' param, so we stick to strict filters or client side filtering for now if API is limited.

            const results = await api.searchCandidates(apiFilters);

            let filtered = results;

            // Client-side filtering for "Only Verified" if API doesn't support it explicitly in searchCandidates
            if (onlyVerified) {
                filtered = results.filter(u =>
                    u.verificationStatus === 'verified' ||
                    u.verificationStatus === 'approved' ||
                    u.is_admin_verified
                );
            }

            // Client-side search for Name/Pincode since API `searchCandidates` mainly takes strict filters
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                filtered = filtered.filter(u =>
                    (u.fullName || u.full_name || '').toLowerCase().includes(q) ||
                    (u.city || '').toLowerCase().includes(q) ||
                    (u.pincode || '').includes(q)
                );
            }

            setCandidates(filtered);
            // setSearched(true); // Removed as state was removed
        } catch (error) {
            console.error('Search failed:', error);
            setCandidates([]);
        } finally {
            setLoading(false);
        }
    };

    // Auto-search on filter change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchCandidates();
        }, 500); // Debounce
        return () => clearTimeout(timeoutId);
    }, [selectedRole, onlyVerified, searchQuery]);

    const getInitials = (name?: string) => {
        return (name || 'U').charAt(0).toUpperCase();
    };

    const maskPhone = (phone?: string) => {
        if (!phone) return 'XXXXXXXXXX';
        return phone.substring(0, 4) + 'XXXXXX';
    };

    // Status Badge Logic matching ID Card
    // Status Badge Logic matching ID Card
    // Status Badge Logic matching ID Card
    const getVerificationBadge = (user: User) => {
        // 1. Admin Verified (Green) - Highest Priority
        if (user.is_admin_verified) {
            return (
                <div style={{ background: '#10b981', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={10} fill="white" color="#10b981" />
                    VERIFIED
                </div>
            );
        }

        // 2. Test Passed (Yellow) - If not admin verified but passed quiz
        // Check both camelCase and snake_case as API might return either
        const status = (user.verificationStatus || user.verification_status || '').toLowerCase();
        const hasPassedTest = status === 'verified' || status === 'approved';

        if (hasPassedTest) {
            return (
                <div style={{ background: '#FFC107', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={10} fill="white" color="#FFC107" />
                    TEST PASSED
                </div>
            );
        }

        // 3. Pending (Orange) - Default
        return (
            <div style={{ background: '#f97316', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={10} fill="white" color="#f97316" />
                PENDING
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{ background: 'white', padding: '20px', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid #e2e8f0' }}>
                <div className="container">
                    <div className="flex items-center gap-4 mb-4">
                        <Link to="/recruiter-dashboard" style={{ textDecoration: 'none', color: '#1e293b', fontSize: '24px' }}>←</Link>
                        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Find Candidates</h1>
                        <div style={{ marginLeft: 'auto', background: '#10b981', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                            {candidates.length}
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search by name, city, pincode..."
                            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f1f5f9', fontSize: '14px', outline: 'none' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter Chips */}
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                        {roleFilters.map(role => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                style={{
                                    padding: '6px 16px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    background: selectedRole === role ? '#10b981' : '#f1f5f9',
                                    color: selectedRole === role ? 'white' : '#64748b'
                                }}
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    {/* Verified Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', cursor: 'pointer' }} onClick={() => setOnlyVerified(!onlyVerified)}>
                        <div style={{
                            width: '20px', height: '20px', borderRadius: '4px',
                            background: onlyVerified ? '#10b981' : 'transparent',
                            border: `2px solid ${onlyVerified ? '#10b981' : '#cbd5e1'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {onlyVerified && <CheckCircle size={14} color="white" />}
                        </div>
                        <span style={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>Show only verified candidates</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container" style={{ padding: '20px' }}>
                {loading ? (
                    <div className="text-center" style={{ padding: '40px' }}>Loading...</div>
                ) : candidates.length === 0 ? (
                    <div className="text-center" style={{ padding: '60px 0', opacity: 0.6 }}>
                        <Search size={48} style={{ margin: '0 auto 16px', color: '#cbd5e1' }} />
                        <p>No candidates found.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {candidates.map(c => {
                            const displayName = c.fullName || c.full_name || 'Candidate';
                            const roleDisplay = c.role === 'technician' ? `EV Technician ${c.vehicle_category ? `(${c.vehicle_category})` : ''}`
                                : c.role === 'sales' ? 'EV Showroom Manager'
                                    : c.role === 'workshop' ? `EV Workshop Manager ${c.vehicle_category ? `(${c.vehicle_category})` : ''}`
                                        : c.role;

                            return (
                                <div key={c.id} style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    {/* Card Header */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '50%',
                                            background: '#10b981', color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '20px', fontWeight: 'bold', flexShrink: 0
                                        }}>
                                            {getInitials(displayName)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>{displayName}</h3>
                                                        {c.is_admin_verified && <CheckCircle size={14} color="#10b981" fill="#d1fae5" />}
                                                    </div>
                                                    <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>{roleDisplay}</p>
                                                </div>
                                                {getVerificationBadge(c)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                                            <MapPin size={16} color="#94a3b8" />
                                            <span>{c.city || 'N/A'} {c.pincode ? `(${c.pincode})` : ''}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                                            <Briefcase size={16} color="#94a3b8" />
                                            <span>{c.experience || 'Fresher'} Experienced</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                                            <Phone size={16} color="#94a3b8" />
                                            <span>{maskPhone(c.phoneNumber || c.phone_number)}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#10b981', fontWeight: 600 }}>
                                            <IndianRupee size={16} color="#10b981" />
                                            <span>{c.current_salary || 'N/A'} Current Monthly Salary</span>
                                        </div>
                                    </div>

                                    {/* Action Btn */}
                                    <button
                                        onClick={() => {
                                            const message = `Hi, I am interested in this candidate:\n\nName: ${displayName}\nRole: ${roleDisplay}\nExperience: ${c.experience || 'Fresher'}\nLocation: ${c.city || 'N/A'}\n\nPlease help me connect.`;
                                            window.open(`https://wa.me/919473928468?text=${encodeURIComponent(message)}`, '_blank');
                                        }}
                                        style={{
                                            width: '100%', background: '#10b981', color: 'white',
                                            border: 'none', padding: '12px', borderRadius: '12px',
                                            fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                        }}
                                    >
                                        <MessageCircle size={18} />
                                        Connect via EVerified
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};



export default CandidateSearchPage;
