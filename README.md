# Developer Assessment Platform – Frontend

A role-based online assessment platform where companies can create technical assessments, invite candidates, and evaluate their performance. Candidates can participate in assessments and track their results, while administrators manage users and platform activities.

## Live Demo

- **Frontend:** https://developer-assesment-theta.vercel.app
- **Backend API:** https://assigenment-6-rho.vercel.app

## Project Overview

Developer Assessment Platform is a full-stack assessment management systems designed to simplify technical recruitment and candidate evaluation.

The platform supports three primary roles:

- **ADMIN** – Manages users and oversees platform activities.
- **COMPANY** – Creates assessments, manages problems, invites candidates, and reviews results.
- **CANDIDATE** – Participates in assessments, submits answers, and views performance.

## Features

### Authentication & Authorization

- Email and password authentication
- Google authentication
- Role-based access control
- Protected routes
- Session management
- Login and registration pages

### Candidate

- Candidate dashboard
- Profile management
- Profile image upload
- Browse available assessments
- View assessment details
- Participate in assessments
- Submit assessment answers
- View assessment attempts and results

### Company

- Company dashboard
- Company profile management
- Assessment creation and management
- Problem management
- Add problems to assessments
- Publish assessments after successful payment
- Invite candidates
- View candidate submissions and results
- Assessment performance reports

### Admin

- Admin dashboard
- User management
- View user details
- Update user status
- Manage platform users

### Payment

- bKash sandbox payment integration
- Assessment payment process
- Payment verification
- Payment history

## Technology Stack

| Category          | Technologies         |
| ----------------- | -------------------- |
| Framework         | Next.js              |
| Library           | React                |
| Language          | TypeScript           |
| Styling           | Tailwind CSS         |
| UI Components     | shadcn/ui            |
| Icons             | Lucide React         |
| API Communication | Fetch / API Client   |
| Authentication    | Cookie-based session |
| Deployment        | Vercel               |

## Backend Technology

The backend is developed separately using:

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod
- bKash Sandbox

## Application Flow

1. Users register or log in.
2. Users access features according to their roles.
3. Companies create assessments.
4. Companies add problems to assessments.
5. Companies complete the assessment payment.
6. Companies publish assessments.
7. Candidates participate in published assessments.
8. The platform evaluates submissions and provides results.
9. Companies review candidate performance.

## Project Structure

```text
src/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── admin/
│   ├── candidate/
│   ├── company/
│   └── api/
│
├── components/
│   ├── auth/
│   ├── candidate/
│   ├── company/
│   ├── admin/
│   ├── layout/
│   ├── shared/
│   └── ui/
│
├── hooks/
├── lib/
├── types/
└── ...
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_FRONTEND_REPOSITORY_URL
```

### 2. Navigate to the project directory

```bash
cd assigenment-7
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_BACKEND_URL=https://assigenment-6-rho.vercel.app
```

For local development:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

**Important:** Set the backend base URL without `/api/v1` if the frontend API client automatically appends that prefix. Check the actual API configuration before changing this value.

Add any additional environment variables required by the project configuration.

### 5. Run the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 6. Build for production

```bash
npm run build
```

### 7. Start production server

```bash
npm run start
```

## Environment Variables

| Variable                  | Description             |
| ------------------------- | ----------------------- |
| `NEXT_PUBLIC_BACKEND_URL` | Backend server base URL |

Add other variables only if they are required by the frontend implementation. Never commit secret keys or credentials to GitHub.

## Deployment

The frontend is deployed on Vercel.

**Live URL:**  
https://developer-assesment-theta.vercel.app

To deploy your own version:

1. Push the frontend repository to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Deploy the application.
5. Verify the production API connection and authentication flows.

## Related Resources

- **Frontend Repository:** https://github.com/Mahmudul150/Developer-Assesment-Platfrom-client
- **Backend Repository:** https://github.com/Mahmudul150/assigenment-6
- **API Documentation:** https://documenter.getpostman.com/view/50323079/2sBYHYtcot
- **Demo Video:** ADD_DEMO_VIDEO_LINK

## Demo Accounts

Add your actual seeded demo credentials here before publishing the README.

| Role  | Email           | Password     |
| ----- | --------------- | ------------ |
| Admin | ADD_ADMIN_EMAIL | ADD_PASSWORD |

## Author

**Mahmudul Hasan**

Diploma in Computer Technology  
Feni Polytechnic Institute

---

_Developer Assessment Platform – A role-based technical assessment and candidate evaluation system._
