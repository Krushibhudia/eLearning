import React, { useEffect } from 'react';
import './instruction.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons'; 

const Instruction = () => {
  useEffect(() => {
    const steps = document.querySelectorAll('.step');

    const fadeInSteps = () => {
      steps.forEach((step) => {
        if (isElementInViewport(step)) {
          step.classList.add('animate__fadeInUp');
        }
      });
    };

    window.addEventListener('scroll', fadeInSteps);
    return () => {
      window.removeEventListener('scroll', fadeInSteps);
    };
  }, []);

  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  return (
    <section>
      <div className="container">
        <h2 className="text-center mb-4">How It Works?</h2>
        <div className="text-center mb-4">
      <FontAwesomeIcon icon={faBookOpen} className="book-icon" style={{ color: '#17bf9e' }} />
      </div>
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 text-center step">
            <div className="step-icon rounded-circle" style={{ backgroundColor: '#17bf9e', color: 'white' }}>
  <span className="fw-bold">1</span>
</div>

              <div className="card-body">
                <h3 className="card-title">Sign Up</h3>
                <p className="card-text">Create an eLearn account to get started with the courses.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 text-center step">
            <div className="step-icon rounded-circle" style={{ backgroundColor: '#17bf9e', color: 'white' }}>
  <span className="fw-bold">2</span>
</div>
              <div className="card-body">
                <h3 className="card-title">Choose a Course</h3>
                <p className="card-text">Browse and select a course that interests you.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 text-center step">
            <div className="step-icon rounded-circle" style={{ backgroundColor: '#17bf9e', color: 'white' }}>
  <span className="fw-bold">3</span>
</div>
              <div className="card-body">
                <h3 className="card-title">Start Learning</h3>
                <p className="card-text">Begin your learning journey with our expert instructors.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Instruction;
