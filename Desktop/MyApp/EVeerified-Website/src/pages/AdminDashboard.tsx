import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import type { AdminStats, User } from '../services/api';
import { Package, MapPin, Phone, Briefcase, User as UserIcon, CheckCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const { logout } = useAuth();
    const { t } = useLanguage();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [cardOrders, setCardOrders] = useState<User[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        api.getAdminStats().then(setStats).catch(console.error);
        api.getCardOrders()
            .then(setCardOrders)
            .catch((err) => {
                console.error('Card orders not available:', err);
                setCardOrders([]);
            })
            .finally(() => setLoadingOrders(false));
    }, []);

    return (
        <div className="container" style={{ padding: '60px 20px' }}>
            <div className="flex justify-between items-center mb-6">
                <h1>{t('adminDashboard')}</h1>
                <button className="btn btn-secondary" onClick={logout}>{t('logout')}</button>
            </div>

            {/* Stats */}
            <div className="grid grid-4 mb-6">
                <div className="stats-card">
                    <div className="stats-value">{stats?.totalCandidates || 0}</div>
                    <div className="stats-label">{t('totalCandidates')}</div>
                </div>

                <div className="stats-card">
                    <div className="stats-value">{stats?.verifiedCandidates || 0}</div>
                    <div className="stats-label">{t('verifiedCandidates')}</div>
                </div>

                <div className="stats-card">
                    <div className="stats-value">{stats?.totalRecruiters || 0}</div>
                    <div className="stats-label">{t('totalRecruiters')}</div>
                </div>

                <div className="stats-card">
                    <div className="stats-value">{stats?.pendingJobs || 0}</div>
                    <div className="stats-label">{t('pendingJobs')}</div>
                </div>
            </div>

            {/* Quick Actions */}
            <h2 className="mb-4">Quick Actions</h2>
            <div className="grid grid-3 mb-6">
                <Link to="/admin-job-approval" className="card" style={{ cursor: 'pointer' }}>
                    <h3>📝 Job Approvals</h3>
                    <p className="text-gray">Review and approve job posts</p>
                </Link>

                <Link to="/admin-verification" className="card" style={{ cursor: 'pointer' }}>
                    <h3>✓ User Verification</h3>
                    <p className="text-gray">Verify user credentials</p>
                </Link>

                <Link to="/candidate-search" className="card" style={{ cursor: 'pointer' }}>
                    <h3>🔍 {t('searchCandidates')}</h3>
                    <p className="text-gray">Find verified professionals</p>
                </Link>
            </div>

            {/* Physical Card Orders Section */}
            <div style={{ marginTop: '2rem' }}>
                <div className="flex justify-between items-center mb-4">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Package size={24} color="#10b981" /> Physical Card Orders
                    </h2>
                    <span className="badge" style={{ background: '#dcfce7', color: '#166534', padding: '6px 12px', fontSize: '0.9rem' }}>
                        {cardOrders.length} Orders
                    </span>
                </div>

                {loadingOrders ? (
                    <div className="text-center" style={{ padding: '40px' }}>
                        <div className="loading-spinner"></div>
                    </div>
                ) : cardOrders.length === 0 ? (
                    <div className="card text-center" style={{ padding: '40px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                        <p className="text-gray">No physical card orders yet</p>
                    </div>
                ) : (
                    <div className="grid grid-2" style={{ gap: '1rem' }}>
                        {cardOrders.map((user) => (
                            <div key={user.id} className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            background: '#ecfdf5', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', color: '#10b981'
                                        }}>
                                            <UserIcon size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1rem' }}>{user.fullName || user.full_name || 'Unknown'}</h4>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>ID: #{user.id}</span>
                                        </div>
                                    </div>
                                    <div style={{
                                        background: user.is_admin_verified ? '#dcfce7' : '#fef3c7',
                                        color: user.is_admin_verified ? '#166534' : '#92400e',
                                        padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700,
                                        display: 'flex', alignItems: 'center', gap: '4px'
                                    }}>
                                        <CheckCircle size={12} />
                                        {user.is_admin_verified ? 'VERIFIED' : 'TEST PASSED'}
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                                        <Phone size={14} color="#10b981" />
                                        <span>{user.phoneNumber || user.phone_number || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                                        <Briefcase size={14} color="#10b981" />
                                        <span>{user.role || 'N/A'} {user.domain ? `(${user.domain})` : ''}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                                        <MapPin size={14} color="#10b981" />
                                        <span>{user.city || 'N/A'}, {user.state || ''}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                                        📮 <span>{user.pincode || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Full Address / Delivery Info */}
                                <div style={{
                                    marginTop: '12px', padding: '10px', background: '#f8fafc',
                                    borderRadius: '8px', border: '1px solid #e2e8f0'
                                }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                                        📦 Delivery Details
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                                        {user.fullName || user.full_name}, {user.city || 'City N/A'}, {user.state || 'State N/A'} - {user.pincode || 'Pincode N/A'}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '4px' }}>
                                        📞 {user.phoneNumber || user.phone_number || 'N/A'}
                                    </div>
                                </div>

                                {/* Qualification & Experience */}
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                                    {user.qualification && (
                                        <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                            🎓 {user.qualification}
                                        </span>
                                    )}
                                    {user.experience && (
                                        <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                            💼 {user.experience} Exp
                                        </span>
                                    )}
                                    {user.vehicle_category && (
                                        <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                            🏍️ {user.vehicle_category}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
