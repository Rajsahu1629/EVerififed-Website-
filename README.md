# EVerified Website

A comprehensive web platform for EV automobile technician verification and job placement in the bike segment.

## Features

### For Technicians/Users
- User registration and authentication
- Skill verification through EV-specific quizzes
- Browse and apply for jobs
- Track application status
- Digital ID card generation
- Profile management
- Bilingual support (Hindi/English)

### For Recruiters
- Company registration and login
- Post job openings
- View and manage job posts
- Search verified candidates
- View job applicants with detailed profiles

### For Admins
- Dashboard with statistics
- Approve/reject job posts
- Verify user credentials
- Search and filter candidates
- Manage platform operations

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js/Express (existing API)
- **Database**: Neon PostgreSQL
- **Design**: Responsive, mobile-first approach with modern UI/UX

## Setup Instructions

1. Clone the repository
2. Navigate to the EVeerified-Website folder
3. Open `index.html` in a modern web browser
4. No build process required - runs directly in browser

## API Configuration

The website connects to the existing EVerified backend API:
- Base URL: `http://13.53.140.88:3001/api`
- Database: Neon PostgreSQL (shared with mobile app)

## Project Structure

```
EVeerified-Website/
├── index.html              # Main entry point
├── pages/                  # All page templates
│   ├── auth.html
│   ├── user-dashboard.html
│   ├── recruiter-dashboard.html
│   ├── admin-dashboard.html
│   └── ...
├── js/                     # JavaScript modules
│   ├── app.js              # Main app logic
│   ├── api.js              # API client
│   ├── auth.js             # Authentication
│   ├── language.js         # Internationalization
│   └── utils.js            # Helper functions
├── css/                    # Stylesheets
│   └── index.css           # Main styles
└── assets/                 # Images and media
    └── images/
```

## Language Support

The website supports both Hindi and English languages. Users can switch languages at any time, and the preference is saved locally.

## License

Proprietary - EVerified Platform

## Developer

Built for the EVerified platform - Making EV technician hiring transparent and efficient.
