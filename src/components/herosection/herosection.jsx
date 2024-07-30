import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './herosection.css';

const Herosection = () => {
  return (
    <section className='hero-section'>
      <div className="overlay"></div>
      <Container className='text-center'>
        <Row className="align-items-center justify-content-center">
          <Col lg='8' md='10'>
            <div className='hero-content'>
              <h1 className='display-3 fw-bold text-white animate__animated animate__fadeInDown'>Elevate Your Skills with Premier Online Education</h1>
              <p className='lead text-white-50 mb-4 animate__animated animate__fadeInUp'>Join millions of learners and access courses that inspire and educate.</p>
              
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Herosection;
