import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import ProfessorDashboard from './components/Dashboard/ProfessorDashboard';
import CourseAssignments from './components/Assignments/CourseAssignments'; // NEW!
import AssignmentDetail from './components/Assignments/AssignmentDetail';
import Navbar from './components/Shared/Navbar';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/professor-dashboard"
            element={
              <ProtectedRoute requiredRole="professor">
                <ProfessorDashboard />
              </ProtectedRoute>
            }
          />
          {/* All assignments for a course (listing page) */}
          <Route
            path="/course/:courseId"
            element={
              <ProtectedRoute>
                <CourseAssignments />
              </ProtectedRoute>
            }
          />
          {/* Assignment detail (this fixes the undefined issue) */}
          <Route
            path="/course/:courseId/assignment/:assignmentId"
            element={
              <ProtectedRoute>
                <AssignmentDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
