import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();

    return (
        <footer>
            <div className="container">
                <div className="logo" style={{ marginBottom: '1rem' }}>EVerified</div>
                <p className="text-gray">{t('tagline')}</p>
                <p className="text-sm text-gray" style={{ marginTop: '1rem' }}>
                    © 2026 EVerified. All rights reserved. | <a href="/privacy-policy" style={{ color: 'var(--gray)', textDecoration: 'none' }}>Privacy Policy</a>
                </p>
            </div>
        </footer >
    );
};

export default Footer;
