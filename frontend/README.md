# Student Attendance & Payment Tracker

A comprehensive web application built with the MERN stack to manage student registrations, track daily attendance, and monitor fee payments efficiently.

## 🚀 Features
* **Admin Dashboard:** Quick overview of total students, present students today, and monthly income stats.
* **Student Management:** Securely add, update, view, and delete student profiles (CRUD).
* **Attendance Tracking:** Mark daily student attendance and view individual attendance history.
* **Payment Handling:** Record student fee payments and view comprehensive payment histories.
* **Secure Authentication:** JWT-based login system for admin data protection.

## 💻 Tech Stack
* **Frontend:** React.js, Tailwind CSS, Vite
* **Backend:** Node.js, Express.js, JWT (JSON Web Tokens)
* **Database:** MongoDB Atlas (Mongoose)

## 🛠️ Getting Started

Follow these steps to run the project on your local machine.

### 1. Clone the repository
`git clone https://github.com/LauraHarshani/Student-attendance-and-payment-tracker.git`

### 2. Setup Backend
Open a terminal and navigate to the backend directory:
`cd backend`
`npm install`

Create a `.env` file in the `backend` folder and add your environment variables:
`PORT=5000`
`MONGO_URI=your_mongodb_connection_string`
`JWT_SECRET=your_jwt_secret_key`

Start the backend server:
`npm run dev`

### 3. Setup Frontend
Open a new terminal and navigate to the frontend directory:
`cd frontend`
`npm install`

Start the frontend development server:
`npm run dev`

## 👥 Contributors
* Harshani (Express server, Auth API, Student CRUD API, Frontend/UI, Integration)
* Minidu (Attendance API, Payment API, Admin Profile API,Frontend/UI ,Integration)
* Nirmal (Database Schema, Validation, Aggregation APIs ,Frontend/UI)