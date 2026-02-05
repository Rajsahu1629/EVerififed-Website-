import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import type { Job } from '../services/api';

const AdminJobApprovalPage: React.FC = () => {
    const { t } = useLanguage();
    const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPendingJobs();
    }, []);

    const loadPendingJobs = async () => {
        try {
            const jobs = await api.getPendingJobs();
            setPendingJobs(jobs);
        } catch (error) {
            console.error('Error loading pending jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (jobId: number) => {
        try {
            await api.approveJob(jobId);
            setPendingJobs(pendingJobs.filter((j) => j.id !== jobId));
            alert('Job approved successfully!');
        } catch (error) {
            alert('Failed to approve job');
        }
    };

    const handleReject = async (jobId: number) => {
        if (!confirm('Are you sure you want to reject this job?')) return;
        try {
            await api.rejectJob(jobId);
            setPendingJobs(pendingJobs.filter((j) => j.id !== jobId));
            alert('Job rejected');
        } catch (error) {
            alert('Failed to reject job');
        }
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
            <h1 className="mb-6">Job Approvals</h1>
            <p className="text-gray mb-6">{pendingJobs.length} jobs pending approval</p>

            {pendingJobs.length === 0 ? (
                <div className="text-center" style={{ padding: '60px 0' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                    <h3 className="text-gray">No pending jobs</h3>
                    <p className="text-gray">All job posts have been reviewed.</p>
                </div>
            ) : (
                <div className="grid grid-2">
                    {pendingJobs.map((job) => (
                        <div key={job.id} className="card">
                            <div className="flex justify-between items-start mb-3">
                                <h3>{job.role_required}</h3>
                                <span className="badge badge-warning">Pending</span>
                            </div>
                            <p className="text-gray mb-2">{job.company_name || 'Unknown Company'}</p>

                            <div className="text-gray text-sm mb-3">
                                <div>🏷️ Brand: {job.brand}</div>
                                <div>📍 {job.city} ({job.pincode})</div>
                                <div>👥 {job.number_of_people} positions</div>
                                <div>💼 {job.experience}</div>
                                <div>💰 ₹{job.salary_min?.toLocaleString()} - ₹{job.salary_max?.toLocaleString()}/mo</div>
                            </div>

                            {job.job_description && (
                                <p className="text-sm mb-3" style={{ opacity: 0.7 }}>
                                    {job.job_description.substring(0, 100)}...
                                </p>
                            )}

                            <div className="flex gap-3 mt-4">
                                <button className="btn btn-success" style={{ flex: 1 }} onClick={() => handleApprove(job.id)}>
                                    ✓ {t('approve')}
                                </button>
                                <button className="btn btn-danger" onClick={() => handleReject(job.id)}>
                                    ✗ {t('reject')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminJobApprovalPage;
