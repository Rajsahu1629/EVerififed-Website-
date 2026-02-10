import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import type { Job } from '../services/api';
import { Plus, FileText, Search, MessageCircle, LogOut } from 'lucide-react';

const RecruiterDashboard: React.FC = () => {
    const { recruiter, logout } = useAuth();
    const { t } = useLanguage();
    const [stats, setStats] = useState({ totalJobs: 0, pendingJobs: 0, totalApplications: 0 });

    useEffect(() => {
        if (recruiter?.id) {
            api.getRecruiterJobs(recruiter.id).then((jobs: Job[]) => {
                setStats({
                    totalJobs: jobs.length,
                    pendingJobs: jobs.filter((j) => j.status === 'pending').length,
                    totalApplications: jobs.reduce((sum, j) => sum + (Number(j.application_count) || 0), 0),
                });
            }).catch(console.error);
        }
    }, [recruiter]);

    const companyName = recruiter?.companyName || recruiter?.company_name || 'Company';

    const handleWhatsAppSupport = () => {
        const whatsappNumber = '919473928468';
        const message = 'Hi, I need help with EVerified app.';
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{ background: '#10b981', padding: '24px 20px', paddingBottom: '60px', borderRadius: '0 0 24px 24px' }}>
                <div className="container">
                    <div className="flex justify-between items-center text-white">
                        <div>
                            <p style={{ opacity: 0.9, fontSize: '14px' }}>{t('welcome')}</p>
                            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{companyName}</h1>
                        </div>
                        <button
                            onClick={logout}
                            style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer', color: 'white' }}
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '-40px', padding: '0 20px' }}>
                <div className="grid gap-4">
                    {/* Post New Job */}
                    <Link to="/post-job" style={{ textDecoration: 'none' }}>
                        <div className="flex items-center gap-4 p-4 hover-scale" style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ background: '#10b981', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <Plus size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>{t('postNewJob')}</h3>
                                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Hire EV professionals</p>
                            </div>
                            <div style={{ marginLeft: 'auto', color: '#cbd5e1' }}>›</div>
                        </div>
                    </Link>

                    {/* Previous Jobs */}
                    <Link to="/previous-jobs" style={{ textDecoration: 'none' }}>
                        <div className="flex items-center gap-4 p-4 hover-scale" style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ background: '#fffbeb', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>{t('previousJobPosts')}</h3>
                                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>View your posted jobs</p>
                            </div>
                            <div style={{ marginLeft: 'auto', color: '#cbd5e1' }}>›</div>
                        </div>
                    </Link>

                    {/* Find Candidates */}
                    <Link to="/candidate-search" style={{ textDecoration: 'none' }}>
                        <div className="flex items-center gap-4 p-4 hover-scale" style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ background: '#ecfeff', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
                                <Search size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>{t('searchCandidates')}</h3>
                                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Search verified EV professionals</p>
                            </div>
                            <div style={{ marginLeft: 'auto', color: '#cbd5e1' }}>›</div>
                        </div>
                    </Link>

                    {/* Help & Support */}
                    <div onClick={handleWhatsAppSupport} style={{ cursor: 'pointer' }}>
                        <div className="flex items-center gap-4 p-4 hover-scale" style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ background: '#f0fdf4', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                                <MessageCircle size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>Help & Support</h3>
                                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Chat with us on WhatsApp</p>
                            </div>
                            <div style={{ marginLeft: 'auto', color: '#cbd5e1' }}>›</div>
                        </div>
                    </div>
                </div>

                {/* Stats Summary - Optional but good for web */}
                <div style={{ marginTop: '30px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#64748b', marginBottom: '15px' }}>Overview</h3>
                    <div className="grid grid-3 gap-4">
                        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{stats.totalJobs}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Active Jobs</div>
                        </div>
                        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.pendingJobs}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Pending</div>
                        </div>
                        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{stats.totalApplications}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Applicants</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
