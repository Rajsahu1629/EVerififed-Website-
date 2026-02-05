import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';

const PostJobPage: React.FC = () => {
    const { recruiter } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        brand: '',
        roleRequired: '',
        numberOfPeople: '',
        experience: 'Fresher',
        salaryMin: '',
        salaryMax: '',
        city: '',
        pincode: '',
        hasIncentive: false,
        stayProvided: false,
        urgency: 'within_7_days',
        jobDescription: '',
    });

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
            await api.createJob({
                recruiter_id: recruiter.id,
                brand: formData.brand,
                role_required: formData.roleRequired,
                number_of_people: formData.numberOfPeople,
                experience: formData.experience,
                salary_min: parseInt(formData.salaryMin),
                salary_max: parseInt(formData.salaryMax),
                city: formData.city,
                pincode: formData.pincode,
                has_incentive: formData.hasIncentive,
                stay_provided: formData.stayProvided,
                urgency: formData.urgency,
                job_description: formData.jobDescription,
                status: 'pending',
                is_active: true,
            });
            alert('Job posted successfully! Awaiting admin approval.');
            navigate('/recruiter-dashboard');
        } catch (error) {
            alert('Failed to post job: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-sm" style={{ padding: '60px 20px' }}>
            <div className="glass-card">
                <h1 className="mb-6">{t('postNewJob')}</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Brand *</label>
                        <input
                            type="text"
                            name="brand"
                            className="form-control"
                            value={formData.brand}
                            onChange={handleChange}
                            placeholder="e.g., Bajaj, Ola, Ather"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('roleRequired')} *</label>
                        <select name="roleRequired" className="form-control" value={formData.roleRequired} onChange={handleChange} required>
                            <option value="">Select Role</option>
                            <option value="EV Technician">EV Technician</option>
                            <option value="BS6 Technician">BS6 Technician</option>
                            <option value="Workshop Manager">Workshop Manager</option>
                            <option value="Showroom Manager">Showroom Manager</option>
                            <option value="Sales Executive">Sales Executive</option>
                        </select>
                    </div>

                    <div className="grid grid-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">{t('numberOfPeople')} *</label>
                            <input type="number" name="numberOfPeople" className="form-control" value={formData.numberOfPeople} onChange={handleChange} min="1" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('experience')} *</label>
                            <select name="experience" className="form-control" value={formData.experience} onChange={handleChange}>
                                <option value="Fresher">Fresher</option>
                                <option value="1 year">1 Year</option>
                                <option value="2 years">2 Years</option>
                                <option value="3 years">3 Years</option>
                                <option value="5+ years">5+ Years</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Min Salary (₹/month) *</label>
                            <input type="number" name="salaryMin" className="form-control" value={formData.salaryMin} onChange={handleChange} min="0" step="1000" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Max Salary (₹/month) *</label>
                            <input type="number" name="salaryMax" className="form-control" value={formData.salaryMax} onChange={handleChange} min="0" step="1000" required />
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
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="hasIncentive" checked={formData.hasIncentive} onChange={handleChange} />
                            <span>Incentive Available</span>
                        </label>

                        <label className="flex items-center gap-2">
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
                            {loading ? t('loading') : t('postNewJob')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostJobPage;
