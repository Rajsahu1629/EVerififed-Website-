import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

import logo from '../assets/logo.png';

const Header: React.FC = () => {
    const { user, recruiter, isAdmin, logout } = useAuth();
    const { t, language, toggleLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
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
                    <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={logo} alt="EVerified Logo" style={{ height: '40px', width: 'auto' }} />
                        <span>EVerified</span>
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
                                    style={{ marginRight: '8px' }}
                                >
                                    {language === 'en' ? 'हिंदी' : 'English'}
                                </button>
                            </li>
                            <li>
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={toggleTheme}
                                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem' }}
                                >
                                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
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
