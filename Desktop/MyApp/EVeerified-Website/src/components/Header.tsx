import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
    const { user, recruiter, isAdmin, logout } = useAuth();
    const { t, language, toggleLanguage } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isLoggedIn = user || recruiter || isAdmin;

    const getDashboardLink = () => {
        if (user) return '/user-dashboard';
        if (recruiter) return '/recruiter-dashboard';
        if (isAdmin) return '/admin-dashboard';
        return '/';
    };

    return (
        <header>
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        EVerified
                    </Link>
                    <nav>
                        <ul className="nav-links">
                            <li><Link to="/jobs">{t('jobs')}</Link></li>

                            {isLoggedIn ? (
                                <>
                                    <li><Link to={getDashboardLink()}>{t('dashboard')}</Link></li>
                                    <li>
                                        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                                            {t('logout')}
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li><Link to="/auth">{t('login')}</Link></li>
                            )}

                            <li>
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={toggleLanguage}
                                >
                                    {language === 'en' ? 'हिंदी' : 'English'}
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
