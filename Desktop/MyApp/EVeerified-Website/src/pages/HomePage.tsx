import React from 'react';
import { Link } from 'react-router-dom';


import logo from '../assets/logo.png';

const HomePage: React.FC = () => {
    return (
        <div>
            {/* Hero Section */}
            <section className="hero" style={{ padding: '80px 0', background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)' }}>
                <div className="container">
                    <div className='flex justify-center items-center gap-2'>
                        <img src={logo} alt="EVerified Logo" style={{ height: '60px' }} />
                        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', margin: 0, lineHeight: 1 }}>
                            <span style={{ color: 'var(--primary)' }}>E</span>Verified
                        </h1>
                    </div>
                    <p style={{ fontSize: '1.5rem', color: '#64748b', marginBottom: '0.5rem', marginTop: '1rem' }}>
                        Trusted Platform for EV & BS6 Workforce
                    </p>
                    <p style={{ fontSize: '1.1rem', color: '#475569', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
                        Connecting Pre-Verified EV & BS6 Candidates with Workshops, Dealers, and Fleets across India
                    </p>

                    <div className="flex justify-center gap-4" style={{ flexWrap: 'wrap' }}>
                        <Link to="/auth?type=recruiter" className="btn btn-primary btn-lg">
                            🏢 I'm a Recruiter
                        </Link>
                        <Link to="/auth?type=candidate" className="btn btn-secondary btn-lg">
                            👤 I'm a Candidate
                        </Link>
                    </div>

                    {/* App Download Section */}
                    <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <p style={{ color: '#475569', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            📱 Download our mobile app for the best experience
                        </p>

                        <a
                            href="https://play.google.com/store/apps/details?id=com.rajsahu1629.EVerifiedNative"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline"
                            style={{ gap: '0.5rem' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                            </svg>
                            Get it on Play Store
                        </a>
                    </div>
                </div>
            </section >

            {/* How We Help Section */}
            < section className="container" style={{ padding: '80px 0' }}>
                <h2 className="text-center mb-6" style={{ color: 'var(--primary)' }}>
                    HOW WE COULD HELP YOU
                </h2>

                <div className="grid grid-3">
                    <div className="card text-center">
                        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔧</div>
                        <h3>Pre-Verified EV & BS6  Technicians</h3>
                        <p className="text-gray">
                            We provide EV & BS6 technicians who are pre-tested & ready for hire. No guesswork, just skilled professionals.
                        </p>
                    </div>

                    <div className="card text-center">
                        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📋</div>
                        <h3>Easy Hiring Platform</h3>
                        <p className="text-gray">
                            Post jobs, view verified EV & BS6 candidates, and hire quickly. Streamlined process for busy recruiters.
                        </p>
                    </div>

                    <div className="card text-center">
                        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>👔</div>
                        <h3>Service & Sales Managers</h3>
                        <p className="text-gray">
                            Hire skilled managers ready to lead EV & BS6 operations. Workshop managers, showroom leads, and more.
                        </p>
                    </div>
                </div>
            </section >

            {/* EV Market Stats Section */}
            < section style={{ background: '#f8fafc', padding: '80px 0' }}>
                <div className="container">
                    <h2 className="text-center mb-2" style={{ color: 'var(--primary)' }}>
                        EV MARKET IS GROWING
                    </h2>
                    <p className="text-center text-gray mb-6" style={{ fontSize: '1.2rem' }}>
                        Workforce Should Too!
                    </p>

                    <div className="grid grid-3" style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div className="stats-card">
                            <div className="stats-value">1.3M+</div>
                            <div className="stats-label">EV 2-Wheelers Sold by 2025</div>
                        </div>

                        <div className="stats-card">
                            <div className="stats-value">5-6M</div>
                            <div className="stats-label">Annual EV Sales by 2030</div>
                        </div>

                        <div className="stats-card">
                            <div className="stats-value">100K+</div>
                            <div className="stats-label">Verified Technicians Needed</div>
                        </div>
                    </div>

                    <p className="text-center mt-6" style={{ color: '#64748b', fontSize: '1.1rem' }}>
                        Everywhere, EV infrastructure is expanding... Charging Networks, Batteries, Service Centers
                        <br />
                        A Skilled EV & BS6 workforce is essential to power this ecosystem.
                    </p>
                </div>
            </section >

            {/* Opportunities for Professionals */}
            < section className="container" style={{ padding: '80px 0' }}>
                <h2 className="text-center mb-6" style={{ color: 'var(--primary)' }}>
                    OPPORTUNITIES FOR EV & BS6 PROFESSIONALS
                </h2>

                <div className="grid grid-3">
                    <div className="card">
                        <h3 style={{ color: 'var(--primary)' }}>🔧 EV & BS6 Technician</h3>
                        <ul style={{ color: '#64748b', paddingLeft: '1.5rem', lineHeight: '2' }}>
                            <li>Diagnose & repair EV & BS6 vehicles</li>
                            <li>Work on batteries & high-voltage systems</li>
                            <li>Service 2W & 3W electric & BS6 vehicles</li>
                        </ul>
                    </div>

                    <div className="card">
                        <h3 style={{ color: 'var(--primary)' }}>🏭 Workshop Manager</h3>
                        <ul style={{ color: '#64748b', paddingLeft: '1.5rem', lineHeight: '2' }}>
                            <li>Lead EV & BS6 workshop operations</li>
                            <li>Ensure top-notch service quality</li>
                            <li>Manage a team of skilled EV & BS6 technicians</li>
                        </ul>
                    </div>

                    <div className="card">
                        <h3 style={{ color: 'var(--primary)' }}>💼 Showroom Manager</h3>
                        <ul style={{ color: '#64748b', paddingLeft: '1.5rem', lineHeight: '2' }}>
                            <li>Drive fleet & retail EV & BS6 sales</li>
                            <li>Help businesses adopt EVs & BS6</li>
                            <li>Be at the forefront of EV & BS6 revolution</li>
                        </ul>
                    </div>
                </div>
            </section >

            {/* Why Get Verified Section */}
            < section style={{ background: '#f8fafc', padding: '80px 0' }}>
                <div className="container">
                    <h2 className="text-center mb-6" style={{ color: 'var(--primary)' }}>
                        WHY GET VERIFIED? →→ GET VERIFIED →
                    </h2>

                    <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="grid grid-2" style={{ gap: '2rem' }}>
                            <div>
                                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>For Candidates:</h4>
                                <ul style={{ color: '#64748b', paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                                    <li>Take 2 Simple Tests → Become Verified</li>
                                    <li>Gain Credibility & Trust with Workshops & Dealers</li>
                                    <li>Get Access to High-Demand EV Jobs Across India</li>
                                    <li>Connect Directly to EV-Ready Workshops, Dealers, & Fleets</li>
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>For Recruiters:</h4>
                                <ul style={{ color: '#64748b', paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                                    <li>Access Pre-Verified Talent Pool</li>
                                    <li>Reduce Hiring Time & Costs</li>
                                    <li>Get Reliable Service Every Time</li>
                                    <li>Build Strong Brand Reputation</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Service Can Make or Break - Recruiter Focus */}
            < section className="container" style={{ padding: '80px 0' }}>
                <h2 className="text-center mb-6" style={{ color: 'var(--primary)' }}>
                    SERVICE CAN MAKE OR BREAK YOUR WORKSHOP
                </h2>

                <div className="grid grid-2" style={{ maxWidth: '900px', margin: '0 auto', gap: '2rem' }}>
                    <div className="card" style={{ borderColor: 'var(--error)', borderWidth: '2px' }}>
                        <h4 style={{ color: 'var(--error)', marginBottom: '1rem' }}>❌ If You Don't Have Skilled Staff:</h4>
                        <ul style={{ color: '#64748b', paddingLeft: '1.5rem', lineHeight: '2' }}>
                            <li>Customer Complaints</li>
                            <li>Negative Reviews</li>
                            <li>Lost Trust & Reputation</li>
                        </ul>
                    </div>

                    <div className="card" style={{ borderColor: 'var(--success)', borderWidth: '2px' }}>
                        <h4 style={{ color: 'var(--success)', marginBottom: '1rem' }}>✅ If You Hire Verified EV Technicians:</h4>
                        <ul style={{ color: '#64748b', paddingLeft: '1.5rem', lineHeight: '2' }}>
                            <li>Reliable Service Every Time</li>
                            <li>Happy, Loyal Customers</li>
                            <li>Strong Brand Reputation & Growth</li>
                        </ul>
                    </div>
                </div>
            </section >

            {/* EVerified Bridges The Gap */}
            < section style={{ background: 'linear-gradient(180deg, var(--dark-secondary) 0%, var(--dark) 100%)', padding: '80px 0' }}>
                <div className="container text-center">
                    <h2 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>
                        EVerified Bridges The Gap
                    </h2>

                    <div className="flex justify-center items-center gap-4" style={{ flexWrap: 'wrap', marginBottom: '2rem' }}>
                        <div className="glass-card" style={{ padding: '1.5rem 2rem' }}>
                            <span style={{ fontSize: '2rem' }}>👨‍🔧</span>
                            <p style={{ color: 'var(--light)', marginTop: '0.5rem' }}>EV & BS6 Professionals</p>
                        </div>

                        <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>⟷</div>

                        <div className="glass-card" style={{ padding: '1rem 2rem', background: 'var(--gradient-primary)' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--dark)' }}>EVerified</span>
                        </div>

                        <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>⟷</div>

                        <div className="glass-card" style={{ padding: '1.5rem 2rem' }}>
                            <span style={{ fontSize: '2rem' }}>🏢</span>
                            <p style={{ color: 'var(--light)', marginTop: '0.5rem' }}>Recruiters</p>
                            <p style={{ color: '#475569', fontSize: '0.8rem' }}>(Workshops, Dealers, Fleets)</p>
                        </div>
                    </div>
                </div>
            </section >

            {/* Final CTA Section */}
            < section className="container" style={{ padding: '80px 0' }}>
                <div className="glass-card text-center" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%)', padding: '3rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                        Join the EVerified Network
                    </h2>
                    <p className="text-gray" style={{ margin: '20px 0', fontSize: '1.2rem' }}>
                        Make Hiring EV & BS6 Talent Fast, Easy, and Reliable!
                    </p>
                    <div className="flex justify-center gap-4" style={{ flexWrap: 'wrap' }}>
                        <Link to="/auth?type=recruiter" className="btn btn-primary btn-lg">
                            Register as Recruiter
                        </Link>
                        <Link to="/auth" className="btn btn-outline btn-lg">
                            Get Verified as Candidate
                        </Link>
                    </div>
                </div>
            </section >

            {/* Bottom Tagline */}
            < section style={{ background: 'var(--primary)', padding: '1.5rem 0' }}>
                <div className="container text-center">
                    <p style={{ color: 'var(--dark)', fontWeight: '600', fontSize: '1.1rem', margin: 0 }}>
                        Take the EVerified Test → Get Verified → Access EV Jobs Fast!
                    </p>
                </div>
            </section >
        </div >
    );
};

export default HomePage;
