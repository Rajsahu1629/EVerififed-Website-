// API Configuration and Client
const API_BASE_URL = 'http://13.53.140.88:3001/api';

class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async loginUser(phoneNumber, password) {
        return this.request('/auth/user/login', {
            method: 'POST',
            body: JSON.stringify({ phoneNumber, password }),
        });
    }

    async loginRecruiter(phoneNumber, password) {
        return this.request('/auth/recruiter/login', {
            method: 'POST',
            body: JSON.stringify({ phoneNumber, password }),
        });
    }

    // User endpoints
    async checkPhoneExists(phoneNumber) {
        return this.request('/users/check-phone', {
            method: 'POST',
            body: JSON.stringify({ phoneNumber }),
        });
    }

    async registerUser(userData) {
        return this.request('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async getUser(userId) {
        return this.request(`/users/${userId}`);
    }

    async updateUser(userId, userData) {
        return this.request(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async updateUserVerification(userId, verificationData) {
        return this.request(`/users/${userId}/verification`, {
            method: 'PUT',
            body: JSON.stringify(verificationData),
        });
    }

    async getCardOrderStatus(userId) {
        return this.request(`/users/${userId}/card-order`);
    }

    async updateCardOrderStatus(userId, cardOrdered) {
        return this.request(`/users/${userId}/card-order`, {
            method: 'PUT',
            body: JSON.stringify({ cardOrdered }),
        });
    }

    // Recruiter endpoints
    async checkRecruiterPhone(phoneNumber) {
        return this.request('/recruiters/check-phone', {
            method: 'POST',
            body: JSON.stringify({ phoneNumber }),
        });
    }

    async registerRecruiter(recruiterData) {
        return this.request('/recruiters', {
            method: 'POST',
            body: JSON.stringify(recruiterData),
        });
    }

    async getRecruiter(recruiterId) {
        return this.request(`/recruiters/${recruiterId}`);
    }

    // Job endpoints
    async getJobs() {
        return this.request('/jobs');
    }

    async createJob(jobData) {
        return this.request('/jobs', {
            method: 'POST',
            body: JSON.stringify(jobData),
        });
    }

    async updateJob(jobId, jobData) {
        return this.request(`/jobs/${jobId}`, {
            method: 'PUT',
            body: JSON.stringify(jobData),
        });
    }

    async getRecruiterJobs(recruiterId) {
        return this.request(`/jobs/recruiter/${recruiterId}`);
    }

    async getJobApplicants(jobId) {
        return this.request(`/jobs/${jobId}/applicants`);
    }

    // Application endpoints
    async applyToJob(userId, jobPostId) {
        return this.request('/applications', {
            method: 'POST',
            body: JSON.stringify({ userId, jobPostId }),
        });
    }

    async getUserApplications(userId) {
        return this.request(`/applications/user/${userId}`);
    }

    async getAppliedJobIds(userId) {
        return this.request(`/applications/user/${userId}/ids`);
    }

    // Admin endpoints
    async getPendingJobs() {
        return this.request('/admin/jobs/pending');
    }

    async approveJob(jobId) {
        return this.request(`/admin/jobs/${jobId}/approve`, {
            method: 'PUT',
        });
    }

    async rejectJob(jobId) {
        return this.request(`/admin/jobs/${jobId}/reject`, {
            method: 'PUT',
        });
    }

    async getPendingUsers() {
        return this.request('/admin/users/pending');
    }

    async verifyUser(userId, status) {
        return this.request(`/admin/users/${userId}/verify`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    async searchCandidates(filters) {
        const params = new URLSearchParams(filters);
        return this.request(`/admin/candidates/search?${params}`);
    }

    async getAdminStats() {
        return this.request('/admin/stats');
    }

    async getPendingVerificationUsers() {
        return this.request('/admin/users/pending-verification');
    }

    async adminVerifyUser(userId) {
        return this.request(`/admin/users/${userId}/admin-verify`, {
            method: 'PUT',
        });
    }

    // Quiz endpoints
    async getQuizQuestions(role, domain) {
        return this.request(`/quiz/questions?role=${role}&domain=${domain}`);
    }

    async submitQuiz(userId, quizData) {
        return this.request('/quiz/submit', {
            method: 'POST',
            body: JSON.stringify({ userId, ...quizData }),
        });
    }

    // Stats endpoints
    async getStats() {
        return this.request('/stats');
    }

    // Health check
    async healthCheck() {
        return this.request('/health');
    }
}

// Export singleton instance
const api = new APIClient(API_BASE_URL);
