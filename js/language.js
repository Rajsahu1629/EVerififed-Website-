// Language and Translation Support
const LANGUAGE_KEY = 'everified_language';

// Translation dictionary (extracted from mobile app)
const translations = {
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
    currentWorkshop: { en: 'Current Workshop / Company Name', hi: 'वर्तमान वर्कशॉप / कंपनी का नाम' },

    // Qualification options
    iti: { en: 'ITI', hi: 'ITI' },
    diploma: { en: 'Diploma', hi: 'डिप्लोमा' },
    pass10th: { en: '10th Pass', hi: '10वीं पास' },
    pass12th: { en: '12th Pass', hi: '12वीं पास' },
    btech: { en: 'B.Tech / B.E.', hi: 'B.Tech / B.E.' },
    other: { en: 'Other', hi: 'अन्य' },

    // Experience options
    fresher: { en: 'Fresher', hi: 'फ्रेशर' },
    years: { en: 'years', hi: 'वर्ष' },

    // Brands
    bajaj: { en: 'Bajaj', hi: 'बजाज' },
    ola: { en: 'Ola', hi: 'ओला' },
    ather: { en: 'Ather', hi: 'एथर' },

    // Vehicle categories
    twoWheeler: { en: '2 Wheeler', hi: '2 व्हीलर' },
    threeWheeler: { en: '3 Wheeler', hi: '3 व्हीलर' },

    // Verification
    verificationStatus: { en: 'Verification Status', hi: 'वेरिफिकेशन स्थिति' },
    pending: { en: 'Pending', hi: 'लंबित' },
    verified: { en: 'Verified', hi: 'वेरिफाइड' },
    approved: { en: 'Approved', hi: 'स्वीकृत' },
    rejected: { en: 'Rejected', hi: 'अस्वीकृत' },

    // Dashboard
    welcome: { en: 'Welcome', hi: 'स्वागत है' },
    dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
    jobs: { en: 'Jobs', hi: 'नौकरियां' },
    appliedJobs: { en: 'Applied Jobs', hi: 'आवेदित नौकरियां' },
    idCard: { en: 'ID Card', hi: 'आईडी कार्ड' },
    profile: { en: 'Profile', hi: 'प्रोफाइल' },

    // Job posting
    postNewJob: { en: 'Post New Job', hi: 'नई नौकरी पोस्ट करें' },
    previousJobPosts: { en: 'Previous Job Posts', hi: 'पिछली नौकरी पोस्ट' },
    companyName: { en: 'Company Name', hi: 'कंपनी का नाम' },
    roleRequired: { en: 'Role Required', hi: 'आवश्यक भूमिका' },
    numberOfPeople: { en: 'Number of People', hi: 'कितने लोग चाहिए' },
    salaryRange: { en: 'Salary Range', hi: 'वेतन सीमा' },
    jobDescription: { en: 'Job Description', hi: 'नौकरी का विवरण' },

    // Application
    apply: { en: 'Apply', hi: 'आवेदन करें' },
    applied: { en: 'Applied', hi: 'आवेदित' },
    viewDetails: { en: 'View Details', hi: 'विवरण देखें' },

    // Admin
    adminDashboard: { en: 'Admin Dashboard', hi: 'एडमिन डैशबोर्ड' },
    pendingJobs: { en: 'Pending Jobs', hi: 'लंबित नौकरियां' },
    pendingUsers: { en: 'Pending Users', hi: 'लंबित उपयोगकर्ता' },
    approve: { en: 'Approve', hi: 'स्वीकृत करें' },
    reject: { en: 'Reject', hi: 'अस्वीकृत करें' },
    totalCandidates: { en: 'Total Candidates', hi: 'कुल उम्मीदवार' },
    verifiedCandidates: { en: 'Verified Candidates', hi: 'वेरिफाइड उम्मीदवार' },
    totalRecruiters: { en: 'Total Recruiters', hi: 'कुल रिक्रूटर' },

    // Quiz
    skillVerification: { en: 'Skill Verification', hi: 'स्किल वेरिफिकेशन' },
    startVerification: { en: 'Start Verification', hi: 'वेरिफिकेशन शुरू करें' },
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

    // Validation
    required: { en: 'This field is required', hi: 'यह फ़ील्ड आवश्यक है' },
    invalidPhone: { en: 'Please enter a valid phone number', hi: 'कृपया वैध फ़ोन नंबर दर्ज करें' },
    passwordMismatch: { en: 'Passwords do not match', hi: 'पासवर्ड मेल नहीं खाते' },

    // Misc
    search: { en: 'Search', hi: 'खोजें' },
    filter: { en: 'Filter', hi: 'फ़िल्टर' },
    download: { en: 'Download', hi: 'डाउनलोड' },
    share: { en: 'Share', hi: 'शेयर करें' },
    noData: { en: 'No data available', hi: 'कोई डेटा उपलब्ध नहीं' },
};

class LanguageManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'en';
        this.listeners = [];
    }

    getStoredLanguage() {
        try {
            return localStorage.getItem(LANGUAGE_KEY) || 'en';
        } catch {
            return 'en';
        }
    }

    setLanguage(lang) {
        if (lang !== 'en' && lang !== 'hi') {
            console.warn(`Unsupported language: ${lang}, falling back to 'en'`);
            lang = 'en';
        }

        this.currentLanguage = lang;

        try {
            localStorage.setItem(LANGUAGE_KEY, lang);
        } catch (error) {
            console.error('Error saving language preference:', error);
        }

        this.notifyListeners();
        this.updateDocumentLang();
    }

    getLanguage() {
        return this.currentLanguage;
    }

    toggleLanguage() {
        const newLang = this.currentLanguage === 'en' ? 'hi' : 'en';
        this.setLanguage(newLang);
    }

    t(key) {
        const translation = translations[key];
        if (!translation) {
            console.warn(`Translation missing for key: ${key}`);
            return key;
        }
        return translation[this.currentLanguage] || translation['en'] || key;
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.currentLanguage));
    }

    updateDocumentLang() {
        document.documentElement.lang = this.currentLanguage;
    }

    // Translate all elements with data-translate attribute
    translatePage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (key) {
                element.textContent = this.t(key);
            }
        });

        // Translate placeholders
        const placeholders = document.querySelectorAll('[data-translate-placeholder]');
        placeholders.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (key) {
                element.placeholder = this.t(key);
            }
        });
    }
}

// Create global instance
const language = new LanguageManager();

// Auto-translate on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        language.translatePage();
        language.updateDocumentLang();
    });
}

// Export for global use
window.language = language;
