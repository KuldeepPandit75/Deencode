# Deencode Competition Platform

A real-time competition platform where admins can control and display questions to viewers in real-time.

## Features

- Real-time question display
- Admin control panel for managing questions
- Viewer interface for seeing questions
- Secure admin authentication
- Real-time answer reveal

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

## Usage

1. Access the viewer interface at `http://localhost:3000`
2. Access the admin interface at `http://localhost:3000/login`
   - Default admin credentials:
     - Username: admin
     - Password: admin123

## Admin Features

- Start/End competition
- Add/Delete questions
- Navigate between questions
- Show answers to viewers
- Real-time updates to all viewers

## Viewer Features

- Real-time question display
- Answer reveal when admin shows it
- Clean and responsive interface

## Security Note

The current implementation uses a simple hardcoded admin password. In a production environment, you should:

1. Implement proper authentication with JWT or similar
2. Use environment variables for sensitive data
3. Add rate limiting
4. Implement proper session management
5. Use HTTPS
6. Add input validation and sanitization 