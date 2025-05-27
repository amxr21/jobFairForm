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
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

**JobFairForm** acts as the frontend-facing portal for applicants at career fairs. Built with a focus on simplicity, accessibility, and responsiveness, this system streamlines the data collection process while securely storing applicant information for later access by participating managers and the CASTO administration.

This application is built to work seamlessly with the [JobFair backend](https://github.com/amxr21/jobFair).

---

## Features

- Clean and user-friendly application form
- Real-time input validation with instant feedback
- Responsive design optimized for mobile, tablet, and desktop devices
- Secure transmission and storage of applicant data
- Confirmation email sent upon successful submission
- Integrates directly with the JobFair management backend

---

## Tech Stack

### Frontend

- React.js  
- Tailwind CSS  
- Axios

### Backend

- Node.js  
- Express.js  
- MongoDB (via Mongoose)

### Hosting

- Frontend: Vercel

---

## System Architecture

```
Frontend (React)
   |
   |---> REST API (Express)
   |
   |---> MongoDB (Applicant submissions)
   |
   |---> Nodemailer (Email confirmations)
```

---

## Installation

### Prerequisites

- Node.js v16+
- MongoDB (local or cloud instance)

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
   Create a `.env` file in the `backend/` directory with the following:

   ```env
   PORT=5000
   MONGO_URI=your_mongo_connection_string
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   BASE_CLIENT_URL=http://localhost:3000
   ```

4. Run the development servers

   In two separate terminals:

   ```bash
   # Terminal 1 - Server
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

   The app should be running on:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

---

## Usage

1. Applicants open the form at the provided URL.
2. They enter their personal and academic details and submit the form.
3. The system stores the data securely and sends a confirmation email.
4. Information becomes accessible to managers and administrators via the JobFair system.

---

## Project Structure

```
jobFairForm/
├── backend/             # Backend source code
│   ├── controllers/     # Request/response logic
│   ├── models/          # MongoDB schemas via Mongoose
│   ├── routes/          # Express route handlers
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point for the backend server
│
├── frontend/            # Frontend source code
│   ├── public/          # Static files and assets
│   ├── src/             # React source code
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application views
│   │   ├── App.js       # Root component
│   │   └── index.js     # Entry point
│
├── README.md
└── package.json
```

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
