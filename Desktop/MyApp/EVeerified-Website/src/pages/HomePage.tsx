import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <h1>{t('appName')}</h1>
                    <p>{t('tagline')}</p>

                    <div className="flex justify-center gap-4" style={{ flexWrap: 'wrap' }}>
                        <Link to="/auth" className="btn btn-primary btn-lg">
                            {t('login')} / {t('register')}
                        </Link>
                        <Link to="/jobs" className="btn btn-secondary btn-lg">
                            {t('browseJobs')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container" style={{ padding: '60px 0' }}>
                <h2 className="text-center mb-6">Platform Features</h2>

                <div className="grid grid-3">
                    <div className="card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                        <h3>{t('skillVerification')}</h3>
                        <p className="text-gray">Get verified through EV-specific skill tests and earn credentials</p>
                    </div>

                    <div className="card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💼</div>
                        <h3>Job Opportunities</h3>
                        <p className="text-gray">Access exclusive jobs from verified recruiters and companies</p>
                    </div>

                    <div className="card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                        <h3>Career Growth</h3>
                        <p className="text-gray">Grow your career in the booming EV and BS6 automobile sector</p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container" style={{ padding: '60px 0' }}>
                <div className="grid grid-3">
                    <div className="stats-card">
                        <div className="stats-value">1000+</div>
                        <div className="stats-label">Verified Technicians</div>
                    </div>

                    <div className="stats-card">
                        <div className="stats-value">500+</div>
                        <div className="stats-label">Job Opportunities</div>
                    </div>

                    <div className="stats-card">
                        <div className="stats-value">100+</div>
                        <div className="stats-label">Trusted Recruiters</div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container" style={{ padding: '60px 0' }}>
                <div className="glass-card text-center">
                    <h2>Ready to Get Started?</h2>
                    <p className="text-gray" style={{ margin: '20px 0' }}>
                        Join thousands of verified EV professionals and find your dream job today.
                    </p>
                    <Link to="/auth" className="btn btn-primary btn-lg">
                        {t('getVerified')}
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
