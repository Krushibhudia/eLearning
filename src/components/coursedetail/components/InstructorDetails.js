import React from 'react';

const InstructorDetails = ({ instructor }) => {
  return (
    instructor && (
      <div className="bg-light p-4 rounded shadow mb-4">
        <h2>Instructor</h2>
        <hr></hr>
        <div className="d-flex align-items-left">
          <img src={instructor.photoUrl} alt={instructor.name} className="img-thumbnail rounded-circle me-3" style={{ width: '100px', height: '100px' }} />
          <div>
            <h5>{instructor.name}</h5>
            <p>{instructor.bio}</p>
          </div>
        </div>
      </div>
    )
  );
};

export default InstructorDetails;
