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
- [Troubleshooting](#troubleshooting)
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
- Light/dark mode toggle with a fully designed dark palette (not a blanket inversion — every surface, border, and text color has its own light and dark tier)
- "Check My Ticket" lookup — applicants can retrieve their QR ticket by University ID without refilling the form, either via a button on the homepage or by visiting `/my-qr-code` directly
- Accessible by default: keyboard-operable custom dropdowns/date picker (no native `<select>`), labeled icon-only buttons, WCAG-sized touch targets

### Form Sections
1. **Personal Information** - Name, University ID, date of birth, contact details
2. **Professional Information** - Major, CGPA, skills, experience, languages
3. **Preferences (Optional)** - Field interest, opportunity types, preferred work city

### Input Validation
- University ID validation with "U" prefix display (years 14-26)
- Phone number validation (local 05XXXXXXXX or international +971XXXXXXXXX)
- Email format validation
- CGPA range validation (0-4)
- CV upload capped at **4MB** (PDF/DOC/DOCX). This limit lives in two places
  that must stay equal: `MAX_CV_BYTES` in `ProfessionalInfo.jsx` and multer's
  `limits.fileSize` in `backend/config/cloudinary.js`
- Submission requires an explicit set of fields (`REQUIRED_FIELDS` in
  `Form.jsx`) — never a count of how many fields happen to be filled, which
  silently miscounts as optional fields are added or cleared

---

## Tech Stack

### Frontend

- React.js (Vite)
- Tailwind CSS (with a semantic light/dark token system)
- React Router
- Axios
- Context API for state management

### Backend

- Node.js
- Express.js
- MySQL via Prisma ORM
- Cloudinary (CV file storage)
- Nodemailer (email confirmations)
- QRCode (ticket generation)

### Hosting

- Frontend: Vercel
- Backend: Render

### CI

- GitHub Actions runs lint, build, and backend tests (against a MySQL service container) on every PR and push to `dev`/`main`

---

## System Architecture

```
Frontend (React + Vite)
   |
   |---> REST API (Express.js)
   |        |
   |        |---> MySQL via Prisma (Applicant data)
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

- Node.js v20+
- MySQL (local or cloud instance)
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
   DATABASE_URL=your_mysql_connection_string
   TOKEN_SIGN=your_jwt_secret

   # Email Configuration
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   Create a `.env` file in the `frontend/` directory (see `.env.example`):

   ```env
   VITE_API_URL=your_backend_url
   ```

   > **Keep this in sync with the deployed host.** Every component reads
   > `VITE_API_URL` and falls back to a hardcoded production URL only if it is
   > unset. If the `.env` files and that fallback point at different hosts, the
   > app silently talks to whichever one the build resolved — set
   > `VITE_API_URL` explicitly in Vercel's environment variables.

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
│   │   ├── context/
│   │   │   └── FormContext.jsx
│   │   ├── hooks/
│   │   └── App.jsx
│   └── index.html
│
├── README.md
└── package.json
```

---

## Troubleshooting

### Submissions fail with a CORS error

```
Access to XMLHttpRequest at '<backend>/applicants' has been blocked by CORS
policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
AxiosError: Network Error
```

**Check whether the backend is actually running before touching any CORS
config.** A missing `Access-Control-Allow-Origin` header means the response
carried no CORS headers at all — which a *down* server produces just as
readily as a misconfigured one. If the request never reaches Express, the CORS
middleware never runs, and the browser reports it as a CORS failure.

Diagnose with a direct request that bypasses the browser:

```bash
curl -i https://<your-backend-host>/health
```

| What you see | What it means |
|---|---|
| `404` + `x-render-routing: no-server`, answers in <1s | Render service is **down** — redeploy it |
| `404` + `x-railway-fallback: true` | Railway app **not found** — wrong host or not deployed |
| Hangs 30–60s, then responds | Free-tier **cold start**, not an error |
| `{"status":"ok"}` | Backend is up — now it's genuinely worth checking CORS |

The allowlist lives in `backend/app.js` (`ALLOWED_ORIGINS`). Note that
`Access-Control-Allow-Origin` must be a **single origin string**, never an
array — echo back `req.headers.origin` when it matches the allowlist.

### The app talks to the wrong backend

Every component reads `import.meta.env.VITE_API_URL` and falls back to a
hardcoded production URL only when it's unset. If `.env` and that fallback name
different hosts, the deployed build may reach neither. Set `VITE_API_URL`
explicitly in Vercel and confirm it matches the host you actually deploy.

### Health check

`GET /health` returns `{ "status": "ok", "uptime": <seconds> }` without
touching the database or requiring auth — use it for uptime monitors and for
the curl check above.

---

## Recent Updates

### v2.3 (July 2026)
- **Submission Reliability:** Replaced a fragile count-based submit gate (`filledFields.length >= 16`) with an explicit required-field list — it previously rejected complete applications when an optional field was cleared, and accepted incomplete ones padded with optional values
- **Error Messaging:** Submission failures now distinguish timeout, offline, oversized-CV, validation, and server errors instead of a single generic message; added a request timeout so a cold-starting backend can't leave the overlay spinning
- **Process Stability:** A failed ticket email or QR render can no longer crash the backend — post-response side effects are caught, with `unhandledRejection`/`uncaughtException` handlers as a backstop
- **Privacy:** Removed request-body logging that wrote applicant PII (names, emails, phone numbers) into server logs
- **Health Endpoint:** Added `GET /health` for uptime checks and deploy verification
- **Consistency Fixes:** Aligned the CV size limit (UI 2MB vs. backend 4MB), stopped the "file too large" error firing when the picker is cancelled, and routed `CheckId`/`QrScanner` through `VITE_API_URL` instead of a hardcoded production host

### v2.2 (July 2026)
- **Dark Mode:** Light/dark toggle with a fully designed dark palette — semantic surface/border/text tokens across every form component, not a blanket color inversion
- **Ticket Lookup:** "Check My Ticket" modal lets applicants retrieve their QR ticket by University ID; also reachable directly at `/my-qr-code`
- **Accessibility Fixes:** Custom keyboard-operable date picker replacing the native `<select>` month/year inputs, labeled icon-only buttons, WCAG-sized touch targets (Lighthouse accessibility: 100/100)
- **Security Fix:** Removed an insecure `localhost` API fallback that could leak applicant data submissions over plain HTTP on production deployments
- **CI Pipeline:** GitHub Actions now runs lint, build, and backend tests against a MySQL service container on every PR
- **Backend Migration:** Moved from MongoDB/Mongoose to MySQL via Prisma ORM, now hosted on Render

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
