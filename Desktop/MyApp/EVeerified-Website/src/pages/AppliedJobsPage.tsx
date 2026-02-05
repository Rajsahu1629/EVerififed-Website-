import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
                            <p className="text-gray mb-2">{app.company_name || 'Company'}</p>
                            <div className="text-gray text-sm mb-3">
                                <span>📍 {app.city || 'Location'}</span>
                                {app.brand && <span className="ml-3">🏷️ {app.brand}</span>}
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
