import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import type { Job } from '../services/api';

const PostJobPage: React.FC = () => {
    const { recruiter } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const isEditMode = searchParams.get('edit') === 'true';
    const jobId = searchParams.get('jobId');

    const [loading, setLoading] = useState(false);

    const evBrands = [
        'Ola', 'Ather', 'Bajaj', 'TVS', 'Hero Electric', 'Other'
    ];

    const roles = [
        { label: 'EV Technician', value: 'technician' },
        { label: 'BS6 Technician', value: 'bs6_technician' },
        { label: 'Showroom Manager', value: 'sales' },
        { label: 'Workshop Manager', value: 'workshop' },
        { label: 'Fresher', value: 'fresher' },
    ];

    const [formData, setFormData] = useState({
        brand: '',
        otherBrand: '',
        roleRequired: '',
        numberOfPeople: '',
        experience: '',
        salaryMin: '',
        salaryMax: '',
        city: '',
        pincode: '',
        hasIncentive: false,
        stayProvided: false,
        urgency: 'within_7_days',
        jobDescription: '',
        vehicleCategory: '',
        trainingRole: '',
    });

    useEffect(() => {
        if (isEditMode && jobId) {
            setLoading(true);

            // Helper to get value from label or value
            const getRoleValue = (val: string) => {
                const found = roles.find(r => r.value === val || r.label === val);
                return found ? found.value : val;
            };

            // Check if job data is passed via state (from PreviousJobsPage)
            const jobFromState = location.state?.job as Job | undefined;
            if (jobFromState && jobFromState.id === parseInt(jobId)) {
                setFormData({
                    brand: jobFromState.brand, // logic for 'Other' might be needed if brand not in list, but simplified here
                    otherBrand: '',
                    roleRequired: getRoleValue(jobFromState.role_required),
                    numberOfPeople: jobFromState.number_of_people,
                    experience: jobFromState.experience,
                    salaryMin: jobFromState.salary_min.toString(),
                    salaryMax: jobFromState.salary_max.toString(),
                    city: jobFromState.city,
                    pincode: jobFromState.pincode,
                    hasIncentive: jobFromState.has_incentive,
                    stayProvided: jobFromState.stay_provided,
                    urgency: jobFromState.urgency,
                    jobDescription: (jobFromState as any).job_description || '',
                    vehicleCategory: jobFromState.vehicle_category || '',
                    trainingRole: jobFromState.training_role || '',
                });
                setLoading(false);
                return;
            }

            api.getJob(parseInt(jobId))
                .then(job => {
                    setFormData({
                        brand: job.brand, // logic for 'Other' might be needed if brand not in list, but simplified here
                        otherBrand: '',
                        roleRequired: getRoleValue(job.role_required),
                        numberOfPeople: job.number_of_people,
                        experience: job.experience,
                        salaryMin: job.salary_min.toString(),
                        salaryMax: job.salary_max.toString(),
                        city: job.city,
                        pincode: job.pincode,
                        hasIncentive: job.has_incentive,
                        stayProvided: job.stay_provided,
                        urgency: job.urgency,
                        jobDescription: (job as any).job_description || '', // Cast to any if property missing in type definition
                        vehicleCategory: job.vehicle_category || '',
                        trainingRole: job.training_role || '',
                    });
                })
                .catch(err => {
                    console.error('Failed to fetch job', err);
                    alert('Failed to load job details');
                })
                .finally(() => setLoading(false));
        }
    }, [isEditMode, jobId, location.state]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
        setFormData({ ...formData, [target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recruiter) return;

        setLoading(true);
        try {
            const brandValue = formData.brand === 'Other' ? formData.otherBrand : formData.brand;
            const selectedRole = roles.find(r => r.value === formData.roleRequired);
            const roleLabel = selectedRole ? selectedRole.label : formData.roleRequired;

            const payload: any = { // Use simplified payload construction
                recruiterId: recruiter.id,
                brand: brandValue,
                roleRequired: roleLabel,
                numberOfPeople: formData.numberOfPeople,
                experience: formData.experience,
                salaryMin: parseInt(formData.salaryMin),
                salaryMax: parseInt(formData.salaryMax),
                city: formData.city,
                pincode: formData.pincode,
                hasIncentive: formData.hasIncentive,
                stayProvided: formData.stayProvided,
                urgency: formData.urgency,
                jobDescription: formData.jobDescription,
                vehicleCategory: formData.vehicleCategory || undefined,
                trainingRole: formData.trainingRole || undefined,
                status: 'pending' // Reset to pending on edit? User implied "until approved". If edited, maybe it should stay pending.
            };

            if (isEditMode && jobId) {
                await api.updateJob(parseInt(jobId), payload);
                alert('Job updated successfully!');
            } else {
                await api.createJob(payload);
                alert('Job posted successfully! Awaiting admin approval.');
            }

            navigate('/recruiter-dashboard');
        } catch (error) {
            alert('Failed to save job: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-sm" style={{ padding: '60px 20px' }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
                <h1 className="mb-6">{isEditMode ? 'Edit Job' : t('postNewJob')}</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Brand *</label>
                        <select
                            name="brand"
                            className="form-control"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Brand</option>
                            {evBrands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>

                    {formData.brand === 'Other' && (
                        <div className="form-group">
                            <label className="form-label">Enter Brand Name *</label>
                            <input
                                type="text"
                                name="otherBrand"
                                className="form-control"
                                value={formData.otherBrand}
                                onChange={handleChange}
                                placeholder="e.g. Tata, Mahindra"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">{t('roleRequired')} *</label>
                        <select name="roleRequired" className="form-control" value={formData.roleRequired} onChange={handleChange} required>
                            <option value="">Select Role</option>
                            {roles.map(role => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                        </select>
                    </div>

                    {formData.roleRequired !== 'fresher' && (
                        <div className="form-group">
                            <label className="form-label">Vehicle Category *</label>
                            <select name="vehicleCategory" className="form-control" value={formData.vehicleCategory} onChange={handleChange} required>
                                <option value="">Select Vehicle Category</option>
                                <option value="2W">2 Wheeler</option>
                                <option value="3W">3 Wheeler</option>
                            </select>
                        </div>
                    )}

                    {formData.roleRequired === 'bs6_technician' && (
                        <div className="form-group">
                            <label className="form-label">Training Role *</label>
                            <select name="trainingRole" className="form-control" value={formData.trainingRole} onChange={handleChange} required>
                                <option value="">Select Training Role</option>
                                <option value="Basic">Basic</option>
                                <option value="Engine Expert">Engine Expert</option>
                                <option value="Diagnosis Expert">Diagnosis Expert (Electrical)</option>
                                <option value="Diagnosis + Engine Expert">Diagnosis + Engine Expert</option>
                            </select>
                        </div>
                    )}

                    <div className="grid grid-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">{t('numberOfPeople')} *</label>
                            <input type="number" name="numberOfPeople" className="form-control" value={formData.numberOfPeople} onChange={handleChange} min="1" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('experience')} *</label>
                            <select name="experience" className="form-control" value={formData.experience} onChange={handleChange} required>
                                <option value="">Select Experience</option>
                                <option value="fresher">Fresher</option>
                                <option value="0-1">0-1 Years</option>
                                <option value="1-2">1-2 Years</option>
                                <option value="2-3">2-3 Years</option>
                                <option value="3-4">3-4 Years</option>
                                <option value="4-5">4-5 Years</option>
                                <option value="5-6">5-6 Years</option>
                                <option value="6-7">6-7 Years</option>
                                <option value="7-8">7-8 Years</option>
                                <option value="8+">8+ Years</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Min Salary (₹/month) *</label>
                            <input
                                type="number"
                                name="salaryMin"
                                className="form-control"
                                value={formData.salaryMin}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Max Salary (₹/month) *</label>
                            <input
                                type="number"
                                name="salaryMax"
                                className="form-control"
                                value={formData.salaryMax}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">{t('city')} *</label>
                            <input type="text" name="city" className="form-control" value={formData.city} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('pincode')} *</label>
                            <input type="text" name="pincode" className="form-control" value={formData.pincode} onChange={handleChange} maxLength={6} required />
                        </div>
                    </div>

                    <div className="flex gap-4 mb-4">
                        <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                            <input type="checkbox" name="hasIncentive" checked={formData.hasIncentive} onChange={handleChange} />
                            <span>Incentive Available</span>
                        </label>

                        <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                            <input type="checkbox" name="stayProvided" checked={formData.stayProvided} onChange={handleChange} />
                            <span>Stay Provided</span>
                        </label>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Urgency</label>
                        <select name="urgency" className="form-control" value={formData.urgency} onChange={handleChange}>
                            <option value="immediate">Immediate</option>
                            <option value="within_7_days">Within 7 Days</option>
                            <option value="within_30_days">Within 30 Days</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('jobDescription')}</label>
                        <textarea name="jobDescription" className="form-control" value={formData.jobDescription} onChange={handleChange} rows={4} placeholder="Describe the role and requirements..."></textarea>
                    </div>

                    <div className="flex gap-3">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/recruiter-dashboard')}>
                            {t('cancel')}
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                            {loading ? t('loading') : (isEditMode ? 'Update Job' : t('postNewJob'))}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostJobPage;
