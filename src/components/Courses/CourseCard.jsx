import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Courses/Courses.css';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="course-card"
      onClick={() => navigate(`/course/${course._id}`)}
    >
      <div className="course-header">
        <h3>{course.name}</h3>
        <span className="course-code">{course.code}</span>
      </div>
      <p className="course-description">{course.description}</p>
      <div className="course-footer">
        <span className="professor">Prof: {course.professor?.name}</span>
        <span className="count">{course.assignments?.length || 0} Assignments</span>
      </div>
    </div>
  );
};

export default CourseCard;
