import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi';

interface Translations {
    [key: string]: {
        en: string;
        hi: string;
    };
}

// Translations (from mobile app)
export const translations: Translations = {
    // App general
    appName: { en: 'EVerified', hi: 'EVerified' },
    tagline: { en: 'Trusted Platform for EV & BS6 Workforce', hi: 'EV & BS6 वर्कफोर्स के लिए भरोसेमंद प्लेटफॉर्म' },
    selectLanguage: { en: 'Select Language', hi: 'भाषा चुनें' },
    continue: { en: 'Continue', hi: 'जारी रखें' },

    // Roles
    evTechnician: { en: 'EV Technician', hi: 'EV तकनीशियन' },
    recruiter: { en: 'Recruiter', hi: 'रिक्रूटर' },
    admin: { en: 'Admin', hi: 'एडमिन' },

    // Actions
    login: { en: 'Login', hi: 'लॉगिन करें' },
    register: { en: 'Register', hi: 'पंजीकरण करें' },
    logout: { en: 'Logout', hi: 'लॉगआउट' },
    submit: { en: 'Submit', hi: 'सबमिट करें' },
    next: { en: 'Next', hi: 'आगे बढ़ें' },
    back: { en: 'Back', hi: 'वापस जाएं' },
    save: { en: 'Save', hi: 'सेव करें' },
    cancel: { en: 'Cancel', hi: 'रद्द करें' },
    edit: { en: 'Edit', hi: 'संपादित करें' },
    delete: { en: 'Delete', hi: 'हटाएं' },
    apply: { en: 'Apply', hi: 'आवेदन करें' },
    applied: { en: 'Applied', hi: 'आवेदित' },

    // Form fields
    fullName: { en: 'Full Name', hi: 'पूरा नाम' },
    phoneNumber: { en: 'Phone Number', hi: 'फ़ोन नंबर' },
    password: { en: 'Password', hi: 'पासवर्ड' },
    confirmPassword: { en: 'Confirm Password', hi: 'पासवर्ड की पुष्टि करें' },
    state: { en: 'State', hi: 'राज्य' },
    city: { en: 'City', hi: 'शहर' },
    pincode: { en: 'Pincode', hi: 'पिनकोड' },
    qualification: { en: 'Qualification', hi: 'योग्यता' },
    experience: { en: 'Experience', hi: 'अनुभव' },

    // Dashboard
    welcome: { en: 'Welcome', hi: 'स्वागत है' },
    dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
    jobs: { en: 'Jobs', hi: 'नौकरियां' },
    appliedJobs: { en: 'Applied Jobs', hi: 'आवेदित नौकरियां' },
    idCard: { en: 'ID Card', hi: 'आईडी कार्ड' },
    profile: { en: 'Profile', hi: 'प्रोफाइल' },

    // Verification
    verificationStatus: { en: 'Verification Status', hi: 'वेरिफिकेशन स्थिति' },
    pending: { en: 'Pending', hi: 'लंबित' },
    verified: { en: 'Verified', hi: 'वेरिफाइड' },
    approved: { en: 'Approved', hi: 'स्वीकृत' },
    rejected: { en: 'Rejected', hi: 'अस्वीकृत' },
    skillVerification: { en: 'Skill Verification', hi: 'स्किल वेरिफिकेशन' },
    startVerification: { en: 'Start Verification', hi: 'वेरिफिकेशन शुरू करें' },

    // Job posting
    postNewJob: { en: 'Post New Job', hi: 'नई नौकरी पोस्ट करें' },
    previousJobPosts: { en: 'Previous Job Posts', hi: 'पिछली नौकरी पोस्ट' },
    companyName: { en: 'Company Name', hi: 'कंपनी का नाम' },
    roleRequired: { en: 'Role Required', hi: 'आवश्यक भूमिका' },
    numberOfPeople: { en: 'Number of People', hi: 'कितने लोग चाहिए' },
    salaryRange: { en: 'Salary Range', hi: 'वेतन सीमा' },
    jobDescription: { en: 'Job Description', hi: 'नौकरी का विवरण' },

    // Admin
    adminDashboard: { en: 'Admin Dashboard', hi: 'एडमिन डैशबोर्ड' },
    pendingJobs: { en: 'Pending Jobs', hi: 'लंबित नौकरियां' },
    totalCandidates: { en: 'Total Candidates', hi: 'कुल उम्मीदवार' },
    verifiedCandidates: { en: 'Verified Candidates', hi: 'वेरिफाइड उम्मीदवार' },
    totalRecruiters: { en: 'Total Recruiters', hi: 'कुल रिक्रूटर' },
    approve: { en: 'Approve', hi: 'स्वीकृत करें' },
    reject: { en: 'Reject', hi: 'अस्वीकृत करें' },

    // Quiz
    question: { en: 'Question', hi: 'प्रश्न' },
    score: { en: 'Score', hi: 'स्कोर' },
    congratulations: { en: 'Congratulations!', hi: 'बधाई हो!' },

    // Messages
    applicationSubmitted: { en: 'Application Submitted!', hi: 'आवेदन सबमिट हो गया!' },
    loginSuccess: { en: 'Login Successful!', hi: 'लॉगिन सफल!' },
    loginFailed: { en: 'Login Failed', hi: 'लॉगिन विफल' },
    registrationSuccess: { en: 'Registration Successful!', hi: 'पंजीकरण सफल!' },
    error: { en: 'Error', hi: 'त्रुटि' },
    loading: { en: 'Loading...', hi: 'लोड हो रहा है...' },
    noDataAvailable: { en: 'No data available', hi: 'कोई डेटा उपलब्ध नहीं' },

    // Validation
    required: { en: 'This field is required', hi: 'यह फ़ील्ड आवश्यक है' },
    invalidPhone: { en: 'Please enter a valid phone number', hi: 'कृपया वैध फ़ोन नंबर दर्ज करें' },
    passwordMismatch: { en: 'Passwords do not match', hi: 'पासवर्ड मेल नहीं खाते' },

    // Misc
    search: { en: 'Search', hi: 'खोजें' },
    filter: { en: 'Filter', hi: 'फ़िल्टर' },
    download: { en: 'Download', hi: 'डाउनलोड' },
    share: { en: 'Share', hi: 'शेयर करें' },
    browseJobs: { en: 'Browse Jobs', hi: 'नौकरियां खोजें' },
    getVerified: { en: 'Get Verified', hi: 'वेरिफाई हों' },
    searchCandidates: { en: 'Search Candidates', hi: 'उम्मीदवार खोजें' },
};

const LANGUAGE_KEY = 'everified_language';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        try {
            const saved = localStorage.getItem(LANGUAGE_KEY);
            return (saved as Language) || 'en';
        } catch {
            return 'en';
        }
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem(LANGUAGE_KEY, lang);
        document.documentElement.lang = lang;
    };

    const t = (key: string): string => {
        const translation = translations[key];
        if (!translation) {
            console.warn(`Translation missing for key: ${key}`);
            return key;
        }
        return translation[language] || translation['en'] || key;
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'hi' : 'en');
    };

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
