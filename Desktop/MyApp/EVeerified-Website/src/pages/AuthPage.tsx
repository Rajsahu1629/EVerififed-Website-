import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';

type Role = 'user' | 'recruiter' | 'admin';
type Mode = 'login' | 'register';

const AuthPage: React.FC = () => {
    const { loginUser, loginRecruiter, loginAdmin } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [role, setRole] = useState<Role | null>(null);
    const [mode, setMode] = useState<Mode>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form fields
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        state: '',
        city: '',
        pincode: '',
        qualification: '',
        experience: '',
        userRole: 'technician',
        domain: 'EV',
        companyName: '',
        entityType: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePhone(formData.phoneNumber)) {
            setError(t('invalidPhone'));
            return;
        }

        setLoading(true);
        try {
            if (role === 'user') {
                const response = await api.loginUser(formData.phoneNumber, formData.password);
                if (response.success) {
                    loginUser(response.user);
                    navigate('/user-dashboard');
                }
            } else if (role === 'recruiter') {
                const response = await api.loginRecruiter(formData.phoneNumber, formData.password);
                if (response.success) {
                    loginRecruiter(response.recruiter);
                    navigate('/recruiter-dashboard');
                }
            } else if (role === 'admin') {
                // Simple admin check
                if (formData.phoneNumber === '9999999999' && formData.password === 'admin123') {
                    loginAdmin();
                    navigate('/admin-dashboard');
                } else {
                    throw new Error('Invalid admin credentials');
                }
            }
        } catch (err) {
            setError((err as Error).message || t('loginFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePhone(formData.phoneNumber)) {
            setError(t('invalidPhone'));
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError(t('passwordMismatch'));
            return;
        }

        setLoading(true);
        try {
            if (role === 'user') {
                const response = await api.registerUser({
                    fullName: formData.fullName,
                    phoneNumber: formData.phoneNumber,
                    password: formData.password,
                    state: formData.state,
                    city: formData.city,
                    pincode: formData.pincode,
                    qualification: formData.qualification,
                    experience: formData.experience,
                    role: formData.userRole,
                    domain: formData.domain,
                });
                if (response.success) {
                    setMode('login');
                    setError(t('registrationSuccess'));
                }
            } else if (role === 'recruiter') {
                const response = await api.registerRecruiter({
                    companyName: formData.companyName,
                    entityType: formData.entityType,
                    phoneNumber: formData.phoneNumber,
                    password: formData.password,
                });
                if (response.success) {
                    setMode('login');
                    setError(t('registrationSuccess'));
                }
            }
        } catch (err) {
            setError((err as Error).message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-sm" style={{ padding: '60px 20px' }}>
            <div className="glass-card">
                <h1 className="text-center mb-6">{mode === 'login' ? t('login') : t('register')}</h1>

                {/* Role Selection */}
                {!role && (
                    <div>
                        <p className="text-center text-gray mb-4">Select your role</p>
                        <div className="grid grid-3 gap-3">
                            <button className="btn btn-secondary" onClick={() => setRole('user')}>
                                {t('evTechnician')}
                            </button>
                            <button className="btn btn-secondary" onClick={() => setRole('recruiter')}>
                                {t('recruiter')}
                            </button>
                            <button className="btn btn-secondary" onClick={() => setRole('admin')}>
                                {t('admin')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Auth Form */}
                {role && (
                    <>
                        {/* Mode Toggle */}
                        {role !== 'admin' && (
                            <div className="flex justify-center gap-4 mb-6">
                                <button
                                    className={`btn ${mode === 'login' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setMode('login')}
                                >
                                    {t('login')}
                                </button>
                                <button
                                    className={`btn ${mode === 'register' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setMode('register')}
                                >
                                    {t('register')}
                                </button>
                            </div>
                        )}

                        {error && (
                            <div className={`badge mb-4 ${error.includes('Success') ? 'badge-success' : 'badge-error'}`}
                                style={{ display: 'block', textAlign: 'center', padding: '0.75rem' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
                            {/* Registration-only fields */}
                            {mode === 'register' && (
                                <div className="form-group">
                                    <label className="form-label">{t('fullName')} *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        className="form-control"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">{t('phoneNumber')} *</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    className="form-control"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    maxLength={10}
                                    placeholder="10-digit mobile number"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('password')} *</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    value={formData.password}
                                    onChange={handleChange}
                                    minLength={6}
                                    required
                                />
                            </div>

                            {mode === 'register' && (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">{t('confirmPassword')} *</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className="form-control"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            minLength={6}
                                            required
                                        />
                                    </div>

                                    {/* User-specific fields */}
                                    {role === 'user' && (
                                        <>
                                            <div className="grid grid-2 gap-4">
                                                <div className="form-group">
                                                    <label className="form-label">{t('state')}</label>
                                                    <input name="state" className="form-control" value={formData.state} onChange={handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">{t('city')}</label>
                                                    <input name="city" className="form-control" value={formData.city} onChange={handleChange} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">{t('qualification')}</label>
                                                <select name="qualification" className="form-control" value={formData.qualification} onChange={handleChange}>
                                                    <option value="">Select</option>
                                                    <option value="ITI">ITI</option>
                                                    <option value="Diploma">Diploma</option>
                                                    <option value="10th Pass">10th Pass</option>
                                                    <option value="12th Pass">12th Pass</option>
                                                    <option value="B.Tech">B.Tech / B.E.</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">{t('experience')}</label>
                                                <select name="experience" className="form-control" value={formData.experience} onChange={handleChange}>
                                                    <option value="">Select</option>
                                                    <option value="Fresher">Fresher</option>
                                                    <option value="1 year">1 year</option>
                                                    <option value="2 years">2 years</option>
                                                    <option value="3 years">3 years</option>
                                                    <option value="5+ years">5+ years</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Domain</label>
                                                <select name="domain" className="form-control" value={formData.domain} onChange={handleChange}>
                                                    <option value="EV">EV</option>
                                                    <option value="BS6">BS6</option>
                                                </select>
                                            </div>
                                        </>
                                    )}

                                    {/* Recruiter-specific fields */}
                                    {role === 'recruiter' && (
                                        <>
                                            <div className="form-group">
                                                <label className="form-label">{t('companyName')} *</label>
                                                <input name="companyName" className="form-control" value={formData.companyName} onChange={handleChange} required />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Entity Type</label>
                                                <select name="entityType" className="form-control" value={formData.entityType} onChange={handleChange}>
                                                    <option value="">Select</option>
                                                    <option value="Dealer">Dealer</option>
                                                    <option value="Fleet">Fleet</option>
                                                    <option value="OEM">OEM</option>
                                                    <option value="Workshop">Workshop</option>
                                                </select>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}

                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                                {loading ? t('loading') : (mode === 'login' ? t('login') : t('register'))}
                            </button>
                        </form>

                        <button
                            className="btn btn-outline mt-4"
                            style={{ width: '100%' }}
                            onClick={() => setRole(null)}
                        >
                            {t('back')}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
