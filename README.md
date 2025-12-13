# Club Management System

A comprehensive web-based platform designed to bridge the gap between students and university clubs. This system simplifies club management, event organization, and member engagement through a seamless, interactive interface.

## Project Description

The Club Management System streamlines the administrative and social aspects of university club life. It serves three primary user roles:
*   **Students/Members**: Can explore clubs, join communities, register for events, and manage their payments.
*   **Club Managers**: Have tools to organize their club, manage membership requests, create and promote events, and track financial performance.
*   **Super Admins**: Oversee the entire platform, ensuring quality and security by approving clubs and managers, and monitoring platform-wide statistics.

This project uses a modern tech stack (React, MongoDB, Express) to ensure a responsive and efficient user experience.

## Key Features

### For Members
-   **Club Discovery**: Browse and search for clubs by category or name.
-   **Membership Management**: Request to join clubs and view membership status.
-   **Event Registration**: Register for upcoming events and pay event fees securely.
-   **Payment History**: Track all transaction history for club fees and event registrations.
-   **Profile Management**: Update personal profile details.

### For Club Managers
-   **Dashboard**: A dedicated dashboard to view member counts, upcoming events, and revenue.
-   **Member Oversight**: Approve or reject membership requests.
-   **Event Management**: Create, update, and manage club events.
-   **Financial Tracking**: View transaction history related to the club.

### For Super Admins
-   **Platform Governance**: Approve new club creation requests and verify club managers.
-   **User Management**: detailed view of all users with options to promote/demote roles or update status.
-   **Event Moderation**: Review and approve events before they go live.
-   **Statistics**: View high-level platform statistics including total users, active clubs, and total revenue.

## Technology Stack

-   **Frontend**: React, Vite, TailwindCSS
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB
-   **Authentication**: Firebase
-   **Payments**: Stripe

## Live Link

- **[Live Site URL](https://onebeforethelast-4b04d.web.app)**

## Workflow & Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- **Node.js** installed on your machine.
- **MongoDB** running locally or a connection string for a cloud database.

### 1. Backend Setup

The backend handles API requests and database interactions.

1. Navigate to the backend directory:
   ```bash
   cd ../backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the `backend` directory if one is required (check `index.js` or `config` for required variables like `DB_URI`, `STRIPE_SECRET_KEY`, etc.).
4. Start the server:
   ```bash
   npm run dev
   ```
   > This command runs `nodemon index.js` and usually starts the server on port 5000 (or as configured). It also executes `scripts/make_admin.js` before starting.

### 2. Frontend Setup

The frontend is built with React and Vite.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
   *(If you are already in the root, just `cd frontend`. If you were in backend, `cd ../frontend`)*
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the link shown in the terminal (typically `http://localhost:5173`) to view the app.

## Project Structure

- **frontend/**: React application using Vite, TailwindCSS, and other UI libraries.
- **backend/**: Node.js/Express server using MongoDB and Firebase Admin for authentication/authorization.
Admin Email: tom@tom.com
Admin pass: Suckit123@