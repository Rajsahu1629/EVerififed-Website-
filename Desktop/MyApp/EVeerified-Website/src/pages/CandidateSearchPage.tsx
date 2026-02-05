import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import type { User } from '../services/api';

const CandidateSearchPage: React.FC = () => {
    const { t } = useLanguage();
    const [candidates, setCandidates] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const [filters, setFilters] = useState({
        domain: '',
        vehicleCategory: '',
        city: '',
        experience: '',
        role: '',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        setLoading(true);
        setSearched(true);
        try {
            const results = await api.searchCandidates(filters);
            setCandidates(results);
        } catch (error) {
            console.error('Search failed:', error);
            setCandidates([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status?: string) => {
        const colors: Record<string, string> = {
            verified: 'badge-success',
            approved: 'badge-success',
            pending: 'badge-warning',
            rejected: 'badge-error',
        };
        return <span className={`badge ${colors[status || 'pending'] || 'badge-secondary'}`}>{status || 'pending'}</span>;
    };

    return (
        <div className="container" style={{ padding: '60px 20px' }}>
            <h1 className="mb-6">{t('searchCandidates')}</h1>

            {/* Filters */}
            <div className="card mb-6">
                <div className="grid grid-3 gap-4 mb-4">
                    <select name="domain" className="form-control" value={filters.domain} onChange={handleFilterChange}>
                        <option value="">All Domains</option>
                        <option value="EV">EV</option>
                        <option value="BS6">BS6</option>
                    </select>

                    <select name="experience" className="form-control" value={filters.experience} onChange={handleFilterChange}>
                        <option value="">All Experience</option>
                        <option value="Fresher">Fresher</option>
                        <option value="1 year">1 Year</option>
                        <option value="2 years">2 Years</option>
                        <option value="3 years">3+ Years</option>
                    </select>

                    <input
                        type="text"
                        name="city"
                        className="form-control"
                        placeholder="City"
                        value={filters.city}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="grid grid-3 gap-4">
                    <select name="role" className="form-control" value={filters.role} onChange={handleFilterChange}>
                        <option value="">All Roles</option>
                        <option value="technician">Technician</option>
                        <option value="workshop_manager">Workshop Manager</option>
                        <option value="showroom_manager">Showroom Manager</option>
                        <option value="sales_consultant">Sales Consultant</option>
                    </select>

                    <select name="vehicleCategory" className="form-control" value={filters.vehicleCategory} onChange={handleFilterChange}>
                        <option value="">All Vehicle Categories</option>
                        <option value="2 Wheeler">2 Wheeler</option>
                        <option value="3 Wheeler">3 Wheeler</option>
                        <option value="4 Wheeler">4 Wheeler</option>
                    </select>

                    <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
                        {loading ? t('loading') : '🔍 ' + t('search')}
                    </button>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div className="loading-overlay" style={{ position: 'relative', minHeight: '200px' }}>
                    <div className="loading-spinner"></div>
                </div>
            ) : searched && candidates.length === 0 ? (
                <div className="text-center" style={{ padding: '60px 0' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                    <h3 className="text-gray">{t('noDataAvailable')}</h3>
                    <p className="text-gray">No candidates found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-2">
                    {candidates.map((candidate) => (
                        <div key={candidate.id} className="card">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3>{candidate.fullName || candidate.full_name || 'Unknown'}</h3>
                                    <p className="text-gray">{candidate.role || 'Technician'} • {candidate.domain || 'EV'}</p>
                                </div>
                                {getStatusBadge(candidate.verificationStatus || candidate.verification_status)}
                            </div>

                            <div className="text-gray text-sm mb-3">
                                <div>📍 {candidate.city || '--'}, {candidate.state || '--'}</div>
                                <div>📞 {candidate.phoneNumber || candidate.phone_number || '--'}</div>
                                <div>💼 {candidate.experience || 'Not specified'}</div>
                                <div>🎓 {candidate.qualification || 'Not specified'}</div>
                            </div>

                            {(candidate.quizScore || candidate.quiz_score) && (
                                <div className="text-primary" style={{ fontWeight: 600 }}>
                                    Quiz Score: {candidate.quizScore || candidate.quiz_score}/{candidate.totalQuestions || candidate.total_questions || 10}
                                </div>
                            )}

                            <button className="btn btn-outline mt-3" style={{ width: '100%' }}>
                                {t('viewDetails')}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CandidateSearchPage;
