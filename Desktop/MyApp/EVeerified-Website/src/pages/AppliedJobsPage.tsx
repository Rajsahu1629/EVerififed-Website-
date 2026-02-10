import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import type { Application } from '../services/api';

const AppliedJobsPage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            api.getUserApplications(user.id)
                .then(setApplications)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [user]);

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            applied: 'badge-info',
            shortlisted: 'badge-success',
            interview: 'badge-warning',
            hired: 'badge-success',
            rejected: 'badge-error',
        };
        return <span className={`badge ${colors[status] || 'badge-secondary'}`}>{status}</span>;
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '60px 20px' }}>
            <div className="flex justify-between items-center mb-6">
                <h1>{t('appliedJobs')}</h1>
                <Link to="/jobs" className="btn btn-primary">{t('browseJobs')}</Link>
            </div>

            {applications.length === 0 ? (
                <div className="text-center" style={{ padding: '60px 0' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
                    <h3 className="text-gray">{t('noDataAvailable')}</h3>
                    <p className="text-gray mb-4">You haven't applied to any jobs yet.</p>
                    <Link to="/jobs" className="btn btn-primary">{t('browseJobs')}</Link>
                </div>
            ) : (
                <div className="grid grid-2">
                    {applications.map((app) => (
                        <div key={app.id} className="card">
                            <div className="flex justify-between items-start mb-3">
                                <h3>{app.role_required || 'Position'}</h3>
                                {getStatusBadge(app.status)}
                            </div>
                            <p className="text-gray mb-2">{app.company_name ? `${app.company_name.substring(0, 2)}****` : 'Company'}</p>
                            <div className="text-gray text-sm mb-3">
                                <span>📍 {app.city || 'Location'}</span>
                                {app.brand && <span className="ml-3">🏷️ {app.brand}</span>}
                            </div>

                            {/* Application Timeline */}
                            <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                                    {/* Progress Bar Background */}
                                    <div style={{ position: 'absolute', top: '12px', left: '0', right: '0', height: '2px', background: 'var(--border-color)', zIndex: 0 }}></div>

                                    {/* Steps */}
                                    {['applied', 'shortlisted', 'interview', 'hired'].map((step, index) => {
                                        const steps = ['applied', 'shortlisted', 'interview', 'hired'];
                                        const currentStatusIndex = steps.indexOf(app.status.toLowerCase());
                                        const isCompleted = currentStatusIndex >= index;
                                        const isCurrent = currentStatusIndex === index;
                                        const isRejected = app.status.toLowerCase() === 'rejected';

                                        let stepColor = 'var(--border-color)';

                                        if (isRejected) {
                                            if (index === 0) stepColor = 'var(--error)';
                                            else stepColor = 'var(--border-color)';
                                        } else if (isCompleted) {
                                            stepColor = 'var(--primary)';
                                        }

                                        // Special handling for 'applied' step - text only
                                        if (step === 'applied') {
                                            return (
                                                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative', flex: 1 }}>
                                                    <div style={{ background: 'var(--bg-card)', padding: '0 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        {isCompleted && <div style={{ color: 'var(--primary)', marginBottom: '4px' }}><Check size={16} /></div>}
                                                        <span style={{ fontSize: '0.875rem', color: isCompleted ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 600, textTransform: 'capitalize' }}>
                                                            {step}
                                                        </span>
                                                    </div>
                                                    {app.created_at && (
                                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                            {new Date(app.created_at).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative', flex: 1 }}>
                                                <div style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    background: 'var(--bg-card)',
                                                    border: `2px solid ${stepColor}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    {isCompleted && !isRejected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
                                                    {isRejected && index <= currentStatusIndex && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--error)' }}></div>}
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isCurrent ? 600 : 400, textTransform: 'capitalize' }}>
                                                    {step}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                {app.status.toLowerCase() === 'rejected' && (
                                    <div style={{ marginTop: '0.5rem', textAlign: 'center', color: 'var(--error)', fontSize: '0.875rem' }}>
                                        Application Rejected
                                    </div>
                                )}
                            </div>

                            {/* Additional Job Details */}
                            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                <div className="grid grid-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray">Experience:</span> {app.experience || 'Not specified'}
                                    </div>
                                    <div>
                                        <span className="text-gray">Posted:</span> {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recently'}
                                    </div>
                                </div>
                                {app.job_description && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <p className="text-gray text-sm line-clamp-2">{app.job_description}</p>
                                    </div>
                                )}
                            </div>
                            {app.salary_min && app.salary_max && (
                                <div className="text-primary" style={{ fontWeight: 600 }}>
                                    ₹{app.salary_min.toLocaleString()} - ₹{app.salary_max.toLocaleString()}/month
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AppliedJobsPage;
