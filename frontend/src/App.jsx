import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import StudentProfile from './pages/StudentProfile';
import Attendance from './pages/Attendance';
import AttendanceHistory from './pages/AttendanceHistory';
import Payments from './pages/Payments';
import AdminProfile from './pages/AdminProfile';
import Login from './pages/Login';
import Sidebar from './compenent/Sidebar';
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            {/* Login Page */}
            <Route path="/login" element={<Login />} />

            {/* Main Pages */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="students/add" element={<AddStudent />} />
              <Route path="students/profile/:id" element={<StudentProfile />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="attendance/history" element={<AttendanceHistory />} />
              <Route path="payments" element={<Payments />} />
              <Route path="admin-profile" element={<AdminProfile />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;