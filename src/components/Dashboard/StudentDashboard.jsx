import React, { useState, useEffect, useContext } from 'react';
import { coursesAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import CourseCard from '../Courses/CourseCard';
import '../Dashboard/Dashboard.css';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await coursesAPI.getAll();
        setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, [token]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📖 My Courses</h1>
      <div className="courses-grid">
        {courses.map(course => (
          <CourseCard key={course._id} course={course} onClick={() => navigate(`/course/${course._id}`)} />
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
