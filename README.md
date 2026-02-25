# Cura Web - Frontend (Project)

This is the frontend component of the Cura Web project, built with **React** and **Vite**.

## Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + PostCSS
- **Routing:** React Router v7
- **Authentication/Database:** Firebase
- **Icons & UI:** Lucide React, Chart.js (React-chartjs-2)
- **Formatting:** React Markdown, Remark GFM

## Core Features

- User authentication loops (Sign up, OTP verification, Login).
- Profile management and user settings configurations.
- Disease analysis and AI chatbot interfaces (renders markdown nicely for AI conversations).
- Responsive, modern Tailwind-based UI.

## File Structure Overview

- `src/pages/`: Contains page components such as `Profile.jsx`, `Settings.jsx`, Auth pages, etc.
- `public/`: Static assets.

## How to Run Locally

1. Ensure Node.js is installed.
2. Run `npm install` to install dependencies.
3. Add your `.env` variables if required (Firebase config, backend URL).
4. Run `npm run dev` to start the Vite development server.
