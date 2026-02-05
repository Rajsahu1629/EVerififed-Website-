import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';

const ProfilePage: React.FC = () => {
    const { user, updateUser, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || user?.full_name || '',
        state: user?.state || '',
        city: user?.city || '',
        pincode: user?.pincode || '',
        qualification: user?.qualification || '',
        experience: user?.experience || '',
        currentWorkshop: user?.currentWorkshop || user?.current_workshop || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            await api.updateUser(user.id, {
                fullName: formData.fullName,
                state: formData.state,
                city: formData.city,
                pincode: formData.pincode,
                qualification: formData.qualification,
                experience: formData.experience,
                currentWorkshop: formData.currentWorkshop,
            });
            updateUser({ ...user, ...formData });
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = () => {
        const status = user?.verificationStatus || user?.verification_status || 'pending';
        const colors: Record<string, string> = {
            verified: 'badge-success',
            approved: 'badge-success',
            pending: 'badge-warning',
            rejected: 'badge-error',
        };
        return <span className={`badge ${colors[status] || 'badge-secondary'}`}>{status}</span>;
    };

    return (
        <div className="container-sm" style={{ padding: '60px 20px' }}>
            <div className="glass-card">
                <div className="flex justify-between items-center mb-6">
                    <h1>{t('profile')}</h1>
                    {getStatusBadge()}
                </div>

                {/* Profile Avatar */}
                <div className="text-center mb-6">
                    <div
                        style={{
                            width: '100px',
                            height: '100px',
                            margin: '0 auto',
                            background: 'linear-gradient(135deg, #00e676, #00b8d4)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                        }}
                    >
                        👤
                    </div>
                    <h2 className="mt-4">{formData.fullName || 'User'}</h2>
                    <p className="text-gray">{user?.role || 'Technician'} • {user?.domain || 'EV'}</p>
                </div>

                {/* Profile Form */}
                <div>
                    <div className="form-group">
                        <label className="form-label">{t('fullName')}</label>
                        <input
                            type="text"
                            name="fullName"
                            className="form-control"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('phoneNumber')}</label>
                        <input
                            type="text"
                            className="form-control"
                            value={user?.phoneNumber || user?.phone_number || ''}
                            disabled
                        />
                    </div>

                    <div className="grid grid-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">{t('state')}</label>
                            <input type="text" name="state" className="form-control" value={formData.state} onChange={handleChange} disabled={!isEditing} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('city')}</label>
                            <input type="text" name="city" className="form-control" value={formData.city} onChange={handleChange} disabled={!isEditing} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('pincode')}</label>
                        <input type="text" name="pincode" className="form-control" value={formData.pincode} onChange={handleChange} disabled={!isEditing} maxLength={6} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('qualification')}</label>
                        <select name="qualification" className="form-control" value={formData.qualification} onChange={handleChange} disabled={!isEditing}>
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
                        <select name="experience" className="form-control" value={formData.experience} onChange={handleChange} disabled={!isEditing}>
                            <option value="">Select</option>
                            <option value="Fresher">Fresher</option>
                            <option value="1 year">1 year</option>
                            <option value="2 years">2 years</option>
                            <option value="3 years">3 years</option>
                            <option value="5+ years">5+ years</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Current Workshop</label>
                        <input type="text" name="currentWorkshop" className="form-control" value={formData.currentWorkshop} onChange={handleChange} disabled={!isEditing} />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    {isEditing ? (
                        <>
                            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                {t('cancel')}
                            </button>
                            <button className="btn btn-primary" onClick={handleSave} style={{ flex: 1 }} disabled={loading}>
                                {loading ? t('loading') : t('save')}
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)} style={{ flex: 1 }}>
                                {t('edit')} {t('profile')}
                            </button>
                            <button className="btn btn-danger" onClick={() => { logout(); navigate('/'); }}>
                                {t('logout')}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
