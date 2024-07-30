import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import { useAuth } from '../../components/authprovider';

const Contact = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser ? currentUser.displayName : '',
    email: currentUser ? currentUser.email : '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.displayName,
        email: currentUser.email,
        subject: '',
        message: ''
      });
    }
  }, [currentUser]);

  return (
    <div className="container-fluid p-5 bg-light">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <div className="animate__animated animate__fadeIn">
            <h2 className="text-center mb-4">Contact For Any Query</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="message">Message</label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                ></textarea>
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
