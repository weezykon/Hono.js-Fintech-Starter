# Hono.js Fintech Starter

This is a production-ready boilerplate for building Fintech applications using Hono.js.

## Features

- **Hono.js:** A fast, lightweight, and flexible web framework for Node.js.
- **PostgreSQL:** A powerful, open-source object-relational database system.
- **Kysely:** A type-safe SQL query builder for TypeScript.
- **BullMQ:** A robust and fast job queue system for Node.js.
- **Zod:** A TypeScript-first schema declaration and validation library.
- **JWT Authentication:** Secure user authentication using JSON Web Tokens.
- **Database Migrations:** A simple migration system to manage your database schema.
- **Background Jobs:** An example of a background job using BullMQ.
- **Error Handling & Logging:** Centralized error handling and request logging.
- **Dockerized Environment:** A complete Docker setup for easy development and deployment.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Docker](https://www.docker.com/)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/weezykon/Hono.js-Fintech-Starter.git
   cd Hono.js-Fintech-Starter
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root of the project and add the following variables:

   ```
   POSTGRES_USER=user
   POSTGRES_PASSWORD=password
   POSTGRES_DB=fintech_db

   DATABASE_URL=postgresql://user:password@localhost:5432/fintech_db

   REDIS_HOST=localhost
   REDIS_PORT=6379

   JWT_SECRET=your-secret-key
   ```

4. **Start the database and Redis:**

   ```bash
   docker compose up -d
   ```

5. **Run database migrations:**

   ```bash
   npm run db:migrate:up
   ```

## Running the Application

To start the development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## API Endpoints

- **POST /auth/register:** Register a new user.
- **POST /auth/login:** Log in a user and get a JWT token.
- **GET /me:** Get the current user's information (requires authentication).
- **POST /jobs/send-email:** Add a job to the email queue (requires authentication).