import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './about.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight} from '@fortawesome/free-solid-svg-icons';

const AboutUs = () => {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        <div className="col-md-6">
          <div className="about-us-content animate__animated animate__fadeInLeft">
            <h2 className="display-4">Welcome to Learners</h2>
            <p>
              Welcome to E-Learning, where we are dedicated to providing high-quality educational resources and courses. Our mission is to empower learners of all ages by offering a diverse range of learning materials and expert instruction.
            </p>
            <p>
              At E-Learning, we believe that education should be accessible, engaging, and effective. Our team of experienced educators and industry professionals is committed to delivering top-notch content that helps you achieve your learning goals.
            </p>
            <div className="row">
              <div className="col-md-6">
              <h6 className="mb-3"><FontAwesomeIcon icon={faAngleRight} className="me-2" /> Skilled Instructors</h6>
              <h6 className="mb-3"><FontAwesomeIcon icon={faAngleRight} className="me-2" /> International Certificate</h6>
              </div>
              <div className="col-md-6">
                <h6 className="mb-3"><FontAwesomeIcon icon={faAngleRight} className="me-2" /> Flexible Learning Options</h6>
                <h6 className="mb-3"><FontAwesomeIcon icon={faAngleRight} className="me-2" /> Interactive Learning</h6>
              </div>
            </div>
            <Link to="/instructors" className="btn btn-primary mt-4">Meet Our Instructors</Link>
          </div>
        </div>
        <div className="col-md-6">
          <div className="about-us-image animate__animated animate__fadeInRight">
            <img src="https://image.freepik.com/free-vector/girl-learning-online-school-from-home-activity-study-front-laptop_248718-43.jpg" className="img-fluid rounded" alt="Learning Environment" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
