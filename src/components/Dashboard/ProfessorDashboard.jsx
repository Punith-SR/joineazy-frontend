import React, { useEffect, useState, useContext } from 'react';
import { coursesAPI, assignmentsAPI } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import '../Dashboard/Dashboard.css';

const ProfessorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [addAssignmentCourseId, setAddAssignmentCourseId] = useState(null);
  const [studentEmail, setStudentEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  });
  const [assignmentFormData, setAssignmentFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    submissionType: 'Individual',
  });
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchCourses();
  }, [token]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getAll();
      setCourses(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (err) {
      setError('Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await coursesAPI.create(formData);
      setFormData({ name: '', code: '', description: '' });
      setShowCreateForm(false);
      await fetchCourses();
      alert('✅ Course created successfully!');
    } catch (err) {
      alert('❌ Failed to create course');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !studentEmail) {
      alert('Please fill all fields');
      return;
    }
    try {
      await coursesAPI.addStudentByEmail(selectedCourse._id, studentEmail);
      setStudentEmail('');
      setSelectedCourse(null);
      await fetchCourses();
      alert('✅ Student added successfully!');
    } catch (err) {
      alert('❌ Failed to add student');
    }
  };

  // --- ADD ASSIGNMENT ---
  const handleAddAssignment = async (courseId, e) => {
    e.preventDefault();
    try {
      await assignmentsAPI.create({
        title: assignmentFormData.title,
        description: assignmentFormData.description,
        dueDate: assignmentFormData.dueDate,
        submissionType: assignmentFormData.submissionType,
        course: courseId,
      });
      setAssignmentFormData({
        title: '',
        description: '',
        dueDate: '',
        submissionType: 'Individual',
      });
      setAddAssignmentCourseId(null);
      await fetchCourses();
      alert('✅ Assignment added successfully!');
    } catch (err) {
      alert('❌ Failed to add assignment');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">👨‍🏫 My Courses</h1>
        <button
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '✕ Cancel' : '+ New Course'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && (
        <form className="create-form" onSubmit={handleCreateCourse}>
          <input
            type="text"
            placeholder="Course Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Course Code (e.g., CS201)"
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows="4"
          />
          <button type="submit">Create Course</button>
        </form>
      )}

      {loading ? (
        <p className="loading">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="no-data">No courses yet. Create one to get started!</p>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <h3>{course.name}</h3>
              <p className="course-code">{course.code}</p>
              <p>{course.description}</p>
              <div className="course-stats">
                <p className="count">👥 Students: {course.students?.length || 0}</p>
                <p className="count">📋 Assignments: {course.assignments?.length || 0}</p>
              </div>
              {course.students && course.students.length > 0 && (
                <div className="students-list">
                  <strong>Enrolled:</strong>
                  <ul>
                    {course.students.map((student) => (
                      <li key={student._id}>
                        {student.name} ({student.email})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                className="add-student-btn"
                onClick={() => setSelectedCourse(course)}
              >
                {selectedCourse?._id === course._id
                  ? '✕ Hide Form'
                  : '+ Add Student'}
              </button>
              {selectedCourse?._id === course._id && (
                <form className="add-student-form" onSubmit={handleAddStudent}>
                  <input
                    type="email"
                    placeholder="Student Email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    autoFocus
                    required
                  />
                  <button type="submit">Add Student</button>
                  <button
                    type="button"
                    onClick={() => setSelectedCourse(null)}
                  >
                    Cancel
                  </button>
                </form>
              )}
              {/* --- ADD ASSIGNMENT --- */}
              <button
                className="add-assignment-btn"
                onClick={() =>
                  setAddAssignmentCourseId(
                    addAssignmentCourseId === course._id ? null : course._id
                  )
                }
              >
                {addAssignmentCourseId === course._id
                  ? '✕ Cancel'
                  : '+ Add Assignment'}
              </button>
              {addAssignmentCourseId === course._id && (
                <form
                  className="add-assignment-form"
                  onSubmit={(e) => handleAddAssignment(course._id, e)}
                >
                  <input
                    type="text"
                    placeholder="Assignment Title"
                    value={assignmentFormData.title}
                    onChange={(e) =>
                      setAssignmentFormData({
                        ...assignmentFormData,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={assignmentFormData.description}
                    onChange={(e) =>
                      setAssignmentFormData({
                        ...assignmentFormData,
                        description: e.target.value,
                      })
                    }
                  />
                  <input
                    type="date"
                    value={assignmentFormData.dueDate}
                    onChange={(e) =>
                      setAssignmentFormData({
                        ...assignmentFormData,
                        dueDate: e.target.value,
                      })
                    }
                    required
                  />
                  <select
                    value={assignmentFormData.submissionType}
                    onChange={(e) =>
                      setAssignmentFormData({
                        ...assignmentFormData,
                        submissionType: e.target.value,
                      })
                    }
                  >
                    <option value="Individual">Individual</option>
                    <option value="Group">Group</option>
                  </select>
                  <button type="submit">Add Assignment</button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessorDashboard;
