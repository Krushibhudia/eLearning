import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import './feature.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons'; 

const Feature = () => {

  const featureData = [
    {
      title: 'Quick Learning',
      desc: 'Our courses are designed to provide a comprehensive learning experience that enables you to grasp complex concepts quickly and effectively.',
      icon: 'ri-lightbulb-flash-line'
    },
    {
      title: 'Certification',
      desc: 'Our courses are designed to help you earn professional certificates that are widely recognized and highly respected in various industry fields.',
      icon: 'ri-award-line'
    },
    {
      title: 'Learn from experts',
      desc: 'Our courses are taught by experienced professionals who are leaders in their fields. Discover how learning from the best can help you achieve your goals.',
      icon: 'ri-user-star-line'
    },
    {
      title: 'Flexible schedule',
      desc: 'Our e-learning platform is designed to fit into your busy life. Discover how our flexible schedule options make learning convenient and effective.',
      icon: 'ri-calendar-check-line'
    }
  ];

  return (
    <section className="py-5">
      <Container>
        <h2 className="text-center mb-4">What are the benefits?</h2>
        <div className="text-center mb-4">
      <FontAwesomeIcon icon={faBookOpen} className="book-icon" style={{ color: '#17bf9e' }} />
      </div>
        <Row xs="1" md="2" lg="4" className="g-4">
          {
            featureData.map((item, index) => (
              <Col key={index} className="text-center">
                <div className='single_feature animate__animated animate__fadeIn'>
                  <h2 className='mb-3'><i className={item.icon}></i></h2>
                  <h5>{item.title}</h5>
                  <p>{item.desc}</p>
                </div>
              </Col>
            ))
          }
        </Row>
      </Container>
    </section>
  );
}

export default Feature;
