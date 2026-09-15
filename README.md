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

### Backend

```env
NODE_ENV=development
PORT=5005
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=<replace-with-strong-secret>
TWILIO_SID=<twilio-account-sid>
TWILIO_AUTH_TOKEN=<twilio-auth-token>
TWILIO_PHONE=<twilio-phone-number>
OPENROUTER_API_KEY=<openrouter-api-key>
RAZORPAY_KEY_ID=<razorpay-key-id>
RAZORPAY_KEY_SECRET=<razorpay-key-secret>
```

### Frontend

```env
VITE_API_URL=http://localhost:5005/api
VITE_ASSET_URL=http://localhost:5005
VITE_FIREBASE_API_KEY=<firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<firebase-auth-domain>
VITE_FIREBASE_PROJECT_ID=<firebase-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<firebase-storage-bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<firebase-messaging-sender-id>
VITE_FIREBASE_APP_ID=<firebase-app-id>
VITE_RAZORPAY_KEY_ID=<razorpay-key-id>
```

Never commit real `.env` files or backend secrets.

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
