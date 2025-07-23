# FitTracker

A modern, full-stack fitness tracking web application built with Next.js (React), Express.js, and MongoDB. FitTracker helps users log workouts, track body measurements, calculate BMI, visualize progress, and chat with a personalized AI fitness trainer powered by Google Gemini.

## Features

- **User Authentication**: Secure registration and login with JWT-based authentication.
- **Workout Logging**: Add, view, and manage workouts with sets, reps, weights, and body part targeting.
- **Body Measurements**: Track weight, height, and BMI over time.
- **Progress Visualization**: Interactive charts and stats for workouts and body metrics.
- **AI Trainer**: Chat with a context-aware AI fitness assistant for personalized advice, plans, and motivation.
- **Responsive UI**: Clean, modern, mobile-friendly interface using Tailwind CSS and shadcn/ui components.

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **AI Integration**: Google Gemini API (Generative Language)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- Google Gemini API key (for AI Trainer)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/iCodeLakshay/fit-tracker-frontend.git
   cd fit-tracker-frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in both the frontend and backend directories as needed.
   - For the backend, add:
     ```env
     MONGODB_URL=your_mongodb_connection_string
     GEMINI_API_KEY=your_google_gemini_api_key
     JWT_SECRET=your_jwt_secret
     ```
   - For the frontend, add any required public environment variables.

4. **Start the backend server:**
   ```sh
   cd project-backend
   npm install
   npm run dev
   ```

5. **Start the frontend app:**
   ```sh
   cd project
   npm run dev
   ```

6. **Access the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
project/
  app/                # Next.js app directory
  components/         # Reusable React components
  hooks/              # Custom React hooks
  lib/                # API utilities and helpers
  types/              # TypeScript types
  ...
project-backend/
  controllers/        # Express route controllers
  models/             # Mongoose models
  routes/             # Express route definitions
  src/                # Express app entry point
  ...
```

## AI Trainer Setup
- Make sure your Google Gemini API key is valid and the Generative Language API is enabled in your Google Cloud project.
- The AI Trainer uses your profile and workout history for personalized responses.

## License

MIT
