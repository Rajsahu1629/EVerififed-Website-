import React from 'react';
import type { Job } from '../services/api';

interface JobCardProps {
    job: Job;
    isApplied: boolean;
    onApply: (jobId: number) => void;
    isLoggedIn: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, isApplied, onApply, isLoggedIn }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="card">
            <div className="mb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <h3>{job.brand}</h3>
                <p className="text-gray text-sm">{job.company_name}</p>
            </div>

            <div className="mb-4">
                <div className="mb-2"><strong>Role:</strong> {job.role_required}</div>
                <div className="mb-2"><strong>Experience:</strong> {job.experience || 'Not specified'}</div>
                <div className="mb-2">
                    <strong>Salary:</strong> {formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}
                </div>
                <div className="mb-2"><strong>Location:</strong> {job.city}, {job.pincode}</div>

                <div className="flex gap-2 mt-4">
                    {job.has_incentive && <span className="badge badge-success">Incentive</span>}
                    {job.stay_provided && <span className="badge badge-info">Stay Provided</span>}
                </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                {isApplied ? (
                    <button className="btn btn-secondary" disabled style={{ width: '100%' }}>
                        Applied ✓
                    </button>
                ) : (
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        onClick={() => isLoggedIn ? onApply(job.id) : window.location.href = '/auth'}
                    >
                        Apply Now
                    </button>
                )}
            </div>
        </div>
    );
};

export default JobCard;
