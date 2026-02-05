// Utility Functions

// Show toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} fade-in`;
    toast.innerHTML = `
    <div class="flex items-center gap-3">
      <div>${getToastIcon(type)}</div>
      <div>${message}</div>
    </div>
  `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function getToastIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

// Show/hide loading overlay
function showLoading() {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(overlay);
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.remove();
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format currency
function formatCurrency(amount) {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Validate phone number
function validatePhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// Validate form
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('border-error');
        } else {
            input.classList.remove('border-error');
        }
    });

    return isValid;
}

// Generate QR Code (simple data URL)
function generateQRCode(data) {
    // Using a simple QR code API
    const qrData = encodeURIComponent(JSON.stringify(data));
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Parse brands array
function parseBrands(brands) {
    if (Array.isArray(brands)) return brands;
    if (typeof brands === 'string') {
        try {
            return JSON.parse(brands);
        } catch {
            return [];
        }
    }
    return [];
}

// Get verification status color
function getVerificationStatusColor(status) {
    const colors = {
        'verified': 'success',
        'approved': 'success',
        'pending': 'warning',
        'rejected': 'error',
        'step2_completed': 'info',
        'step3_pending': 'warning'
    };
    return colors[status] || 'secondary';
}

// Get verification status text
function getVerificationStatusText(status, lang = 'en') {
    const texts = {
        en: {
            'verified': 'Verified',
            'approved': 'Approved',
            'pending': 'Pending',
            'rejected': 'Rejected',
            'step2_completed': 'Quiz Completed',
            'step3_pending': 'Pending Review'
        },
        hi: {
            'verified': 'सत्यापित',
            'approved': 'स्वीकृत',
            'pending': 'लंबित',
            'rejected': 'अस्वीकृत',
            'step2_completed': 'परीक्षा पूर्ण',
            'step3_pending': 'समीक्षा लंबित'
        }
    };
    return texts[lang][status] || status;
}

// Sanitize HTML
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copied to clipboard!', 'success');
    }
}

// Download as file
function downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Get query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Set query parameter
function setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
}

// Format phone for display
function formatPhoneDisplay(phone) {
    if (!phone) return '';
    // Format: +91 XXXXX XXXXX
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
}

// Truncate text
function truncate(str, length = 100) {
    if (!str || str.length <= length) return str;
    return str.slice(0, length) + '...';
}

// Calculate quiz percentage
function calculateQuizPercentage(score, total) {
    if (!total) return 0;
    return Math.round((score / total) * 100);
}

// Check if user is verified
function isUserVerified(user) {
    return user && (user.verificationStatus === 'verified' || user.verificationStatus === 'approved');
}

// Check if user passed quiz
function hasPassedQuiz(user) {
    if (!user || !user.quizScore || !user.totalQuestions) return false;
    const percentage = calculateQuizPercentage(user.quizScore, user.totalQuestions);
    return percentage >= 70; // 70% passing score
}

// Export for global use
window.utils = {
    showToast,
    showLoading,
    hideLoading,
    formatDate,
    formatCurrency,
    validatePhone,
    validateForm,
    generateQRCode,
    generateId,
    debounce,
    parseBrands,
    getVerificationStatusColor,
    getVerificationStatusText,
    sanitizeHTML,
    copyToClipboard,
    downloadFile,
    openModal,
    closeModal,
    scrollToTop,
    getQueryParam,
    setQueryParam,
    formatPhoneDisplay,
    truncate,
    calculateQuizPercentage,
    isUserVerified,
    hasPassedQuiz
};
