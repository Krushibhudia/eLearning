import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase'; 
import '../signup/signup.css'; 
import { collection, addDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
    }
    return errors;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      console.log('Sending password reset email to:', email);
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setIsEmailSent(true);
      console.log('Password reset email sent successfully!');

      await addDoc(collection(db, 'passwordResetRequests'), {
        email,
        createdAt: new Date(),
      });

      window.alert('Password reset email sent successfully! Please check your email.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      if (error.code === 'auth/network-request-failed') {
        console.log('Retrying password reset email...');
        setTimeout(() => handleResetPassword(e), 2000); // Retry after 2 seconds
      } else {
        window.alert('Error sending password reset email. Please try again later.');
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-image">
          <img
            src="https://t3.ftcdn.net/jpg/01/68/60/76/360_F_168607659_evWV3Ab6ik9l0L1ihrjCaxYKEqxGNrbr.jpg"
            alt="Background"
          />
        </div>
        <div className="signup-form">
          <h2 className="signup-title">Forgot Password</h2>
          {!isEmailSent ? (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email && 'is-invalid'}`}
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <button type="submit" className="btn btn-primary signup-btn">
                Reset Password
              </button>
            </form>
          ) : (
            <div>
              <p className="text-center mb-4">Password reset email sent to {email}</p>
              <p className="text-center">Please check your email to reset your password.</p>
              <Link to="/login" className="btn btn-primary signup-btn">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
