import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import JobsPage from './pages/JobsPage';
import UserDashboard from './pages/UserDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import IDCardPage from './pages/IDCardPage';
import ProfilePage from './pages/ProfilePage';
import AppliedJobsPage from './pages/AppliedJobsPage';
import PostJobPage from './pages/PostJobPage';
import PreviousJobsPage from './pages/PreviousJobsPage';
import CandidateSearchPage from './pages/CandidateSearchPage';
import AdminJobApprovalPage from './pages/AdminJobApprovalPage';
import AdminVerificationPage from './pages/AdminVerificationPage';

import './index.css';

// Protected route wrapper
const ProtectedRoute = ({
  children,
  allowedRoles
}: {
  children: React.ReactNode;
  allowedRoles: ('user' | 'recruiter' | 'admin')[]
}) => {
  const { user, recruiter, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const isAuthorized =
    (allowedRoles.includes('user') && user) ||
    (allowedRoles.includes('recruiter') && recruiter) ||
    (allowedRoles.includes('admin') && isAdmin);

  if (!isAuthorized) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Main App content with routing
const AppContent = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/jobs" element={<JobsPage />} />

          {/* User routes */}
          <Route path="/user-dashboard" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
          <Route path="/id-card" element={<ProtectedRoute allowedRoles={['user']}><IDCardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['user']}><ProfilePage /></ProtectedRoute>} />
          <Route path="/applied-jobs" element={<ProtectedRoute allowedRoles={['user']}><AppliedJobsPage /></ProtectedRoute>} />

          {/* Recruiter routes */}
          <Route path="/recruiter-dashboard" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>} />
          <Route path="/post-job" element={<ProtectedRoute allowedRoles={['recruiter']}><PostJobPage /></ProtectedRoute>} />
          <Route path="/previous-jobs" element={<ProtectedRoute allowedRoles={['recruiter']}><PreviousJobsPage /></ProtectedRoute>} />
          <Route path="/candidate-search" element={<ProtectedRoute allowedRoles={['recruiter', 'admin']}><CandidateSearchPage /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin-job-approval" element={<ProtectedRoute allowedRoles={['admin']}><AdminJobApprovalPage /></ProtectedRoute>} />
          <Route path="/admin-verification" element={<ProtectedRoute allowedRoles={['admin']}><AdminVerificationPage /></ProtectedRoute>} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="container text-center" style={{ padding: '100px 20px' }}>
                <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
                <p className="text-gray mb-4">Page not found</p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
