import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';

const UserDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const [appliedCount, setAppliedCount] = useState(0);

    useEffect(() => {
        if (user?.id) {
            api.getUserApplications(user.id).then((apps) => setAppliedCount(apps.length)).catch(console.error);
        }
    }, [user]);

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'verified': return 'success';
            case 'approved': return 'success';
            case 'rejected': return 'error';
            default: return 'warning';
        }
    };

    const displayName = user?.fullName || user?.full_name || 'User';
    const status = user?.verificationStatus || user?.verification_status || 'pending';

    return (
        <div className="container" style={{ padding: '60px 20px' }}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1>{t('welcome')}, {displayName}!</h1>
                    <p className="text-gray">
                        {t('verificationStatus')}:
                        <span className={`badge badge-${getStatusColor(status)} ml-2`}>{status}</span>
                    </p>
                </div>
                <button className="btn btn-secondary" onClick={logout}>{t('logout')}</button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-3 mb-6">
                <Link to="/jobs" className="card text-center" style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💼</div>
                    <h3>{t('jobs')}</h3>
                    <p className="text-gray text-sm">Find EV job opportunities</p>
                </Link>

                <Link to="/skill-verification" className="card text-center" style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✓</div>
                    <h3>{t('skillVerification')}</h3>
                    <p className="text-gray text-sm">Take verification quiz</p>
                </Link>

                <Link to="/id-card" className="card text-center" style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎫</div>
                    <h3>{t('idCard')}</h3>
                    <p className="text-gray text-sm">View your digital ID</p>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-3">
                <div className="stats-card">
                    <div className="stats-value">
                        {user?.quizScore || user?.quiz_score || '--'}/{user?.totalQuestions || user?.total_questions || '--'}
                    </div>
                    <div className="stats-label">Quiz Score</div>
                </div>

                <div className="stats-card">
                    <div className="stats-value">{appliedCount}</div>
                    <div className="stats-label">{t('appliedJobs')}</div>
                </div>

                <div className="stats-card">
                    <div className="stats-value">{user?.experience || '--'}</div>
                    <div className="stats-label">{t('experience')}</div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
