import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="container" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="mb-4">Privacy Policy for EVerified</h1>
            <p className="text-gray mb-6">Last Updated: February 6, 2026</p>

            <div className="card mb-6">
                <h2>1. Introduction</h2>
                <p>
                    Welcome to EVerified. We value your privacy and are committed to protecting your personal data.
                    This Privacy Policy explains how we collect, use, and share your information when you use our mobile application.
                </p>
            </div>

            <div className="card mb-6">
                <h2>2. Information We Collect</h2>
                <p>To provide our verification and job connection services, we collect the following types of information:</p>
                <ul>
                    <li><strong>Personal Information:</strong> Name, Phone Number, Email Address.</li>
                    <li><strong>Professional Information:</strong> Qualifications (10th, 12th, ITI, Diploma, etc.), Experience, Current Salary, Brands Worked With.</li>
                    <li><strong>Business Information (for Recruiters):</strong> Company Name, Entity Type (Dealer, Fleet, OEM, Workshop), Business Address, GST/Business Proof.</li>
                    <li><strong>Location Data:</strong> State, City, and Pincode to match you with local job opportunities or candidates.</li>
                </ul>
            </div>

            <div className="card mb-6">
                <h2>3. How We Use Your Information</h2>
                <p>We use your data for the following purposes:</p>
                <ul>
                    <li><strong>Verification:</strong> To verify your identity and professional skills (EV/BS6 domain expertise).</li>
                    <li><strong>Job Matching:</strong> To connect Candidates (Technicians, Freshers) with Recruiters.</li>
                    <li><strong>Communication:</strong> To send you important updates regarding job applications, interviews, and account status via SMS or WhatsApp.</li>
                </ul>
            </div>

            <div className="card mb-6">
                <h2>4. Data Sharing</h2>
                <ul>
                    <li><strong>Recruiters:</strong> Verified candidate profiles are visible to registered Recruiters for hiring purposes.</li>
                    <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or to protect our rights.</li>
                </ul>
            </div>

            <div className="card mb-6">
                <h2>5. Data Security</h2>
                <p>
                    We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.
                </p>
            </div>

            <div className="card mb-6">
                <h2>6. Your Rights</h2>
                <p>
                    You have the right to access, update, or request the deletion of your personal data.
                    You can update your profile directly within the app or contact our support team.
                </p>
            </div>

            <div className="card mb-6">
                <h2>7. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:rajsahu1629@gmail.com">rajsahu1629@gmail.com</a>
                </p>
            </div>

            <div className="text-center mt-6">
                <Link to="/" className="btn btn-primary">Back to Home</Link>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
