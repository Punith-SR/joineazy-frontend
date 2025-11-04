import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI } from '../../services/api';
import './Assignments.css';

const CourseAssignments = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      const { data } = await coursesAPI.getById(courseId);
      setCourse(data);
    };
    fetchCourse();
  }, [courseId]);

  if (!course) return <div className="assignments-container">Loading...</div>;

  return (
    <div className="assignments-container">
      <h2>{course.name} Assignments</h2>
      <ul className="assignments-list">
        {course.assignments && course.assignments.length ? (
          course.assignments.map(a => (
            <li
              key={a._id}
              onClick={() => navigate(`/course/${courseId}/assignment/${a._id}`)}
            >
              <div className="assignment-title">{a.title}</div>
              {a.description && <div className="assignment-desc">{a.description}</div>}
              {a.dueDate && (
                <div className="assignment-due">
                  <span>Due:</span> {new Date(a.dueDate).toLocaleDateString()}
                </div>
              )}
            </li>
          ))
        ) : (
          <div>No assignments yet for this course.</div>
        )}
      </ul>
    </div>
  );
};

export default CourseAssignments;
