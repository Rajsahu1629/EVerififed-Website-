import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { Eye, EyeOff } from 'lucide-react';

type Role = 'user' | 'recruiter' | 'admin';
type Mode = 'login' | 'register';
type UserRole = 'technician' | 'aspirant' | 'workshop' | 'sales';

const AuthPage: React.FC = () => {
    const { loginUser, loginRecruiter, loginAdmin } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    const [role, setRole] = useState<Role | null>(null);
    const [candidateRoleSelected, setCandidateRoleSelected] = useState(false);
    const [mode, setMode] = useState<Mode>('login');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const type = searchParams.get('type');
        if (type === 'recruiter') {
            setRole('recruiter');
            setCandidateRoleSelected(true);
        } else if (type === 'candidate' || type === 'user') {
            setRole('user');
            setCandidateRoleSelected(false); // Ensure they see the role selection screen
        }
    }, [location.search]);

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
        userRole: 'technician' as UserRole,
        domain: 'EV',
        // BS6 specific fields
        trainingRole: '',
        vehicleCategory: '',
        // Brand fields
        brands: [] as string[],
        otherBrandName: '',
        // Recruiter fields
        companyName: '',
        entityType: '',
        fullAddress: '',
        priorKnowledge: '',
        currentWorkshop: '',
        brandWorkshop: '',
        currentSalary: '',
        otherQualification: '',
    });

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
        "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
        "Lakshadweep", "Puducherry"
    ];

    const vehicleCategoryOptions = [
        { label: '2 Wheeler', value: '2W' },
        { label: '3 Wheeler', value: '3W' },
    ];

    const trainingRoleOptions = [
        { label: 'Basic', value: 'Basic' },
        { label: 'Engine Expert', value: 'Engine Expert (Electrical)' },
        { label: 'Diagnosis Expert (Electrical)', value: 'Diagnosis Expert' },
        { label: 'Diagnosis + Engine Expert', value: 'Diagnosis + Engine Expert' },
    ];

    const experienceOptions = [
        { label: '0-1 years', value: '0-1' },
        { label: '1-2 years', value: '1-2' },
        { label: '2-3 years', value: '2-3' },
        { label: '3-4 years', value: '3-4' },
        { label: '4-5 years', value: '4-5' },
        { label: '5-6 years', value: '5-6' },
        { label: '6-7 years', value: '6-7' },
        { label: '7-8 years', value: '7-8' },
        { label: '8+ years', value: '8+' },
    ];

    const roleOptions: { value: UserRole; label: string; icon: string }[] = [
        { value: 'technician', label: 'Technician', icon: '🔧' },
        { value: 'aspirant', label: 'Fresher', icon: '🎓' },
        { value: 'workshop', label: 'Workshop Manager', icon: '🏭' },
        { value: 'sales', label: 'Sales Manager', icon: '💼' },
    ];

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
                if (formData.phoneNumber === '9473928468' && formData.password === 'Rajsahu@2000') {
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

    const evBrands = ['Bajaj', 'Ola', 'Ather', 'TVS', 'Hero', 'Mahindra', 'Tata', 'Hero Electric', 'Other'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const toggleBrand = (brand: string) => {
        const currentBrands = formData.brands;
        const newBrands = currentBrands.includes(brand)
            ? currentBrands.filter(b => b !== brand)
            : [...currentBrands, brand];
        setFormData({ ...formData, brands: newBrands });
    };

    const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);

    const [step, setStep] = useState(1);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Validation
    const validateStep1 = () => {
        if (!formData.fullName) return t('required');
        if (!validatePhone(formData.phoneNumber)) return t('invalidPhone');
        if (mode === 'register') {
            if (!formData.password || formData.password.length < 6) return t('passwordLength');
            if (formData.password !== formData.confirmPassword) return t('passwordMismatch');
        }
        if (!formData.state) return t('required');
        if (!formData.city) return t('required');
        if (!formData.domain) return t('required');
        if (formData.userRole !== 'aspirant' && !formData.vehicleCategory) return t('required');
        if (formData.userRole === 'aspirant') {
            if (!formData.qualification) return t('required');
            if (formData.qualification === 'other' && !formData.otherQualification) return t('required');
            if (!agreedToTerms) return t('termsRequired');
        }
        return '';
    };

    const validateStep2 = () => {
        if (!formData.qualification) return t('required');
        if (formData.qualification === 'other' && !formData.otherQualification) return t('required');
        if (!formData.experience) return t('required');
        const finalBrands = formData.brands.filter(b => b); // simplistic check
        if (formData.userRole !== 'aspirant' && finalBrands.length === 0) return t('selectAtLeastOne');
        if (formData.brands.includes('Other') && !formData.otherBrandName) return t('required');
        return '';
    };

    const handleNext = () => {
        // Step 1 Validation
        if (step === 1) {
            const err = validateStep1();
            if (err) {
                setError(err);
                return;
            }
            if (formData.userRole === 'aspirant') {
                // Aspirants submit after step 1
                handleRegister({ preventDefault: () => { } } as React.FormEvent);
            } else {
                setStep(2);
                setError('');
            }
        } else if (step === 2) {
            const err = validateStep2();
            if (err) {
                setError(err);
                return;
            }
            setStep(3);
            setError('');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final validation before submit
        if (role === 'user' && formData.userRole !== 'aspirant' && !agreedToTerms) {
            setError(t('termsRequired'));
            return;
        }

        if (role === 'recruiter' && !agreedToTerms) {
            setError(t('termsRequired'));
            return;
        }

        setLoading(true);
        try {
            if (role === 'user') {
                // Prepare brands array
                let finalBrands = formData.brands;
                if (formData.userRole === 'aspirant') {
                    finalBrands = [];
                } else {
                    // Replace "Other" with actual name if present
                    finalBrands = formData.brands.map(b => b === 'Other' ? formData.otherBrandName : b).filter(b => b);
                }

                const response = await api.registerUser({
                    fullName: formData.fullName,
                    phoneNumber: formData.phoneNumber,
                    password: formData.password,
                    state: formData.state,
                    city: formData.city,
                    pincode: formData.pincode,
                    qualification: formData.qualification === 'other' ? formData.otherQualification : formData.qualification,
                    experience: formData.userRole === 'aspirant' ? 'fresher' : formData.experience,
                    role: formData.userRole,
                    domain: formData.domain,
                    training_role: formData.trainingRole,
                    vehicle_category: formData.vehicleCategory,
                    brands: finalBrands,
                    prior_knowledge: formData.priorKnowledge, // New field for Aspirants
                    current_salary: formData.userRole === 'aspirant' ? '0' : formData.currentSalary,
                    current_workshop: formData.currentWorkshop,
                    brand_workshop: formData.brandWorkshop,
                });
                if (response.success) {
                    setMode('login');
                    setStep(1); // Reset step
                    setError(t('registrationSuccess'));
                }
            } else if (role === 'recruiter') {
                const response = await api.registerRecruiter({
                    companyName: formData.companyName,
                    entityType: formData.entityType,
                    phoneNumber: formData.phoneNumber,
                    password: formData.password,
                    fullAddress: formData.fullAddress,
                    state: formData.state,
                    city: formData.city,
                    pincode: formData.pincode,
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

    const renderStep1 = () => (
        <>
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
            <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">{t('password')} *</label>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                    style={{ paddingRight: '40px' }}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '42px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    {showPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
                </button>
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">{t('confirmPassword')} *</label>
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="form-control"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength={6}
                    required
                    style={{ paddingRight: '40px' }}
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '12px', top: '42px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    {showConfirmPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
                </button>
            </div>

            <div className="grid grid-2 gap-4">
                <div className="form-group">
                    <label className="form-label">{t('state')} *</label>
                    <select name="state" className="form-control" value={formData.state} onChange={handleChange} required>
                        <option value="">Select State</option>
                        {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">{t('city')} *</label>
                    <input name="city" className="form-control" value={formData.city} onChange={handleChange} required />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Domain *</label>
                <div className="flex gap-3">
                    <button
                        type="button"
                        className={`btn ${formData.domain === 'EV' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFormData({ ...formData, domain: 'EV' })}
                        style={{ flex: 1 }}
                    >
                        ⚡ EV
                    </button>
                    <button
                        type="button"
                        className={`btn ${formData.domain === 'BS6' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFormData({ ...formData, domain: 'BS6' })}
                        style={{ flex: 1 }}
                    >
                        🚗 BS6
                    </button>
                </div>
            </div>

            {/* Vehicle Category - Only for non-Aspirants */}
            {formData.userRole !== 'aspirant' && (
                <div className="form-group">
                    <label className="form-label">Vehicle Category *</label>
                    <select name="vehicleCategory" className="form-control" value={formData.vehicleCategory} onChange={handleChange}>
                        <option value="">Select Vehicle Category</option>
                        {vehicleCategoryOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
            )}

            <div className="form-group">
                <label className="form-label">{t('pincode')} *</label>
                <input name="pincode" className="form-control" value={formData.pincode} onChange={handleChange} maxLength={6} required />
            </div>

            {/* Aspirants Fields */}
            {formData.userRole === 'aspirant' && (
                <>
                    <div className="form-group">
                        <label className="form-label">{t('qualification')} *</label>
                        <select name="qualification" className="form-control" value={formData.qualification} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="10th">10th Pass</option>
                            <option value="12th">12th Pass</option>
                            <option value="iti">ITI</option>
                            <option value="diploma">Diploma</option>
                            <option value="btech">B.Tech / B.E.</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {formData.qualification === 'other' && (
                        <div className="form-group">
                            <label className="form-label">Specify Qualification *</label>
                            <input name="otherQualification" className="form-control" value={formData.otherQualification} onChange={handleChange} />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Prior Knowledge / Experience</label>
                        <textarea
                            name="priorKnowledge"
                            className="form-control"
                            value={formData.priorKnowledge}
                            onChange={(e) => setFormData({ ...formData, priorKnowledge: e.target.value })}
                            rows={3}
                            placeholder="Tell us about what you know..."
                        />
                    </div>

                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                style={{ width: 'auto', marginRight: '0.5rem' }}
                            />
                            <span style={{ fontSize: '0.9rem' }}>I agree to the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Terms & Conditions</a></span>
                        </label>
                    </div>
                </>
            )}
        </>
    );

    const renderStep2 = () => (
        <>
            <div className="form-group">
                <label className="form-label">{t('qualification')} *</label>
                <select name="qualification" className="form-control" value={formData.qualification} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="10th">10th Pass</option>
                    <option value="12th">12th Pass</option>
                    <option value="iti">ITI</option>
                    <option value="diploma">Diploma</option>
                    <option value="btech">B.Tech / B.E.</option>
                    <option value="other">Other</option>
                </select>
            </div>

            {formData.qualification === 'other' && (
                <div className="form-group">
                    <label className="form-label">Specify Qualification *</label>
                    <input name="otherQualification" className="form-control" value={formData.otherQualification} onChange={handleChange} />
                </div>
            )}

            {/* BS6 Specific Field: Training Role */}
            {formData.domain === 'BS6' && formData.userRole === 'technician' && (
                <div className="form-group">
                    <label className="form-label">Training Role</label>
                    <select name="trainingRole" className="form-control" value={formData.trainingRole} onChange={handleChange}>
                        <option value="">Select Training Role</option>
                        {trainingRoleOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            )}


            <div className="form-group">
                <label className="form-label">{t('experience')} *</label>
                <select name="experience" className="form-control" value={formData.experience} onChange={handleChange}>
                    <option value="">Select</option>
                    {experienceOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Current Workshop</label>
                <input name="currentWorkshop" className="form-control" value={formData.currentWorkshop} onChange={handleChange} placeholder="Where do you work?" />
            </div>

            {(formData.userRole === 'workshop' || formData.userRole === 'sales') && (
                <div className="form-group">
                    <label className="form-label">Brand Workshop</label>
                    <input name="brandWorkshop" className="form-control" value={formData.brandWorkshop} onChange={handleChange} placeholder="e.g. Tata Motors" />
                </div>
            )}

            <div className="form-group">
                <label className="form-label">Current Salary (₹)</label>
                <input name="currentSalary" className="form-control" value={formData.currentSalary} onChange={handleChange} type="number" placeholder="25000" />
            </div>

            <div className="form-group">
                <label className="form-label">Brands Worked With *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {evBrands.map(brand => (
                        <button
                            key={brand}
                            type="button"
                            onClick={() => toggleBrand(brand)}
                            className={`btn ${formData.brands.includes(brand) ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '6px 12px', fontSize: '0.9rem', borderRadius: '20px', borderWidth: formData.brands.includes(brand) ? '0' : '1px' }}
                        >
                            {brand}
                        </button>
                    ))}
                </div>
            </div>

            {formData.brands.includes('Other') && (
                <div className="form-group">
                    <label className="form-label">Specify Other Brand</label>
                    <input name="otherBrandName" className="form-control" value={formData.otherBrandName} onChange={handleChange} placeholder="Enter brand name" />
                </div>
            )}
        </>
    );

    const renderStep3 = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 className="text-center mb-4">Review & Submit</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <span className="text-gray">Name</span>
                <span style={{ fontWeight: 500 }}>{formData.fullName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <span className="text-gray">Phone</span>
                <span style={{ fontWeight: 500 }}>{formData.phoneNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <span className="text-gray">{t('state')}</span>
                <span style={{ fontWeight: 500 }}>{formData.state}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <span className="text-gray">{t('city')}</span>
                <span style={{ fontWeight: 500 }}>{formData.city}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <span className="text-gray">{t('pincode')}</span>
                <span style={{ fontWeight: 500 }}>{formData.pincode}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <span className="text-gray">Role</span>
                <span style={{ fontWeight: 500 }}>{formData.userRole}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <span className="text-gray">Domain</span>
                <span style={{ fontWeight: 500 }}>{formData.domain}</span>
            </div>
            {formData.userRole !== 'aspirant' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    <span className="text-gray">Vehicle Category</span>
                    <span style={{ fontWeight: 500 }}>{formData.vehicleCategory}</span>
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <span className="text-gray">Qualification</span>
                <span style={{ fontWeight: 500 }}>{formData.qualification}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <span className="text-gray">Experience</span>
                <span style={{ fontWeight: 500 }}>{formData.experience}</span>
            </div>
            {formData.userRole !== 'aspirant' && formData.brands.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    <span className="text-gray">Brands</span>
                    <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{formData.brands.join(', ')}</span>
                </div>
            )}

            <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        style={{ width: 'auto', marginRight: '0.5rem' }}
                    />
                    <span style={{ fontSize: '0.9rem' }}>I agree to the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Terms & Conditions</a></span>
                </label>
            </div>
        </div>
    );

    // If candidate hasn't selected their specific role yet, show role selection page
    if (role === 'user' && !candidateRoleSelected) {
        return (
            <div className="container-sm" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1e293b' }}>Select Your Role</h1>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>What do you do?</p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                    maxWidth: '450px',
                    margin: '0 auto'
                }}>
                    {roleOptions.map((opt) => (
                        <button
                            key={opt.value}
                            className="glass-card"
                            onClick={() => { setFormData({ ...formData, userRole: opt.value }); setCandidateRoleSelected(true); }}
                            style={{ padding: '2rem 1rem', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s', color: '#1e293b', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{opt.icon}</div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{opt.label}</div>
                        </button>
                    ))}
                </div>

                <button
                    className="btn btn-outline"
                    style={{ marginTop: '2rem' }}
                    onClick={() => setRole(null)}
                >
                    ← Back
                </button>
            </div>
        );
    }
    return (
        <div className="container-sm" style={{ padding: '60px 20px' }}>
            <div className="glass-card">
                <h1 className="text-center mb-6">{mode === 'login' ? t('login') : t('register')}</h1>

                {/* Step 1: I'm a Candidate / I'm a Recruiter */}
                {!role && (
                    <div className="flex gap-4 justify-center" style={{ flexWrap: 'wrap', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="flex gap-4 justify-center" style={{ flexWrap: 'wrap' }}>
                            <button className="btn btn-primary btn-lg" onClick={() => setRole('user')}>👤 I'm a Candidate</button>
                            <button className="btn btn-secondary btn-lg" onClick={() => { setRole('recruiter'); setCandidateRoleSelected(true); }}>🏢 I'm a Recruiter</button>
                        </div>
                        <button
                            className="btn btn-outline btn-sm"
                            style={{ marginTop: '1rem', opacity: 0.7 }}
                            onClick={() => { setRole('admin'); setCandidateRoleSelected(true); setMode('login'); }}
                        >
                            🔑 Admin Login
                        </button>
                    </div>
                )}

                {/* Auth Form */}
                {role && candidateRoleSelected && (
                    <>
                        {role !== 'admin' && (
                            <div className="flex justify-center gap-4 mb-6">
                                <button className={`btn ${mode === 'login' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('login')}>{t('login')}</button>
                                <button className={`btn ${mode === 'register' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('register')}>{t('register')}</button>
                            </div>
                        )}

                        {mode === 'register' && role === 'user' && (
                            <div style={{ marginBottom: '20px', display: 'flex', gap: '5px', height: '4px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ flex: 1, background: 'var(--primary)', opacity: step >= 1 ? 1 : 0.2 }}></div>
                                {formData.userRole !== 'aspirant' && (
                                    <>
                                        <div style={{ flex: 1, background: 'var(--primary)', opacity: step >= 2 ? 1 : 0.2 }}></div>
                                        <div style={{ flex: 1, background: 'var(--primary)', opacity: step >= 3 ? 1 : 0.2 }}></div>
                                    </>
                                )}
                            </div>
                        )}

                        {error && (
                            <div className={`badge mb-4 ${error.includes('Success') ? 'badge-success' : 'badge-error'}`} style={{ display: 'block', textAlign: 'center', padding: '0.75rem' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={(e) => {
                            if (mode === 'login') return handleLogin(e);
                            if (role === 'recruiter') return handleRegister(e);
                            e.preventDefault();
                        }}>
                            {mode === 'login' && (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">{t('phoneNumber')} *</label>
                                        <input type="tel" name="phoneNumber" className="form-control" value={formData.phoneNumber} onChange={handleChange} maxLength={10} required />
                                    </div>
                                    <div className="form-group" style={{ position: 'relative' }}>
                                        <label className="form-label">{t('password')} *</label>
                                        <input type={showPassword ? "text" : "password"} name="password" className="form-control" value={formData.password} onChange={handleChange} required style={{ paddingRight: '40px' }} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '42px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            {showPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
                                        </button>
                                    </div>
                                    <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                                        <a
                                            href="https://wa.me/919473928468?text=I%20forgot%20my%20password"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                                        >
                                            {t('forgotPassword')}
                                        </a>
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>{loading ? t('loading') : t('login')}</button>
                                </>
                            )}

                            {mode === 'register' && role === 'user' && (
                                <>
                                    {step === 1 && renderStep1()}
                                    {step === 2 && renderStep2()}
                                    {step === 3 && renderStep3()}

                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                        {step > 1 && (
                                            <button type="button" className="btn btn-secondary" onClick={() => setStep(step - 1)} style={{ flex: 1 }}>
                                                Back
                                            </button>
                                        )}
                                        <button type="button" className="btn btn-primary" onClick={step < 3 && formData.userRole !== 'aspirant' ? handleNext : handleRegister} style={{ flex: 1 }}>
                                            {loading ? t('loading') : (step < 3 && formData.userRole !== 'aspirant' ? 'Next' : 'Submit')}
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Keep existing Recruiter Registration Flow simply as is, rendered if role === 'recruiter' */}
                            {mode === 'register' && role === 'recruiter' && (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">{t('companyName')} *</label>
                                        <input type="text" name="companyName" className="form-control" value={formData.companyName} onChange={handleChange} required />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">{t('phoneNumber')} *</label>
                                        <input type="tel" name="phoneNumber" className="form-control" value={formData.phoneNumber} onChange={handleChange} maxLength={10} required />
                                    </div>

                                    <div className="form-group" style={{ position: 'relative' }}>
                                        <label className="form-label">{t('password')} *</label>
                                        <input type={showPassword ? "text" : "password"} name="password" className="form-control" value={formData.password} onChange={handleChange} minLength={6} required style={{ paddingRight: '40px' }} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '42px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            {showPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
                                        </button>
                                    </div>

                                    <div className="form-group" style={{ position: 'relative' }}>
                                        <label className="form-label">{t('confirmPassword')} *</label>
                                        <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} minLength={6} required style={{ paddingRight: '40px' }} />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '12px', top: '42px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            {showConfirmPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
                                        </button>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Entity Type *</label>
                                        <select name="entityType" className="form-control" value={formData.entityType} onChange={handleChange} required>
                                            <option value="">Select</option>
                                            <option value="Dealer">Dealer</option>
                                            <option value="Fleet">Fleet</option>
                                            <option value="OEM">OEM</option>
                                            <option value="Workshop">Workshop</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Full Address *</label>
                                        <input name="fullAddress" className="form-control" value={formData.fullAddress} onChange={handleChange} required />
                                    </div>

                                    <div className="grid grid-2 gap-4">
                                        <div className="form-group">
                                            <label className="form-label">{t('state')} *</label>
                                            <select name="state" className="form-control" value={formData.state} onChange={handleChange} required>
                                                <option value="">Select State</option>
                                                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">{t('city')} *</label>
                                            <input name="city" className="form-control" value={formData.city} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">{t('pincode')} *</label>
                                        <input name="pincode" className="form-control" value={formData.pincode} onChange={handleChange} maxLength={6} required />
                                    </div>

                                    <div className="form-group" style={{ marginTop: '1rem' }}>
                                        <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={agreedToTerms}
                                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                                style={{ width: 'auto', marginRight: '0.5rem' }}
                                            />
                                            <span style={{ fontSize: '0.9rem' }}>I agree to the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Terms & Conditions</a></span>
                                        </label>
                                    </div>

                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>{loading ? t('loading') : t('register')}</button>
                                </>
                            )}
                        </form>

                        <button className="btn btn-outline mt-4" style={{ width: '100%' }} onClick={() => setRole(null)}>
                            {t('back')}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
