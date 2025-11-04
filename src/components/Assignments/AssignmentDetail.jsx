import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { assignmentsAPI, submissionsAPI } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import './AssignmentDetail.css';

const AssignmentDetail = () => {
  const { assignmentId } = useParams();
  const { user } = useContext(AuthContext);
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      const { data } = await assignmentsAPI.getDetails(assignmentId);
      setAssignment(data.assignment);
      setSubmissions(data.submissions || []);
      setSubmission(
        (data.submissions || []).find(
          s => s.submittedBy._id === user.id || (s.group && s.group.leader === user.id)
        )
      );
      setLoading(false);
    };
    fetchAssignment();
  }, [assignmentId, user]);

  const handleSubmit = async () => {
    await submissionsAPI.submitIndividual(assignmentId);
    setSubmission({ ...submission, status: 'submitted' });
  };

  const handleAcknowledge = async () => {
    await submissionsAPI.acknowledgeGroup(assignmentId, submission.group._id);
    setSubmission({ ...submission, status: 'acknowledged' });
  };

  if (loading || !assignment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="assignment-detail-card">
      <h2>{assignment.title}</h2>
      <div className="badge">{assignment.submissionType}</div>
      <p>{assignment.description}</p>
      <div>Due: <b>{new Date(assignment.dueDate).toLocaleString()}</b></div>

      {assignment.submissionType === 'Individual' ? (
        (!submission || submission.status !== 'submitted') ? (
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        ) : (
          <div className="submission-status success-anim animate">
            <span className="checkmark">✔</span>
            Submitted!
          </div>
        )
      ) : (
        <>
          <div className="submission-status">Status: {submission ? submission.status : 'Not Yet Submitted'}
            {submission?.status === 'acknowledged' && <span className="checkmark">✔ Acknowledged</span>}
          </div>
          {submission && submission.group.leader === user.id && submission.status === 'submitted' && (
            <button className="submit-btn" onClick={handleAcknowledge}>Acknowledge Submission</button>
          )}
        </>
      )}

      <div className="progress-bar-container">
        <ProgressBar value={(submissions.filter(s => s.status === 'acknowledged').length / submissions.length) * 100} />
        <span className="progress-label">{submissions.filter(s => s.status === 'acknowledged').length} / {submissions.length} Acknowledged</span>
      </div>
    </div>
  );
};

const ProgressBar = ({ value }) => (
  <div className="progress-bar-outer">
    <div className="progress-bar-inner" style={{ width: `${value || 0}%` }} />
  </div>
);

export default AssignmentDetail;
