# IntelliPrep.AI

AI-powered interview preparation platform that simulates real-world interviews, generates personalized questions and feedback, and tracks candidate progress, scoring & feedback, interview history, and Razorpay credit purchases.

## GitHub Description

AI interview preparation app built with React, Vite, Express, MongoDB, JWT auth, voice interviews, resume analysis, AI feedback, and Razorpay payments.

## Features

- Google and phone OTP authentication
- JWT-protected user, interview, and payment routes
- Resume PDF upload and AI-powered resume analysis
- Technical and HR interview question generation
- Voice-enabled mock interview flow
- Timed answer submission with AI scoring and feedback
- Interview report with skill breakdown and PDF export
- Interview history
- Razorpay credit purchase flow
- Production-ready environment variable examples and safer backend error handling

## Tech Stack

**Frontend**

- React
- Vite
- Redux Toolkit
- Tailwind CSS
- Framer Motion
- Firebase Auth
- Razorpay Checkout

**Backend**

- Node.js
- Express
- MongoDB / Mongoose
- JWT
- Twilio OTP
- OpenRouter AI
- Razorpay
- Multer PDF uploads

## Project Structure

```text
.
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   └── index.js
└── frontend
    ├── public
    └── src
        ├── components
        ├── pages
        ├── redux
        ├── services
        └── utils
```

## Environment Variables

Create environment files from the examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Local Development

Install backend dependencies:

```bash
cd backend
npm install
```

Start the backend:

```bash
npm run dev
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` by default. Backend runs on `http://localhost:5005` by default.

## Production Build

Build the frontend:

```bash
cd frontend
npm run build
```

Start the backend in production:

```bash
cd backend
npm run start
```

For production hosting, configure all required environment variables in the hosting provider dashboard. Set `CLIENT_URL` to the deployed frontend URL and `VITE_API_URL` to the deployed backend API URL.

## Scripts

### Backend

```bash
npm run dev
npm run start
```

### Frontend

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Deployment Notes

- Set `NODE_ENV=production` on the backend.
- Set `CLIENT_URL` to the allowed frontend origin.
- Keep `JWT_SECRET`, `MONGO_URI`, Twilio, OpenRouter, and Razorpay secrets backend-only.
- Use only `VITE_*` variables in the frontend.
- Ensure MongoDB network access allows the deployed backend.
- Configure Firebase authorized domains for the deployed frontend.
- Configure Razorpay keys for the correct test or live environment.

## Verification

Recent production-readiness checks completed:

- Frontend lint passes with warnings only.
- Frontend production build completes successfully.
- Backend syntax check passes.
- Backend starts successfully with configured environment variables.
- Debug `console.log` statements were removed from source files.
- `.env.example` files contain placeholders only.
