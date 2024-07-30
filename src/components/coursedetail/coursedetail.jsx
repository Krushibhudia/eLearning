import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import './coursedetail.css';

import CourseDescription from './components/CourseDescription';
import InstructorDetails from './components/InstructorDetails';
import Reviews from './components/Reviews';
import ModuleNavigation from './components/ModuleNavigation';
import VideoPlayer from './components/VideoPlayer';
import { useAuth } from '../authprovider';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [resources, setResources] = useState([]); // State for resources
  const [liveLectures, setLiveLectures] = useState([]); // State for live lectures
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchCourse = () => {
      const db = getDatabase();
      const courseRef = ref(db, `user/courses/${id}`);
      onValue(courseRef, (snapshot) => {
        const data = snapshot.val();
        setCourse(data);
      }, (error) => {
        console.error('Error fetching course:', error);
      });
    };

    const fetchReviews = () => {
      const db = getDatabase();
      const reviewsRef = ref(db, `user/courses/${id}/reviews`);
      onValue(reviewsRef, (snapshot) => {
        const reviewsData = snapshot.val();
        const reviewsArray = reviewsData ? Object.values(reviewsData) : [];
        setReviews(reviewsArray);
        if (reviewsArray.length > 0) {
          const totalRating = reviewsArray.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = totalRating / reviewsArray.length;
          setAverageRating(avgRating.toFixed(1));
        } else {
          setAverageRating(0);
        }
      }, (error) => {
        console.error('Error fetching reviews:', error);
      });
    };

    const fetchQuestions = () => {
      const db = getDatabase();
      const questionsRef = ref(db, `user/courses/${id}/questions`);
      onValue(questionsRef, (snapshot) => {
        const questionsData = snapshot.val();
        const questionsArray = questionsData ? Object.values(questionsData) : [];
        setQuestions(questionsArray);
      }, (error) => {
        console.error('Error fetching questions:', error);
      });
    };

    const fetchResources = () => {
      const db = getDatabase();
      const resourcesRef = ref(db, `user/courses/${id}/resources`);
      onValue(resourcesRef, (snapshot) => {
        const resourcesData = snapshot.val();
        const resourcesArray = resourcesData ? Object.values(resourcesData) : [];
        setResources(resourcesArray);
      }, (error) => {
        console.error('Error fetching resources:', error);
      });
    };

    const checkEnrollment = () => {
      if (currentUser) {
        const db = getDatabase();
        const enrolledUsersRef = ref(db, `user/courses/${id}/enrolled_users`);
        onValue(enrolledUsersRef, (snapshot) => {
          const enrolledUsers = snapshot.val();
          setIsEnrolled(enrolledUsers && enrolledUsers[currentUser.uid]);
        }, (error) => {
          console.error('Error checking enrollment:', error);
        });
      }
    };

    const fetchLiveLectures = () => {
      const db = getDatabase();
      const liveLecturesRef = ref(db, `user/courses/${id}/liveLectures`);
      onValue(liveLecturesRef, (snapshot) => {
        const liveLecturesData = snapshot.val();
        const liveLecturesArray = liveLecturesData ? Object.values(liveLecturesData) : [];
        setLiveLectures(liveLecturesArray);
      }, (error) => {
        console.error('Error fetching live lectures:', error);
      });
    };

    fetchCourse();
    fetchReviews();
    fetchQuestions();
    fetchResources();
    checkEnrollment();
    fetchLiveLectures();
  }, [id, currentUser, navigate]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const comment = e.target.comment.value;
    if (rating && comment && currentUser.email && id) {
      const db = getDatabase();
      const reviewsRef = ref(db, `user/courses/${id}/reviews`);
      const newReviewRef = push(reviewsRef);
      const reviewerName = currentUser.displayName || 'Unknown User';
      const reviewerEmail = currentUser.email;
  
      set(newReviewRef, {
        rating,
        comment,
        reviewerName,
        reviewerEmail,
      })
      .then(() => {
        console.log('Review submitted successfully');
        setRating(0);
        setError(null);
      })
      .catch((error) => {
        console.error('Error submitting review:', error);
        setError('Error submitting review. Please try again later.');
      });
      e.target.reset();
    } else {
      console.error('Missing required fields for review submission');
      setError('Please fill in all required fields.');
    }
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    const question = e.target.question.value;
    if (question && currentUser.email && id) {
      const db = getDatabase();
      const questionsRef = ref(db, `user/courses/${id}/questions`);
      const newQuestionRef = push(questionsRef);
      const askerName = currentUser.displayName || 'Unknown User';
      const askerEmail = currentUser.email;
  
      set(newQuestionRef, {
        question,
        askerName,
        askerEmail,
        answer: null,
      })
      .then(() => {
        console.log('Question submitted successfully');
        e.target.reset();
      })
      .catch((error) => {
        console.error('Error submitting question:', error);
        setError('Error submitting question. Please try again later.');
      });
    } else {
      console.error('Missing required fields for question submission');
      setError('Please fill in all required fields.');
    }
  };

  const handleModuleComplete = (index) => {
    const updatedModules = [...modules];
    updatedModules[index].completed = true;
    setCourse((prevCourse) => ({
      ...prevCourse,
      modules: updatedModules,
    }));

    const completedModules = updatedModules.filter(module => module.completed).length;
    const totalModules = updatedModules.length;
    const newProgress = (completedModules / totalModules) * 100;


    const db = getDatabase();
    const progressRef = ref(db, `user/courses/${id}/progress/${currentUser.uid}`);
    set(progressRef, newProgress)
      .then(() => {
        console.log('Progress updated successfully');
      })
      .catch((error) => {
        console.error('Error updating progress:', error);
      });
  };

  const handleModuleChange = (index) => {
    setCurrentModuleIndex(index);
  };

  const handleNavigationWithEnrollmentCheck = (e, path) => {
    e.preventDefault();
    if (!isEnrolled) {
      navigate(`/enroll/${id}`);
    } else {
      navigate(path);
    }
  };

  if (!course) {
    return <div className="error">Course not found</div>;
  }

  const { title, ImgUrl, price, mediaUrl, description, modules, instructor } = course;
  const currentModule = modules && modules[currentModuleIndex];
  const totalModules = modules ? modules.length : 0;

  return (
    <div className="container py-5">
      <div className="row align-items-center mb-4">
        <div className="col-md-6 animate__animated animate__fadeInLeft">
          <img src={ImgUrl} alt={title} className="img-fluid rounded shadow" />
        </div>
        <div className="col-md-6 animate__animated animate__fadeInRight">
          <h1 className="display-6">{title}</h1>
          <p className="lead">Rating: {averageRating}</p>
          <p className='lead'>Total Modules: {totalModules}</p>
          <p className="h4">{price ? `$${price}` : 'Free'}</p>
          <div className="button-container mt-3">
            {!isEnrolled && (
              <Link
                to={`/enroll/${id}`}
                className="btn btn-primary enroll-button"
              >
                Enroll Now
              </Link>
            )}
            <button
              onClick={(e) => handleNavigationWithEnrollmentCheck(e, `/quiz/${id}`)}
              className="btn btn-primary enroll-button"
            >
              Quiz
            </button>
          </div>
         
        </div>
      </div>
      <div className="row mb-4">
  {/* Live Lectures Section */}
  <div className="col-md-6 live-lectures-section mt-2">
    <h3>Live Lectures</h3>
    {liveLectures.length > 0 ? (
      <ul className="list-group mt-3">
        {liveLectures.map((lecture, index) => (
          <li key={index} className="list-group-item">
            <p><strong>{lecture.title}</strong></p>
            <p><strong>{lecture.date} at {lecture.time}</strong></p>
            <p>Duration: {lecture.duration}</p>
            <p>{lecture.description}</p>
            <button
              onClick={(e) => handleNavigationWithEnrollmentCheck(e, lecture.youtubeLiveLink)}
              className="btn btn-link"
            >
              Join Live Lecture
            </button>
            {/* <p>Reminder: {lecture.reminder ? 'Yes' : 'No'}</p>
            <p>Recorded: {lecture.recorded ? 'Yes' : 'No'}</p> */}
          </li>
        ))}
      </ul>
    ) : (
      <p>No live lectures scheduled.</p>
    )}
  </div>

  {/* Video Player Section */}
  <div className="col-md-6 mt-2 animate__animated animate__fadeInUp">
    <VideoPlayer mediaUrl={mediaUrl} title={title} />
  </div>
</div>

      <div className="row">
        <div className="col-md-8 animate__animated animate__fadeInUp">
          <CourseDescription
            title={title}
            description={description}
            modules={modules}
            handleModuleChange={handleModuleChange}
            currentModuleIndex={currentModuleIndex}
            handleModuleComplete={handleModuleComplete}
          />
          <ModuleNavigation
            currentModule={currentModule}
            currentModuleIndex={currentModuleIndex}
            handleModuleChange={handleModuleChange}
            modules={modules}
          />
        </div>
        <div className="col-md-4 animate__animated animate__fadeInUp">
          <InstructorDetails instructor={instructor} />
          <Reviews
            reviews={reviews}
            handleReviewSubmit={handleReviewSubmit}
            rating={rating}
            setRating={setRating}
            hover={hover}
            setHover={setHover}
            userName={currentUser.displayName}
            userEmail={currentUser.email}
            courseId={id}
          />
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <div className="qa-section mt-5">
            <h3>Questions & Answers</h3>
            <form onSubmit={handleQuestionSubmit}>
              <div className="form-group">
                <label htmlFor="question">Ask the Instructor</label>
                <textarea className="form-control" id="question" rows="3"></textarea>
              </div>
              <br></br>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <div className="mt-4">
              {questions.map((q, index) => (
                <div key={index} className="question">
                  <p><strong>{q.askerName}</strong>: {q.question}</p>
                  <p><em>{q.answer ? `Instructor: ${q.answer}` : 'Awaiting response...'}</em></p>
                </div>
              ))}
            </div>
          </div>
          <div className="resource-section mt-5">
            <h3>Supplementary Resources</h3>
            {resources.length > 0 ? (
              <ul className="list-group mt-3">
                {resources.map((resource, index) => (
                  <li key={index} className="list-group-item">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No supplementary resources available.</p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
