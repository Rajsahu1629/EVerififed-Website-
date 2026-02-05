import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import type { Job, User } from '../services/api';

const PreviousJobsPage: React.FC = () => {
    const { recruiter } = useAuth();
    const { t } = useLanguage();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [applicants, setApplicants] = useState<User[]>([]);
    const [showApplicants, setShowApplicants] = useState(false);

    useEffect(() => {
        if (recruiter?.id) {
            api.getRecruiterJobs(recruiter.id)
                .then(setJobs)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [recruiter]);

    const handleViewApplicants = async (job: Job) => {
        setSelectedJob(job);
        setShowApplicants(true);
        try {
            const appList = await api.getJobApplicants(job.id);
            setApplicants(appList);
        } catch (error) {
            console.error('Error loading applicants:', error);
            setApplicants([]);
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            approved: 'badge-success',
            pending: 'badge-warning',
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
                <h1>{t('previousJobPosts')}</h1>
                <Link to="/post-job" className="btn btn-primary">{t('postNewJob')}</Link>
            </div>

            {jobs.length === 0 ? (
                <div className="text-center" style={{ padding: '60px 0' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                    <h3 className="text-gray">{t('noDataAvailable')}</h3>
                    <p className="text-gray mb-4">You haven't posted any jobs yet.</p>
                    <Link to="/post-job" className="btn btn-primary">{t('postNewJob')}</Link>
                </div>
            ) : (
                <div className="grid grid-2">
                    {jobs.map((job) => (
                        <div key={job.id} className="card">
                            <div className="flex justify-between items-start mb-3">
                                <h3>{job.role_required}</h3>
                                {getStatusBadge(job.status)}
                            </div>
                            <p className="text-gray mb-2">🏷️ {job.brand}</p>

                            <div className="text-gray text-sm mb-3">
                                <div>📍 {job.city} ({job.pincode})</div>
                                <div>👥 {job.number_of_people} positions</div>
                                <div>💼 {job.experience}</div>
                                <div>💰 ₹{job.salary_min?.toLocaleString()} - ₹{job.salary_max?.toLocaleString()}/mo</div>
                            </div>

                            <div className="text-primary mb-3" style={{ fontWeight: 600 }}>
                                {job.application_count || 0} Applications
                            </div>

                            <button
                                className="btn btn-outline"
                                style={{ width: '100%' }}
                                onClick={() => handleViewApplicants(job)}
                            >
                                View Applicants
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Applicants Modal */}
            {showApplicants && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px',
                    }}
                    onClick={() => setShowApplicants(false)}
                >
                    <div
                        className="glass-card"
                        style={{ maxWidth: '600px', maxHeight: '80vh', overflow: 'auto', width: '100%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2>Applicants for {selectedJob?.role_required}</h2>
                            <button className="btn btn-secondary" onClick={() => setShowApplicants(false)}>✕</button>
                        </div>

                        {applicants.length === 0 ? (
                            <p className="text-gray text-center">No applicants yet</p>
                        ) : (
                            <div className="grid gap-3">
                                {applicants.map((user) => (
                                    <div key={user.id} className="card">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4>{user.fullName || user.full_name || 'Unknown'}</h4>
                                                <p className="text-gray text-sm">📞 {user.phoneNumber || user.phone_number}</p>
                                                <p className="text-gray text-sm">💼 {user.experience || 'Not specified'}</p>
                                            </div>
                                            <span className={`badge ${user.verificationStatus === 'verified' || user.verification_status === 'verified' ? 'badge-success' : 'badge-warning'}`}>
                                                {user.verificationStatus || user.verification_status || 'pending'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PreviousJobsPage;
