# Fitness Class Booking System

A React-based web application for booking fitness classes. Users can view available classes, make bookings, and manage their reservations.

## Features

- 📅 Browse available fitness classes
- 🔐 User authentication
- 📋 Class booking system
- 👤 Personal dashboard
- ❌ Booking cancellation
- 📱 Responsive design

## Tech Stack

- React with TypeScript
- Material UI
- React Query for data fetching
- Zustand for state management
- JSON Server for mock API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Install dependencies:

```bash
npm install
```

### Running the Application

1. Start the mock API server:

```bash
npm run server
```

This will start the JSON Server on port 1337.

2. In a new terminal, start the development server:

```bash
npm start
```

3. Or run both servers concurrently:

```bash
npm run dev
```

### Building for Production

1. Create a production build:

```bash
npm run build
```

2. Preview the production build:

```bash
npm run preview
```

This will serve the built app with the mock API server.

## API Endpoints

The mock API server provides the following endpoints:

- `GET /classes` - List all fitness classes
- `GET /users/:id` - Get user details and bookings
- `PATCH /users/:id` - Update user bookings
- `PATCH /classes/:id` - Update class capacity

## Demo Account

You can use the following credentials to test the application:

Username: `emilys`

Password: `emilyspass`

## Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_SERVER=http://localhost:1337
```
