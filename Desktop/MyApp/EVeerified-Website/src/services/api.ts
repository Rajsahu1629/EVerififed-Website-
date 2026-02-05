// API Service - Backend Integration
const API_BASE_URL = 'http://13.53.140.88:3001/api';



class ApiService {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const config: RequestInit = {
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
    async loginUser(phoneNumber: string, password: string) {
        return this.request<{ success: boolean; user: User }>('/auth/user/login', {
            method: 'POST',
            body: JSON.stringify({ phoneNumber, password }),
        });
    }

    async loginRecruiter(phoneNumber: string, password: string) {
        return this.request<{ success: boolean; recruiter: Recruiter }>('/auth/recruiter/login', {
            method: 'POST',
            body: JSON.stringify({ phoneNumber, password }),
        });
    }

    // User endpoints
    async checkPhoneExists(phoneNumber: string) {
        return this.request<{ exists: boolean }>('/users/check-phone', {
            method: 'POST',
            body: JSON.stringify({ phoneNumber }),
        });
    }

    async registerUser(userData: Partial<User>) {
        return this.request<{ success: boolean; user: User }>('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async getUser(userId: number) {
        return this.request<User>(`/users/${userId}`);
    }

    async updateUser(userId: number, userData: Partial<User>) {
        return this.request<{ success: boolean }>(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async updateUserVerification(userId: number, verificationData: Partial<User>) {
        return this.request<{ success: boolean }>(`/users/${userId}/verification`, {
            method: 'PUT',
            body: JSON.stringify(verificationData),
        });
    }

    // Recruiter endpoints
    async registerRecruiter(recruiterData: Partial<Recruiter>) {
        return this.request<{ success: boolean; recruiter: Recruiter }>('/recruiters', {
            method: 'POST',
            body: JSON.stringify(recruiterData),
        });
    }

    async getRecruiter(recruiterId: number) {
        return this.request<Recruiter>(`/recruiters/${recruiterId}`);
    }

    // Job endpoints
    async getJobs() {
        return this.request<Job[]>('/jobs');
    }

    async createJob(jobData: CreateJobPayload) {
        return this.request<{ success: boolean; job: Job }>('/jobs', {
            method: 'POST',
            body: JSON.stringify(jobData),
        });
    }

    async updateJob(jobId: number, jobData: Partial<Job>) {
        return this.request<{ success: boolean }>(`/jobs/${jobId}`, {
            method: 'PUT',
            body: JSON.stringify(jobData),
        });
    }

    async getRecruiterJobs(recruiterId: number) {
        return this.request<Job[]>(`/jobs/recruiter/${recruiterId}`);
    }

    async getJobApplicants(jobId: number) {
        return this.request<User[]>(`/jobs/${jobId}/applicants`);
    }

    // Application endpoints
    async applyToJob(userId: number, jobPostId: number) {
        return this.request<{ success: boolean }>('/applications', {
            method: 'POST',
            body: JSON.stringify({ userId, jobPostId }),
        });
    }

    async getUserApplications(userId: number) {
        return this.request<Application[]>(`/applications/user/${userId}`);
    }

    async getAppliedJobIds(userId: number) {
        return this.request<number[]>(`/applications/user/${userId}/ids`);
    }

    // Admin endpoints
    async getPendingJobs() {
        return this.request<Job[]>('/admin/jobs/pending');
    }

    async approveJob(jobId: number) {
        return this.request<{ success: boolean }>(`/admin/jobs/${jobId}/approve`, {
            method: 'PUT',
        });
    }

    async rejectJob(jobId: number) {
        return this.request<{ success: boolean }>(`/admin/jobs/${jobId}/reject`, {
            method: 'PUT',
        });
    }

    async getAdminStats() {
        return this.request<AdminStats>('/admin/stats');
    }

    async getPendingVerificationUsers() {
        return this.request<User[]>('/admin/users/pending-verification');
    }

    async adminVerifyUser(userId: number) {
        return this.request<{ success: boolean }>(`/admin/users/${userId}/admin-verify`, {
            method: 'PUT',
        });
    }

    async searchCandidates(filters: CandidateFilters) {
        const params = new URLSearchParams(filters as Record<string, string>);
        return this.request<User[]>(`/admin/candidates/search?${params}`);
    }

    // Health check
    async healthCheck() {
        return this.request<{ status: string }>('/health');
    }
}

// Types
export interface User {
    id: number;
    fullName?: string;
    full_name?: string;
    phoneNumber?: string;
    phone_number?: string;
    state?: string;
    city?: string;
    pincode?: string;
    qualification?: string;
    experience?: string;
    currentWorkshop?: string;
    current_workshop?: string;
    brandWorkshop?: string;
    brand_workshop?: string;
    brands?: string[];
    role?: string;
    verificationStatus?: string;
    verification_status?: string;
    verificationStep?: number;
    verification_step?: number;
    quizScore?: number;
    quiz_score?: number;
    totalQuestions?: number;
    total_questions?: number;
    domain?: string;
    vehicle_category?: string;
    training_role?: string;
    is_admin_verified?: boolean;
    prior_knowledge?: string;
    current_salary?: string;
    password?: string;
}

export interface Recruiter {
    id: number;
    companyName?: string;
    company_name?: string;
    entityType?: string;
    entity_type?: string;
    phoneNumber?: string;
    phone_number?: string;
    password?: string;
}


export interface CreateJobPayload {
    recruiterId: number;
    brand: string;
    roleRequired: string;
    numberOfPeople: string;
    experience: string;
    salaryMin: number;
    salaryMax: number;
    city: string;
    pincode: string;
    hasIncentive: boolean;
    stayProvided: boolean;
    urgency: string;
    jobDescription: string;
    status?: string;
    isActive?: boolean;
    vehicleCategory?: string;
    trainingRole?: string;
}

export interface Job {
    id: number;
    recruiter_id: number;
    brand: string;
    role_required: string;
    number_of_people: string;
    experience: string;
    salary_min: number;
    salary_max: number;
    has_incentive: boolean;
    pincode: string;
    city: string;
    stay_provided: boolean;
    urgency: string;
    job_description?: string;
    status: string;
    is_active: boolean;
    company_name?: string;
    vehicle_category?: string;
    training_role?: string;
    application_count?: number;
    created_at?: string;
}

export interface Application {
    id: number;
    user_id: number;
    job_post_id: number;
    status: string;
    brand?: string;
    role_required?: string;
    city?: string;
    salary_min?: number;
    salary_max?: number;
    company_name?: string;
}

export interface AdminStats {
    pendingJobs: number;
    totalCandidates: number;
    verifiedCandidates: number;
    totalRecruiters: number;
}

export interface CandidateFilters {
    domain?: string;
    vehicleCategory?: string;
    city?: string;
    experience?: string;
    role?: string;
}

export const api = new ApiService();
