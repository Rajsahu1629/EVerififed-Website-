import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Job } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import JobCard from '../components/JobCard';

const JobsPage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [experienceFilter, setExperienceFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [pincodeFilter, setPincodeFilter] = useState('');

    useEffect(() => {
        loadJobs();
    }, [user]);

    const loadJobs = async () => {
        try {
            const jobsData = await api.getJobs();
            setJobs(jobsData);
            setFilteredJobs(jobsData);

            if (user?.id) {
                const appliedIds = await api.getAppliedJobIds(user.id);
                setAppliedJobIds(appliedIds);
            }
        } catch (error) {
            console.error('Error loading jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId: number) => {
        if (!user) {
            navigate('/auth');
            return;
        }

        try {
            await api.applyToJob(user.id, jobId);
            setAppliedJobIds([...appliedJobIds, jobId]);
            alert(t('applicationSubmitted'));
        } catch (error) {
            alert('Failed to apply');
        }
    };

    const applyFilters = () => {
        let filtered = jobs;

        if (searchTerm) {
            filtered = filtered.filter(
                (j) =>
                    j.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    j.role_required.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (experienceFilter) {
            filtered = filtered.filter((j) => j.experience === experienceFilter);
        }

        if (cityFilter) {
            filtered = filtered.filter((j) => j.city === cityFilter);
        }

        if (pincodeFilter) {
            filtered = filtered.filter((j) => j.pincode && j.pincode.includes(pincodeFilter));
        }

        setFilteredJobs(filtered);
    };

    const cities = [...new Set(jobs.map((j) => j.city).filter(Boolean))];


    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '60px 20px' }}>
            <h1 className="mb-6">{t('jobs')}</h1>

            {/* Filters */}
            <div className="card mb-6">
                <div className="grid grid-4 gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder={t('search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="form-control"
                        value={experienceFilter}
                        onChange={(e) => setExperienceFilter(e.target.value)}
                    >
                        <option value="">All Experience</option>
                        <option value="Fresher">Fresher</option>
                        <option value="1 year">1 Year</option>
                        <option value="2 years">2 Years</option>
                        <option value="3 years">3+ Years</option>
                    </select>
                    <select
                        className="form-control"
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                    >
                        <option value="">All Cities</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Pincode"
                        value={pincodeFilter}
                        onChange={(e) => setPincodeFilter(e.target.value)}
                        maxLength={6}
                    />
                    <button className="btn btn-primary" onClick={applyFilters}>
                        {t('filter')}
                    </button>
                </div>
            </div>

            {/* Jobs Grid */}
            {filteredJobs.length === 0 ? (
                <div className="text-center" style={{ padding: '60px 0' }}>
                    <h3 className="text-gray">{t('noDataAvailable')}</h3>
                </div>
            ) : (
                <div className="grid grid-2">
                    {filteredJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            isApplied={appliedJobIds.includes(job.id)}
                            onApply={handleApply}
                            isLoggedIn={!!user}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobsPage;
