import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import type { User } from '../services/api';

const AdminVerificationPage: React.FC = () => {
    const { t } = useLanguage();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPendingUsers();
    }, []);

    const loadPendingUsers = async () => {
        try {
            const pendingUsers = await api.getPendingVerificationUsers();
            setUsers(pendingUsers);
        } catch (error) {
            console.error('Error loading pending users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (userId: number) => {
        try {
            await api.adminVerifyUser(userId);
            setUsers(users.filter((u) => u.id !== userId));
            alert('User verified successfully!');
        } catch (error) {
            alert('Failed to verify user');
        }
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '60px 20px' }}>
            <h1 className="mb-6">User Verification</h1>
            <p className="text-gray mb-6">{users.length} users pending admin verification</p>

            {users.length === 0 ? (
                <div className="text-center" style={{ padding: '60px 0' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                    <h3 className="text-gray">No pending verifications</h3>
                    <p className="text-gray">All users have been verified.</p>
                </div>
            ) : (
                <div className="grid grid-2">
                    {users.map((user) => (
                        <div key={user.id} className="card">
                            <div className="flex justify-between items-start mb-3">
                                <h3>{user.fullName || user.full_name || 'Unknown'}</h3>
                                <span className="badge badge-warning">Pending</span>
                            </div>

                            <div className="text-gray text-sm mb-3">
                                <div>📞 {user.phoneNumber || user.phone_number || '--'}</div>
                                <div>📍 {user.city || '--'}, {user.state || '--'}</div>
                                <div>💼 {user.experience || 'Not specified'}</div>
                                <div>🎓 {user.qualification || 'Not specified'}</div>
                                <div>🏷️ {user.role || 'Technician'} • {user.domain || 'EV'}</div>
                            </div>

                            {(user.quizScore || user.quiz_score) && (
                                <div className="mb-3">
                                    <strong>Quiz Score:</strong> {user.quizScore || user.quiz_score}/{user.totalQuestions || user.total_questions || 10}
                                </div>
                            )}

                            <button className="btn btn-success" style={{ width: '100%' }} onClick={() => handleVerify(user.id)}>
                                ✓ Verify User
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminVerificationPage;
