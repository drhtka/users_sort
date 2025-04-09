# User Management Application

Web application for managing users with features for viewing, adding, editing, and deleting users.

## Technologies

### Frontend:

-   React with functional components
-   TypeScript
-   react-hook-form for form management
-   zod for data validation
-   Material UI (MUI) for styling
-   TanStack Query for data fetching

### Backend:

-   Node.js
-   json-server for RESTful API

## Features

-   Display users in a table/card layout
-   Pagination and sorting support
-   Create new users
-   Edit existing users
-   Delete users with confirmation
-   Responsive interface for mobile and desktop devices
-   Client-side data validation

## Project Structure

```
/
├── frontend/            # React application
│   ├── src/
│   │   ├── api/         # API services
│   │   ├── components/  # React components
│   │   └── types/       # TypeScript types
│   └── public/
│
└── backend/             # Backend server
    ├── src/             # Server source code
    └── db.json          # JSON database
```

## Installation and Setup

### Requirements

-   Node.js (v20.18.0 or higher)
-   npm (v10.9.1 or higher)

### Installing Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running the Application

#### Running Separately

1. Start the backend:

```bash
cd backend
npm run json-server
```

2. Start the frontend (in a new terminal):

```bash
cd frontend

npm start
```

## Accessing the Application

After starting, the application will be available at:

-   Frontend: http://localhost:3000
-   Backend API: http://localhost:5001/users

## User Interface Features

-   View all users with pagination
-   Sort by name, email, phone, and role
-   Add new users
-   Edit existing users
-   Delete users with confirmation
-   Responsive design for mobile devices
