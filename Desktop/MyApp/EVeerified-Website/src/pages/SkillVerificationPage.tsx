import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api, type VerificationQuestion } from '../services/api';

const SkillVerificationPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<VerificationQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    // Determine current step based on user status
    const stepToLoad = (user?.verificationStatus === 'step1_completed' && user?.role === 'technician') ? 2 : 1;

    useEffect(() => {
        const init = async () => {
            if (user?.id) {
                // Always fetch the latest user data to ensure we have accurate verification status and timestamps
                try {
                    const freshUser = await api.getUser(user.id);
                    if (freshUser) {
                        updateUser({ ...user, ...freshUser });
                        // We continue with 'freshUser' logic below to avoid waiting for state update
                        checkAccess(freshUser);
                        loadQuestions(freshUser);
                    }
                } catch (error) {
                    console.error("Failed to fetch fresh user data:", error);
                    // Fallback to existing user
                    checkAccess(user);
                    loadQuestions(user);
                }
            }
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount

    const checkAccess = (currentUser: any) => {
        if (!currentUser) return;

        // 1. Check if already verified (Technician Step 2 done, or others Step 1 done)
        if (currentUser.verificationStatus === 'verified' || currentUser.verificationStatus === 'approved') {
            alert('You are already verified!');
            navigate('/id-card');
            return;
        }

        // 2. Check for cooldown
        if (currentUser.verificationStatus === 'failed') {
            const failedAt = currentUser.quizFailedAt || currentUser.quiz_failed_at;
            if (failedAt) {
                const lastFailedDate = new Date(failedAt);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - lastFailedDate.getTime());
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Use floor to count full days passed
                const daysRemaining = 7 - diffDays;

                if (diffDays < 7) {
                    alert(`You are in a cooling period. Please try again in ${daysRemaining} days.`);
                    navigate('/id-card');
                }
            }
        }
    };

    const loadQuestions = async (currentUser: any) => {
        if (!currentUser) return;
        try {
            const role = (currentUser.role === 'aspirant' ? 'technician' : currentUser.role) || 'technician';
            const currentStep = (currentUser.verificationStatus === 'step1_completed' && currentUser.role === 'technician') ? 2 : 1;

            console.log("Loading questions for role:", role, "Step:", currentStep);

            const result = await api.getVerificationQuestions(role, currentStep);
            setQuestions(result);
        } catch (error) {
            console.error('Error loading questions:', error);
            alert(t('failedToLoadQuestions') || 'Failed to load questions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = (optionIndex: number) => {
        if (!questions[currentQuestionIndex]) return;
        setAnswers(prev => ({
            ...prev,
            [questions[currentQuestionIndex].id]: optionIndex,
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((q) => {
            const selectedIndex = answers[q.id];
            if (selectedIndex !== undefined && q.options[selectedIndex]?.isCorrect) {
                correct++;
            }
        });
        return correct;
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) {
            alert(t('answerAllQuestions') || 'Please answer all questions');
            return;
        }

        setIsSubmitting(true);
        const finalScore = calculateScore();
        setScore(finalScore);

        try {
            const percentage = (finalScore / questions.length) * 100;
            const passed = percentage >= 70;

            let newStatus = user?.verificationStatus;
            const isSingleStepRole = user?.role === 'sales' || user?.role === 'workshop' || user?.role === 'aspirant';

            // Logic matching mobile app
            if (user?.domain === 'BS6' && user?.role === 'technician') {
                if (passed) {
                    if (stepToLoad === 1) newStatus = 'step1_completed';
                    else if (stepToLoad === 2) newStatus = 'verified';
                } else {
                    newStatus = 'failed';
                }
            } else {
                if (stepToLoad === 1 && passed) {
                    newStatus = isSingleStepRole ? 'verified' : 'step1_completed';
                } else if (stepToLoad === 2 && passed) {
                    newStatus = 'verified';
                } else if (!passed) {
                    newStatus = 'failed';
                }
            }

            const now = new Date().toISOString();

            // Update backend
            if (user?.id) {
                const payload: any = {
                    verificationStatus: newStatus as any,
                    quizScore: finalScore,
                    totalQuestions: questions.length,
                    verificationStep: stepToLoad,
                };

                if (newStatus === 'failed') {
                    payload.quizFailedAt = now;
                    payload.quiz_failed_at = now;
                }

                await api.updateUserVerification(user.id, payload);

                // Update local context immediately so access checks work on reload/navigation
                if (user) {
                    const updatedUser = {
                        ...user,
                        verificationStatus: newStatus,
                        quizScore: finalScore,
                        ...(newStatus === 'failed' ? { quizFailedAt: now, quiz_failed_at: now } : {})
                    };
                    updateUser(updatedUser);
                }
            }

            setShowResults(true);

        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert(t('submitFailed') || 'Failed to submit quiz');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to get text based on language
    const getLocalizedText = (obj: any, keyPrefix: string) => {
        if (!obj) return '';
        const lang = language as string;
        if (lang === 'hi') return obj[`${keyPrefix}_hi`];
        if (lang === 'mr') return obj[`${keyPrefix}_mr`] || obj[`${keyPrefix}_en`];
        if (lang === 'kn') return obj[`${keyPrefix}_kn`] || obj[`${keyPrefix}_en`];
        if (lang === 'te') return obj[`${keyPrefix}_te`] || obj[`${keyPrefix}_en`];
        if (lang === 'or') return obj[`${keyPrefix}_or`] || obj[`${keyPrefix}_en`];
        return obj[`${keyPrefix}_en`];
    };

    const getOptionText = (option: any) => {
        const lang = language as string;
        if (lang === 'hi') return option.hi;
        if (lang === 'mr') return option.mr || option.en;
        if (lang === 'kn') return option.kn || option.en;
        if (lang === 'te') return option.te || option.en;
        if (lang === 'or') return option.or || option.en;
        return option.en;
    }


    if (isLoading) {
        return <div className="container text-center p-5">Loading questions...</div>;
    }

    if (showResults) {
        const percentage = (score / questions.length) * 100;
        const passed = percentage >= 70;

        return (
            <div className="container" style={{ padding: '60px 20px', maxWidth: '600px', textAlign: 'center' }}>
                <div style={{ fontSize: '5rem', marginBottom: '1rem', color: passed ? '#10b981' : '#ef4444' }}>
                    {passed ? '✓' : '✗'}
                </div>
                <h1>{passed ? t('congratulations') : (t('quizFailed') || 'Quiz Failed')}</h1>
                <p className="text-xl mb-4">
                    {t('score')}: {score}/{questions.length} ({percentage.toFixed(0)}%)
                </p>
                <p className="text-gray mb-6">
                    {passed
                        ? (stepToLoad === 1 && user?.role === 'technician' ? 'Step 1 Passed! Proceed to Step 2.' : 'Verification Complete!')
                        : 'You did not pass. Please try again later.'}
                </p>

                {passed && user?.role === 'technician' && stepToLoad === 1 ? (
                    <button className="btn btn-primary btn-lg w-100" onClick={() => window.location.reload()}>
                        Continue to Step 2
                    </button>
                ) : (
                    <button className="btn btn-primary btn-lg w-100" onClick={() => navigate('/user-dashboard')}>
                        Go to Dashboard
                    </button>
                )}
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return <div className="container p-5">No questions available.</div>;

    const selectedAnswer = answers[currentQuestion.id];

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/user-dashboard')}>
                        ← Back
                    </button>
                    <div className="text-primary font-bold">
                        Step {stepToLoad}
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                        height: '100%',
                        background: '#10b981',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
                <div className="text-right text-sm text-gray mt-1">
                    Question {currentQuestionIndex + 1} / {questions.length}
                </div>
            </div>

            <div className="card mb-6">
                <h3 className="mb-4 text-xl">
                    {getLocalizedText(currentQuestion, 'question_text')}
                </h3>

                <div className="flex flex-col gap-3">
                    {currentQuestion.options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleAnswer(index)}
                            style={{
                                padding: '15px',
                                border: `2px solid ${selectedAnswer === index ? '#10b981' : '#e5e7eb'}`,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                background: selectedAnswer === index ? 'rgba(16, 185, 129, 0.05)' : 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                color: '#000'
                            }}
                        >
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                border: `2px solid ${selectedAnswer === index ? '#10b981' : '#d1d5db'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {selectedAnswer === index && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />}
                            </div>
                            <span>{getOptionText(option)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between gap-4">
                <button
                    className="btn btn-outline flex-1"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                >
                    {t('previous')}
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                    <button
                        className="btn btn-primary flex-1"
                        onClick={handleNext}
                        disabled={selectedAnswer === undefined}
                    >
                        {t('next')}
                    </button>
                ) : (
                    <button
                        className="btn btn-primary flex-1"
                        onClick={handleSubmit}
                        disabled={selectedAnswer === undefined || isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : t('submit')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default SkillVerificationPage;
