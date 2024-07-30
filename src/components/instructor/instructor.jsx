import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase';
import './instructor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons'; 

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const instructorsRef = ref(database, 'user/instructors');

    const unsubscribe = onValue(instructorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => data[key]);
        setInstructors(formattedData);
      }
    }, (error) => {
      console.error('Error fetching data:', error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const isVisible = scrollTop > 100; 
      if (isVisible) {
        document.querySelectorAll('.instructor').forEach((element) => {
          element.classList.add('animate__animated', 'animate__fadeInUp');
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Expert Instructors</h2>
      <div className="text-center mb-4">
      <FontAwesomeIcon icon={faBookOpen} className="book-icon" style={{ color: '#17bf9e' }} />
      </div>
      <div className="row gy-4">
        {instructors.map((instructor, index) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
            <div className="card text-center instructor-card">
              <img 
                src={instructor.image} 
                className="card-img-top rounded-circle instructor-image" 
                alt={instructor.name} 
              />
              <div className="card-body">
                <h5 className="card-title">{instructor.name}</h5>
                <p className="card-text">{instructor.designation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructors;
