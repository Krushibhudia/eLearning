import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom';
import '../../components/signup/signup.css'; 

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    let errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    return errors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.alert('Please fix the errors before submitting.');
      return;
    }
    setErrors({});
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        console.log("User logged in Successfully!");
        onLoginSuccess();
      } else {
        setErrors({ general: 'User not found. Please check your email.' });
        window.alert('User not found. Please check your email.');
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setErrors({ general: 'User not found. Please check your email.' });
        window.alert('User not found. Please check your email.');
      } else if (error.code === 'auth/wrong-password') {
        setErrors({ password: 'Incorrect password. Please try again.' });
        window.alert('Incorrect password. Please try again.');
      } else {
        setErrors({ general: 'Login failed. Please try again later.' });
        window.alert('Incorrect email or password. Please try again!');
        window.alert('Login failed. Please try again later.');
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-image">
          <img src="https://t3.ftcdn.net/jpg/01/68/60/76/360_F_168607659_evWV3Ab6ik9l0L1ihrjCaxYKEqxGNrbr.jpg" alt="Background" />
        </div>
        <div className="signup-form">
          <h2 className="signup-title">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email && 'is-invalid'}`}
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password && 'is-invalid'}`}
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <button
              type="submit"
              className="btn btn-primary signup-btn"
            >
              Login
            </button>
          </form>
          <div className="login-link">
            <Link to="/forgotpassword">Forgot password?</Link>
          </div>
          <div className="login-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
