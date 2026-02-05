import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import type { Job } from '../services/api';

const RecruiterDashboard: React.FC = () => {
    const { recruiter, logout } = useAuth();
    const { t } = useLanguage();
    const [stats, setStats] = useState({ totalJobs: 0, pendingJobs: 0, totalApplications: 0 });

    useEffect(() => {
        if (recruiter?.id) {
            api.getRecruiterJobs(recruiter.id).then((jobs: Job[]) => {
                setStats({
                    totalJobs: jobs.length,
                    pendingJobs: jobs.filter((j) => j.status === 'pending').length,
                    totalApplications: jobs.reduce((sum, j) => sum + (j.application_count || 0), 0),
                });
            }).catch(console.error);
        }
    }, [recruiter]);

    const companyName = recruiter?.companyName || recruiter?.company_name || 'Company';

    return (
        <div className="container" style={{ padding: '60px 20px' }}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1>{t('welcome')}, {companyName}!</h1>
                    <p className="text-gray">{t('recruiter')} {t('dashboard')}</p>
                </div>
                <button className="btn btn-secondary" onClick={logout}>{t('logout')}</button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-3 mb-6">
                <Link to="/post-job" className="card text-center" style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>➕</div>
                    <h3>{t('postNewJob')}</h3>
                    <p className="text-gray text-sm">Create new job listing</p>
                </Link>

                <Link to="/previous-jobs" className="card text-center" style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
                    <h3>{t('previousJobPosts')}</h3>
                    <p className="text-gray text-sm">Manage your listings</p>
                </Link>

                <Link to="/candidate-search" className="card text-center" style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
                    <h3>{t('searchCandidates')}</h3>
                    <p className="text-gray text-sm">Find verified talent</p>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-3">
                <div className="stats-card">
                    <div className="stats-value">{stats.totalJobs}</div>
                    <div className="stats-label">Total Job Posts</div>
                </div>

                <div className="stats-card">
                    <div className="stats-value">{stats.pendingJobs}</div>
                    <div className="stats-label">Pending Approval</div>
                </div>

                <div className="stats-card">
                    <div className="stats-value">{stats.totalApplications}</div>
                    <div className="stats-label">Total Applications</div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
