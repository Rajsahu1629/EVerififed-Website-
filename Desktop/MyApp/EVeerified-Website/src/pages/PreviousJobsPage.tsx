import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import type { Job, User } from '../services/api';
import { CheckCircle, Clock } from 'lucide-react';

const PreviousJobsPage: React.FC = () => {
    const { recruiter } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
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

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'approved':
                return { text: 'Live', color: '#10b981', bgColor: '#d1fae5' };
            case 'pending':
                return { text: 'Pending Approval', color: '#f59e0b', bgColor: '#fef3c7' };
            case 'rejected':
                return { text: 'Rejected', color: '#ef4444', bgColor: '#fee2e2' };
            case 'profiles_sent':
                return { text: 'Profiles Sent', color: '#8b5cf6', bgColor: '#ede9fe' };
            case 'trial_booked':
                return { text: 'Trial Booked', color: '#10b981', bgColor: '#d1fae5' };
            default:
                return { text: 'Draft', color: '#6b7280', bgColor: '#f3f4f6' };
        }
    };

    const formatSalary = (min: number, max: number) => {
        const formatK = (n: number) => n >= 1000 ? `${Math.round(n / 1000)}K` : n.toString();
        if (!min && !max) return 'Negotiable';
        if (min && max) return `₹ ${formatK(min)} - ₹ ${formatK(max)} per month`;
        if (min) return `₹ ${formatK(min)}+ per month`;
        return `Up to ₹ ${formatK(max)} per month`;
    };

    const getTimeAgo = (dateStr?: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    // Status Badge Logic
    const getVerificationBadge = (user: User) => {
        // 1. Admin Verified (Green)
        if (user.is_admin_verified) {
            return (
                <div style={{ background: '#10b981', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={10} fill="white" color="#10b981" />
                    VERIFIED
                </div>
            );
        }

        // 2. Test Passed (Yellow)
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

        // 3. Pending (Orange)
        return (
            <div style={{ background: '#f97316', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={10} fill="white" color="#f97316" />
                PENDING
            </div>
        );
    };

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
                    {jobs.map((job) => {
                        const statusConfig = getStatusConfig(job.status);
                        const isNew = job.created_at ? new Date(job.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : false;

                        return (
                            <div key={job.id} className="card" style={{ position: 'relative', paddingBottom: '20px', overflow: 'hidden', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '8px' }}>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <h3 style={{ margin: 0, color: '#1e40af', fontSize: '1rem', wordBreak: 'break-word' }}>{job.role_required} {job.vehicle_category ? `(${job.vehicle_category})` : ''}</h3>
                                        {job.training_role && <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 500 }}>{job.training_role}</div>}
                                        <div className="text-gray" style={{ fontSize: '0.85rem', marginTop: '2px' }}>{job.brand}</div>
                                    </div>
                                    {job.status !== 'approved' && job.status !== 'profiles_sent' && job.status !== 'trial_booked' && (
                                        <button
                                            onClick={() => navigate(`/post-job?edit=true&jobId=${job.id}`, { state: { job } })}
                                            className="btn btn-sm btn-outline"
                                            style={{ padding: '0.15rem 0.4rem', flexShrink: 0, fontSize: '0.75rem', cursor: 'pointer' }}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>

                                <div className="text-success" style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    {formatSalary(job.salary_min, job.salary_max)}
                                </div>

                                <div className="text-gray" style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                                    📍 {job.city || 'Location TBD'} {job.pincode ? `(${job.pincode})` : ''}
                                </div>

                                {/* Tags Row */}
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                    {isNew && (
                                        <span style={{ backgroundColor: '#dbeafe', color: '#2563eb', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, whiteSpace: 'nowrap' }}>⚡ NEW</span>
                                    )}
                                    <span style={{ backgroundColor: '#f3f4f6', color: '#6b7280', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                        {job.urgency === 'immediate' ? 'URGENT' : 'REGULAR'}
                                    </span>
                                    <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                        {job.number_of_people} VACANCIES
                                    </span>
                                    {job.has_incentive && (
                                        <span style={{ backgroundColor: '#d1fae5', color: '#059669', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, whiteSpace: 'nowrap' }}>INCENTIVE</span>
                                    )}
                                    {job.stay_provided && (
                                        <span style={{ backgroundColor: '#ede9fe', color: '#7c3aed', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, whiteSpace: 'nowrap' }}>STAY</span>
                                    )}
                                    <span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                        {job.experience === 'fresher' ? 'FRESHER' : `${job.experience} YEARS`}
                                    </span>
                                </div>

                                <hr style={{ borderColor: '#e2e8f0', margin: '0.5rem 0' }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <button
                                        className="btn-text text-primary"
                                        onClick={() => handleViewApplicants(job)}
                                        style={{ textDecoration: 'underline', padding: 0, fontSize: '0.85rem' }}
                                    >
                                        👥 {job.application_count || 0} Applicants
                                    </button>
                                    <span style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color, padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                        {statusConfig.text.toUpperCase()}
                                    </span>
                                </div>

                                {/* Workflow Tracker */}
                                <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px' }}>Job Work Flow</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: '#64748b' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 3px', fontSize: '10px' }}>✓</div>
                                            Posted
                                        </div>
                                        <div style={{ flex: 1, height: '2px', background: job.status !== 'pending' ? '#10b981' : '#e2e8f0', margin: '0 3px', marginTop: '-12px' }}></div>

                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: job.status === 'pending' ? '#fde68a' : (job.status === 'rejected' ? '#fecaca' : '#10b981'), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 3px', fontSize: '10px' }}>
                                                {job.status === 'pending' ? '⏳' : (job.status === 'rejected' ? '✕' : '✓')}
                                            </div>
                                            {job.status === 'rejected' ? 'Rejected' : 'Approved'}
                                        </div>
                                        <div style={{ flex: 1, height: '2px', background: (job.status !== 'pending' && job.status !== 'rejected') ? '#10b981' : '#e2e8f0', margin: '0 3px', marginTop: '-12px' }}></div>

                                        <div style={{ textAlign: 'center', opacity: (job.status === 'approved' || job.status === 'profiles_sent' || job.status === 'trial_booked') ? 1 : 0.5 }}>
                                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: (job.status === 'approved' || job.status === 'profiles_sent' || job.status === 'trial_booked') ? '#10b981' : '#e2e8f0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 3px', fontSize: '10px' }}>
                                                {(job.status === 'approved' || job.status === 'profiles_sent' || job.status === 'trial_booked') ? '✓' : '⚡'}
                                            </div>
                                            Live
                                        </div>
                                        <div style={{ flex: 1, height: '2px', background: (job.status === 'profiles_sent' || job.status === 'trial_booked') ? '#10b981' : '#e2e8f0', margin: '0 3px', marginTop: '-12px' }}></div>

                                        <div style={{ textAlign: 'center', opacity: (job.status === 'profiles_sent' || job.status === 'trial_booked') ? 1 : 0.5 }}>
                                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: (job.status === 'profiles_sent' || job.status === 'trial_booked') ? '#10b981' : '#e2e8f0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 3px', fontSize: '10px' }}>
                                                {(job.status === 'profiles_sent' || job.status === 'trial_booked') ? '✓' : '📋'}
                                            </div>
                                            Profiles
                                        </div>
                                    </div>
                                </div>

                                <div className="text-gray" style={{ fontSize: '0.7rem', marginTop: '0.5rem' }}>
                                    📅 Posted {getTimeAgo(job.created_at)}
                                </div>
                            </div>
                        );
                    })}
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
                                    <div key={user.id} className="card" style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{user.fullName || user.full_name || 'Unknown'}</h4>
                                                <div style={{ fontSize: '14px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span>📞 {user.phoneNumber ? `XXXXXX${user.phoneNumber.slice(-4)}` : (user.phone_number ? `XXXXXX${user.phone_number.toString().slice(-4)}` : 'N/A')}</span>
                                                    <span>💼 {user.experience || 'Experience not specified'}</span>
                                                    {(user.current_salary || user.currentSalary) && (
                                                        <span>💰 Current Salary: {user.current_salary || user.currentSalary}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ flexShrink: 0 }}>
                                                {getVerificationBadge(user)}
                                            </div>
                                        </div>
                                        <a
                                            href={`https://wa.me/919473928468?text=${encodeURIComponent(
                                                `Hi, I'm interested in connecting with candidate:\n` +
                                                `Name: ${user.fullName || user.full_name || 'N/A'}\n` +
                                                `Role: ${user.role || 'N/A'}\n` +
                                                `Experience: ${user.experience || 'N/A'}\n` +
                                                `City: ${user.city || 'N/A'}\n` +
                                                `For Job: ${selectedJob?.role_required || 'N/A'} (${selectedJob?.brand || ''})`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                marginTop: '12px', padding: '10px', borderRadius: '8px',
                                                background: '#10b981', color: 'white', textDecoration: 'none',
                                                fontWeight: 600, fontSize: '14px', width: '100%'
                                            }}
                                        >
                                            💬 Connect with Admin
                                        </a>
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
