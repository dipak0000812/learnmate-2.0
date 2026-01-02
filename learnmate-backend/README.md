# LearnMate Backend API

Node.js + Express server handling authentication, user management, gamification, and AI orchestration.

## Key Services

*   **Auth**: JWT-based auth + Passport.js for Google/GitHub OAuth.
*   **Proxy**: Securely forwards requests to the Python AI service, injecting the `X-API-Key`.
*   **Database**: MongoDB with Mongoose schemas.
*   **Email**: Nodemailer integration for verification and resets.

## Environment Variables

Ensure your `.env` file includes:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/learnmate
JWT_SECRET=secret
AI_SERVICE_URL=http://localhost:5001
AI_API_KEY=secret_key

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## Running Standalone

```bash
npm install
npm run dev
```
