// Main Application Logic and Router
class EVeerifiedApp {
    constructor() {
        this.currentUser = null;
        this.currentRecruiter = null;
        this.currentPage = '';
        this.init();
    }

    init() {
        // Load user session from localStorage
        this.loadSession();

        // Set up router
        this.setupRouter();

        // Handle initial route
        this.handleRoute();

        // Listen for language changes
        if (window.language) {
            window.language.subscribe(() => {
                this.refreshCurrentPage();
            });
        }
    }

    loadSession() {
        try {
            const userSession = localStorage.getItem('everified_user');
            const recruiterSession = localStorage.getItem('everified_recruiter');
            const adminSession = localStorage.getItem('everified_admin');

            if (userSession) {
                this.currentUser = JSON.parse(userSession);
            } else if (recruiterSession) {
                this.currentRecruiter = JSON.parse(recruiterSession);
            } else if (adminSession) {
                this.isAdmin = true;
            }
        } catch (error) {
            console.error('Error loading session:', error);
        }
    }

    saveUserSession(user) {
        this.currentUser = user;
        localStorage.setItem('everified_user', JSON.stringify(user));
    }

    saveRecruiterSession(recruiter) {
        this.currentRecruiter = recruiter;
        localStorage.setItem('everified_recruiter', JSON.stringify(recruiter));
    }

    saveAdminSession() {
        this.isAdmin = true;
        localStorage.setItem('everified_admin', 'true');
    }

    logout() {
        this.currentUser = null;
        this.currentRecruiter = null;
        this.isAdmin = false;
        localStorage.removeItem('everified_user');
        localStorage.removeItem('everified_recruiter');
        localStorage.removeItem('everified_admin');
        this.navigate('/');
    }

    setupRouter() {
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Intercept all link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                const path = e.target.getAttribute('href') || e.target.getAttribute('data-link');
                this.navigate(path);
            }
        });
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.pathname;
        this.currentPage = path;

        // Define routes
        const routes = {
            '/': () => this.renderHome(),
            '/auth': () => this.renderAuth(),
            '/user-dashboard': () => this.renderUserDashboard(),
            '/verification-form': () => this.renderVerificationForm(),
            '/skill-verification': () => this.renderSkillVerification(),
            '/jobs': () => this.renderJobs(),
            '/applied-jobs': () => this.renderAppliedJobs(),
            '/id-card': () => this.renderIDCard(),
            '/profile': () => this.renderProfile(),
            '/recruiter-dashboard': () => this.renderRecruiterDashboard(),
            '/post-job': () => this.renderPostJob(),
            '/previous-jobs': () => this.renderPreviousJobs(),
            '/job-applicants': () => this.renderJobApplicants(),
            '/candidate-search': () => this.renderCandidateSearch(),
            '/admin-dashboard': () => this.renderAdminDashboard(),
            '/admin-job-approval': () => this.renderAdminJobApproval(),
            '/admin-verification': () => this.renderAdminVerification(),
        };

        // Find matching route
        const handler = routes[path] || (() => this.render404());

        // Execute route handler
        await handler();

        // Translate page after rendering
        if (window.language) {
            window.language.translatePage();
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }

    refreshCurrentPage() {
        this.handleRoute();
    }

    // Render methods (these will load HTML content)
    async renderHome() {
        await this.loadPage('index');
    }

    async renderAuth() {
        if (this.currentUser) {
            return this.navigate('/user-dashboard');
        }
        if (this.currentRecruiter) {
            return this.navigate('/recruiter-dashboard');
        }
        if (this.isAdmin) {
            return this.navigate('/admin-dashboard');
        }
        await this.loadPage('auth');
    }

    async renderUserDashboard() {
        if (!this.currentUser) {
            return this.navigate('/auth');
        }
        await this.loadPage('user-dashboard');
    }

    async renderVerificationForm() {
        await this.loadPage('verification-form');
    }

    async renderSkillVerification() {
        if (!this.currentUser) {
            return this.navigate('/auth');
        }
        await this.loadPage('skill-verification');
    }

    async renderJobs() {
        await this.loadPage('jobs');
    }

    async renderAppliedJobs() {
        if (!this.currentUser) {
            return this.navigate('/auth');
        }
        await this.loadPage('applied-jobs');
    }

    async renderIDCard() {
        if (!this.currentUser) {
            return this.navigate('/auth');
        }
        await this.loadPage('id-card');
    }

    async renderProfile() {
        if (!this.currentUser) {
            return this.navigate('/auth');
        }
        await this.loadPage('profile');
    }

    async renderRecruiterDashboard() {
        if (!this.currentRecruiter) {
            return this.navigate('/auth');
        }
        await this.loadPage('recruiter-dashboard');
    }

    async renderPostJob() {
        if (!this.currentRecruiter) {
            return this.navigate('/auth');
        }
        await this.loadPage('post-job');
    }

    async renderPreviousJobs() {
        if (!this.currentRecruiter) {
            return this.navigate('/auth');
        }
        await this.loadPage('previous-jobs');
    }

    async renderJobApplicants() {
        if (!this.currentRecruiter) {
            return this.navigate('/auth');
        }
        await this.loadPage('job-applicants');
    }

    async renderCandidateSearch() {
        if (!this.currentRecruiter && !this.isAdmin) {
            return this.navigate('/auth');
        }
        await this.loadPage('candidate-search');
    }

    async renderAdminDashboard() {
        if (!this.isAdmin) {
            return this.navigate('/auth');
        }
        await this.loadPage('admin-dashboard');
    }

    async renderAdminJobApproval() {
        if (!this.isAdmin) {
            return this.navigate('/auth');
        }
        await this.loadPage('admin-job-approval');
    }

    async renderAdminVerification() {
        if (!this.isAdmin) {
            return this.navigate('/auth');
        }
        await this.loadPage('admin-verification');
    }

    async render404() {
        const content = document.getElementById('app');
        if (content) {
            content.innerHTML = `
        <div class="container" style="padding: 100px 20px; text-align: center;">
          <h1>404</h1>
          <p class="text-gray">Page not found</p>
          <a href="/" data-link class="btn btn-primary mt-4">Go Home</a>
        </div>
      `;
        }
    }

    async loadPage(pageName) {
        const content = document.getElementById('app');
        if (!content) return;

        try {
            // Show loading
            content.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';

            // Fetch page content
            const response = await fetch(`/pages/${pageName}.html`);
            if (response.ok) {
                const html = await response.text();
                content.innerHTML = html;

                // Initialize page-specific JavaScript
                this.initializePage(pageName);
            } else {
                throw new Error('Page not found');
            }
        } catch (error) {
            console.error('Error loading page:', error);
            content.innerHTML = `
        <div class="container" style="padding: 100px 20px; text-align: center;">
          <h1 data-translate="error">Error</h1>
          <p class="text-gray">Failed to load page</p>
          <a href="/" data-link class="btn btn-primary mt-4">Go Home</a>
        </div>
      `;
        }
    }

    initializePage(pageName) {
        // Call page-specific initialization functions
        const initFunctions = {
            'auth': () => this.initAuthPage(),
            'user-dashboard': () => this.initUserDashboard(),
            'jobs': () => this.initJobsPage(),
            'skill-verification': () => this.initSkillVerification(),
            'recruiter-dashboard': () => this.initRecruiterDashboard(),
            'post-job': () => this.initPostJobPage(),
            'admin-dashboard': () => this.initAdminDashboard(),
            // Add more as needed
        };

        const initFn = initFunctions[pageName];
        if (initFn) {
            initFn.call(this);
        }
    }

    // Page initialization functions (placeholders - will be implemented in individual page files)
    initAuthPage() {
        console.log('Initializing auth page');
    }

    initUserDashboard() {
        console.log('Initializing user dashboard');
    }

    initJobsPage() {
        console.log('Initializing jobs page');
    }

    initSkillVerification() {
        console.log('Initializing skill verification');
    }

    initRecruiterDashboard() {
        console.log('Initializing recruiter dashboard');
    }

    initPostJobPage() {
        console.log('Initializing post job page');
    }

    initAdminDashboard() {
        console.log('Initializing admin dashboard');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EVeerifiedApp();
});
