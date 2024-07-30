import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './signup.css';

function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let errors = {};
    const nameParts = fullName.trim().split(' ');

    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (nameParts.length < 3) {
      errors.fullName = 'Full name must include first name, middle name, and last name';
    }
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
    }
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handleInputChange = (field, value) => {
    switch (field) {
      case 'fullName':
        setFullName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      window.alert('Please fix the errors before submitting.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          fullname: fullName,
        });
      }
      console.log("User registered successfully");
      navigate('/login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        window.alert('Email is already in use. Please use a different email.');
      } else {
        window.alert(error.message);
      }
      console.log(error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-image">
          <img src="https://t3.ftcdn.net/jpg/01/68/60/76/360_F_168607659_evWV3Ab6ik9l0L1ihrjCaxYKEqxGNrbr.jpg" alt="Background" />
        </div>
        <div className="signup-form">
          <h2 className="signup-title">Sign Up</h2>
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                type="text"
                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                id="fullName"
                placeholder="Enter Your Fullname (First Middle Last)"
                value={fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
              />
              {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="agreeToTerms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                required
              />
              <label className="form-check-label" htmlFor="agreeToTerms">I agree to the Terms and Conditions</label>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary signup-btn" 
            >
              Sign Up
            </button>
          </form>
          <div className="login-link">
            Already have an account? <a href="/login">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup; 