# Live Location Tracking 

A real-time location tracking system for administrators to monitor users' location updates and statuses. The system uses **Socket.IO** for real-time communication and includes a dashboard with interactive maps and user status updates.

---

## Features

- **User Registring & login**: users can register and login.
- **Location sharing**: users can share there location.
- **User Location Log**: users location log can be viewed via admin.
- **Real-Time Location Updates**: Track user locations in real-time with automatic updates via Socket.IO.
- **User Status Tracking**: Monitor online and offline status of users.
- **Interactive Map**: View user locations on a map using Leaflet.
- **PDF Export**: Export location logs for individual users as a PDF.
- **Admin Dashboard**: Manage users and view their activity logs.
- **Secure Authentication**: API routes are protected for authorized users only.

---

## Tech Stack

### Frontend
- **React.js**: For building the interactive user interface.
- **Tailwind**: A CSS framework for styling.
- **Material-UI**: UI components for enhanced design and usability.
- **Leaflet**: For rendering maps.

### Backend
- **Node.js & Express**: RESTful API for managing users and logs.
- **Socket.IO**: Real-time communication.
- **MongoDB**: Database for storing users and logs.

---

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

---

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DELTA18/location-tracker
  
2. **.Install dependencies for the backend**
    ```bash
   cd backend
   npm install

3. **Backend .env**
    ```bash
   FRONTEND_URI = http://localhost:5173
   MONGO_URI = 
   ADMIN_USERNAME = admin
   ADMIN_PASSWORD = pass1234

4. **Start the backend server:**
    ```bash
   node server.js

5. **Install dependencies for the frontend:**
    ```bash
   cd frontend
   npm install

6. **Frontend .env**
    ```bash
   VITE_BACKENDURI = your backendURI

7. **Start the frontend development server:**
    ```bash
   npm run dev

Open your browser and navigate to http://localhost:5173 to use the application.

## Folder Structure

### Backend (`/backend`)
- `routes/`: Contains API route files for authentication, location, and admin-related routes.
- `models/`: MongoDB models for users, logs, etc.
- `config/`: Configuration files for connecting to the database, environment variables, etc.
- `server.js`: Entry point for the backend.
- `socket.js`: Contains Socket.IO logic for handling real-time events, such as user location updates and online/offline statuses.



---

## Usage

1. **Admin Dashboard**
   - View all users and their statuses (online/offline).
   - View real-time location logs of users.
   - Export user logs as a PDF.
   - View locations on an interactive map.

2. **Real-Time Updates**
   - Users send their location data through the frontend.
   - Admins can view live updates in the dashboard, including the latest location for each user.

---

## API Endpoints

### Authentication
- `POST /api/auth/login`: User login authentication.
- `POST /api/auth/register`: User registration.

### Admin Routes
- `POST /api/admin/login`: Admin login.
- `GET /api/admin/users`: Fetch all registered users.
- `GET /api/admin/users/:userId/logs`: Fetch location logs for a specific user.

### Location Updates
- `POST /api/location/`: Saves location logs in the database .

---

## Contributing

1. Fork the repository.
2. Create a new branch for your changes.
3. Commit your changes.
4. Open a pull request for review.

---

## License



---

## Acknowledgments

- **Material-UI** for providing reusable UI components.
- **Leaflet** for rendering interactive maps.
- **Socket.IO** for enabling real-time communication.
- **MongoDB** for providing a flexible and scalable NoSQL database solution.
