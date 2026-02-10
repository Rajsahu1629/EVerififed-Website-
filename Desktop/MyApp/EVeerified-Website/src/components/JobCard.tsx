import React from 'react';
import type { Job } from '../services/api';
import { MapPin, Zap, Clock, Users, Briefcase, Bike, ArrowRight } from 'lucide-react';

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
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            {/* Header: Icon + Details */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                    minWidth: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: '#ecfdf5', // Light green bg
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10b981'
                }}>
                    <Briefcase size={24} />
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#059669', marginBottom: '0.25rem' }}>
                        {job.role_required} {job.vehicle_category ? `(${job.vehicle_category})` : ''}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#0d9488', fontWeight: 500 }}>
                        {job.training_role || 'Technician'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                        {job.brand} • {job.company_name ? `${job.company_name.substring(0, 2)}****` : 'Workshop'}
                    </p>
                </div>
            </div>

            {/* Salary & Location */}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', marginBottom: '0.25rem' }}>
                    {formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)} <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>per month</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                    <MapPin size={16} />
                    {job.city} ({job.pincode})
                </div>
            </div>

            {/* Badges Grid - Flex Content Area */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flex: 1, alignContent: 'flex-start', marginBottom: '1.5rem' }}>
                {/* Status Badge */}
                <span className="badge" style={{ background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px' }}>
                    <Zap size={14} fill="currentColor" /> {job.status === 'open' ? 'New' : job.status}
                </span>

                {/* Job Type Badge (Static for now as API doesn't have it, inferred) */}
                <span className="badge" style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px' }}>
                    <Clock size={14} /> Regular
                </span>

                {/* Vacancies */}
                <span className="badge" style={{ background: '#ffedd5', color: '#9a3412', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px' }}>
                    <Users size={14} /> {job.number_of_people} Vacancies
                </span>

                {/* Experience */}
                <span className="badge" style={{ background: '#fef9c3', color: '#854d0e', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px' }}>
                    <Briefcase size={14} /> {job.experience} Years
                </span>

                {/* Vehicle Category Badge */}
                {job.vehicle_category && (
                    <span className="badge" style={{ background: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px' }}>
                        <Bike size={14} /> {job.vehicle_category}
                    </span>
                )}
            </div>

            {/* Job Description */}
            {job.job_description && (
                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        📝 {job.job_description}
                    </p>
                </div>
            )}

            {/* Action Button - Footer */}
            <div style={{ marginTop: 'auto' }}>
                {isApplied ? (
                    <div style={{
                        width: '100%', padding: '10px', borderRadius: '8px',
                        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                        border: '1px solid #6ee7b7',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                        color: '#065f46', fontWeight: 600, fontSize: '0.95rem'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', background: '#10b981', color: 'white', fontSize: '12px' }}>✓</span>
                        Applied Successfully
                    </div>
                ) : (
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                        onClick={() => isLoggedIn ? onApply(job.id) : window.location.href = '/auth'}
                    >
                        Apply Now <ArrowRight size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default JobCard;
