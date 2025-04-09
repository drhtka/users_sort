# Users Sort API backend

A simple user management API built with Node.js, Express, and Sequelize.

## Features

-   User CRUD operations
-   Database integration with Sequelize
-   Error handling middleware

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/<ваш-username>/users_sort.git

    ```

2. Install dependencies:
   npm install

3. Create a .env file and configure your environment variables:

PORT=5001
DATABASE_URL=<your-database-url>

4. Start the server:
   npm start

5. API Endpoints
   GET /api/users - Get all users
   POST /api/users - Create a new user
   PUT /api/users/:id - Update a user
   DELETE /api/users/:id - Delete a user
