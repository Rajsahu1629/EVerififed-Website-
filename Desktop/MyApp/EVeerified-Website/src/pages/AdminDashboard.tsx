import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import type { AdminStats } from '../services/api';

const AdminDashboard: React.FC = () => {
    const { logout } = useAuth();
    const { t } = useLanguage();
    const [stats, setStats] = useState<AdminStats | null>(null);

    useEffect(() => {
        api.getAdminStats().then(setStats).catch(console.error);
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
            <div className="grid grid-3">
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
        </div>
    );
};

export default AdminDashboard;
