import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';

const UserDashboard: React.FC = () => {
    const { user, updateUser, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [appliedCount, setAppliedCount] = useState(0);

    useEffect(() => {
        if (user?.id) {
            api.getUserApplications(user.id).then((apps) => setAppliedCount(apps.length)).catch(console.error);

            // Fetch fresh user data to get accurate verification status + timestamps
            api.getUser(user.id).then((freshUser) => {
                if (freshUser) {
                    updateUser({ ...user, ...freshUser });
                }
            }).catch(console.error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'verified': return 'success';
            case 'approved': return 'success';
            case 'rejected': return 'error';
            case 'failed': return 'error';
            default: return 'warning';
        }
    };

    const displayName = user?.fullName || user?.full_name || 'User';
    const status = user?.verificationStatus || user?.verification_status || 'pending';

    // Cooldown logic
    const isVerified = status === 'verified' || status === 'approved';
    let isInCooldown = false;
    let cooldownDaysRemaining = 0;

    if (status === 'failed') {
        const failedAt = user?.quizFailedAt || user?.quiz_failed_at;
        if (failedAt) {
            const lastFailedDate = new Date(failedAt);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - lastFailedDate.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays < 7) {
                isInCooldown = true;
                cooldownDaysRemaining = 7 - diffDays;
            }
        }
    }

    const isVerificationDisabled = isVerified || isInCooldown;

    const handleVerificationClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isVerified) {
            alert('You are already verified!');
            navigate('/id-card');
        } else if (isInCooldown) {
            alert(`You are in a cooling period. Please try again in ${cooldownDaysRemaining} day(s).`);
        } else {
            navigate('/skill-verification');
        }
    };

    return (
        <div className="container" style={{ padding: '60px 20px' }}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1>{t('welcome')}, {displayName}!</h1>
                    <p className="text-gray" style={{ fontSize: '1.1rem', marginTop: '4px' }}>
                        {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
                        {user?.domain ? ` of ${user.domain}` : ''}
                    </p>
                    <p className="text-gray" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
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

                <div
                    className="card text-center"
                    onClick={handleVerificationClick}
                    style={{
                        cursor: isVerificationDisabled ? 'not-allowed' : 'pointer',
                        opacity: isVerificationDisabled ? 0.5 : 1,
                        position: 'relative',
                    }}
                >
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                        {isVerified ? '✅' : isInCooldown ? '🔒' : '✓'}
                    </div>
                    <h3 style={{ color: isInCooldown ? '#ef4444' : isVerified ? '#10b981' : undefined }}>
                        {t('skillVerification')}
                    </h3>
                    <p className="text-gray text-sm">
                        {isVerified
                            ? 'Already Verified!'
                            : isInCooldown
                                ? `Cooldown: ${cooldownDaysRemaining} day(s) left`
                                : 'Take verification quiz'}
                    </p>
                </div>

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

                <Link to="/applied-jobs" className="stats-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div className="stats-value">{appliedCount}</div>
                    <div className="stats-label">{t('appliedJobs')}</div>
                </Link>

                <div className="stats-card">
                    <div className="stats-value">{user?.experience || '--'}</div>
                    <div className="stats-label">{t('experience')}</div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
