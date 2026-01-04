# JobFairForm – Streamlined Applicant Submission Portal

A dedicated web application designed to simplify and digitize the application process for students and graduates attending job and internship fairs organized by the **CASTO Office** at the University of Sharjah. JobFairForm enables applicants to submit their personal and academic details through a clean, mobile-optimized interface, eliminating the need for paper forms and ensuring data is securely handled.

**Live Preview:** [JobFairForm Web App](https://job-fair-form.vercel.app)
**Repository:** [GitHub - amxr21/jobFairForm](https://github.com/amxr21/jobFairForm)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Recent Updates](#recent-updates)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

**JobFairForm** acts as the frontend-facing portal for applicants at career fairs. Built with a focus on simplicity, accessibility, and responsiveness, this system streamlines the data collection process while securely storing applicant information for later access by participating managers and the CASTO administration.

This application is built to work seamlessly with the [JobFair Dashboard](https://github.com/amxr21/jobFair).

---

## Features

### Core Features
- Clean and user-friendly 3-step application form
- Real-time input validation with instant feedback
- Responsive design optimized for mobile, tablet, and desktop devices
- Secure transmission and storage of applicant data
- Confirmation email with QR code ticket sent upon successful submission
- CV upload with Cloudinary cloud storage
- Integrates directly with the JobFair management backend

### Form Sections
1. **Personal Information** - Name, University ID, date of birth, contact details
2. **Professional Information** - Major, CGPA, skills, experience, languages
3. **Preferences (Optional)** - Field interest, opportunity types, preferred work city

### Input Validation
- University ID validation with "U" prefix display (years 14-26)
- Phone number validation (local 05XXXXXXXX or international +971XXXXXXXXX)
- Email format validation
- CGPA range validation (0-4)

---

## Tech Stack

### Frontend

- React.js (Vite)
- Tailwind CSS
- Axios
- Context API for state management

### Backend

- Node.js
- Express.js
- MongoDB (via Mongoose)
- Cloudinary (CV file storage)
- Nodemailer (email confirmations)
- QRCode (ticket generation)

### Hosting

- Frontend: Vercel
- Backend: Railway

---

## System Architecture

```
Frontend (React + Vite)
   |
   |---> REST API (Express.js)
   |        |
   |        |---> MongoDB (Applicant data)
   |        |
   |        |---> Cloudinary (CV storage)
   |        |
   |        |---> Nodemailer (Email with QR ticket)
   |
   |---> JobFair Dashboard (for managers/admin)
```

---

## Installation

### Prerequisites

- Node.js v16+
- MongoDB (local or cloud instance)
- Cloudinary account (for CV storage)

### Steps

1. Clone the repository
   ```bash
   git clone https://github.com/amxr21/jobFairForm.git
   cd jobFairForm
   ```

2. Install dependencies
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. Configure environment variables
   Create a `.env` file in the `backend/` directory:

   ```env
   PORT=2001
   URI=your_mongo_connection_string
   TOKEN_SIGN=your_jwt_secret

   # Email Configuration
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Run the development servers

   In two separate terminals:

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

   The app should be running on:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:2001`

---

## Usage

1. Applicants open the form at the provided URL.
2. They complete the 3-step form:
   - **Step 1:** Personal details (name, ID, contact)
   - **Step 2:** Professional info (education, skills, experience)
   - **Step 3:** Preferences (optional - field interests, opportunity types)
3. Upload CV (optional, stored on Cloudinary)
4. Submit the form
5. Receive confirmation email with QR code ticket
6. Information becomes accessible to managers and administrators via the JobFair Dashboard

---

## Project Structure

```
jobFairForm/
├── backend/                    # Backend source code
│   ├── config/
│   │   └── cloudinary.js       # Cloudinary configuration
│   ├── controllers/
│   │   └── applicantsControllers.js
│   ├── middlewares/
│   │   └── requireAuth.js
│   ├── models/
│   │   └── applicantFormModel.js
│   ├── routers/
│   │   └── applicantRouter.js
│   └── server.js
│
├── frontend/                   # Frontend source code
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── ApplicationForm/
│   │   │       ├── Form.jsx           # Main form container
│   │   │       ├── PersonalInfo.jsx   # Step 1
│   │   │       ├── ProfessionalInfo.jsx # Step 2
│   │   │       ├── Preferences.jsx    # Step 3 (optional)
│   │   │       ├── Input.jsx          # Reusable input component
│   │   │       ├── SelectInput.jsx    # Dropdown component
│   │   │       ├── SkillsMultiSelect.jsx # Multi-select for skills
│   │   │       └── ...
│   │   ├── Context/
│   │   │   └── FormContext.jsx
│   │   ├── Hooks/
│   │   └── App.jsx
│   └── index.html
│
├── README.md
└── package.json
```

---

## Recent Updates

### v2.0 (January 2025)
- **Cloudinary Integration:** CV files now stored on Cloudinary cloud storage
- **3-Step Form Flow:** Redesigned form with step-by-step navigation
- **Preferences Section:** New optional section for job preferences
- **Skills Multi-Select:** Enhanced skills input with multi-select functionality
- **Improved Validation:** Better University ID and phone number validation
- **Evaluation Emails:** Post-fair survey email functionality
- **UI/UX Improvements:** Unified styling, better responsiveness

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your message"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

**Ammar Obad**
Full-stack Developer | Computer Engineer
Website: [ammarobad.info](https://www.ammarobad.info)
GitHub: [@amxr21](https://github.com/amxr21)
Email: ammar211080@gmail.com
