import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/header/header';
import AboutUs from './pages/about/about';
import Home from './pages/home';
import Footer from './components/footer/footer';
import Contact from './pages/contact/contact';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import Signup from './components/signup/signup';
import Login from './components/login/login';
import Profile from './components/profile/profile';
import CourseDetail from './components/coursedetail/coursedetail';
import ForgotPassword from './components/login/forgotpassword';
import Instructors from './components/instructor/instructor';
import EnrollmentForm from './components/enrollment/enroll';
import QuizPage from './components/quiz/quiz';
import CoursesPage from './components/coursessection/coursepage';
import AuthProvider,{ useAuth }  from './components/authprovider';
import { auth } from './firebase';
import EditProfile from './components/editprofile/editprofile';
import NotFoundPage from './components/pagenotfound';

function App() {
  const { currentUser, loading } = useAuth();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (!loading) {
      setIsLoggedIn(!!currentUser);
    }
  }, [currentUser, loading]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
  
      setIsLoggedIn(false);
  
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <Router>
      <AuthProvider>

      <Header isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/enroll/:id" element={<EnrollmentForm />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route Component={NotFoundPage} /> 

        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace /> 
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isLoggedIn ? (
              <Profile isLoggedIn={isLoggedIn} onLogout={handleLogout} />

            ) : (
              <Navigate to="/login" replace /> 
            )
          }
        />
        <Route
            path="/edit-profile"
            element={
              isLoggedIn ? (
                <EditProfile />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
  path="/change-password"
  element={
    isLoggedIn ? (
      <ForgotPassword />
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>

<Route
  path="/course/:id"
  element={<CourseDetail userName={currentUser?.displayName} userEmail={currentUser?.email} />}
/>
      </Routes>
      <Footer />
      </AuthProvider>

    </Router>
  );
}

export default App;
