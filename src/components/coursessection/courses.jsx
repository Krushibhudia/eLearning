import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardImg, CardBody, CardTitle, CardText, Button, Form, FormControl } from 'react-bootstrap';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Link, useNavigate } from 'react-router-dom';
import './course.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';

const Courses = ({ limit, showSearchBar }) => {
  const [courseData, setCourseData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [averageRatings, setAverageRatings] = useState({});
  const [enrolledStudents, setEnrolledStudents] = useState({}); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      const db = getDatabase();
      const coursesRef = ref(db, 'user/courses');
      onValue(coursesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedData = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setCourseData(formattedData);

          const ratingsPromises = formattedData.map(course => fetchAverageRating(course.id));
          Promise.all(ratingsPromises).then(ratings => {
            const ratingsMap = {};
            ratings.forEach((rating, index) => {
              ratingsMap[formattedData[index].id] = rating;
            });
            setAverageRatings(ratingsMap);
          }).catch(error => {
            console.error('Error fetching average ratings:', error);
          });

          const enrolledPromises = formattedData.map(course => fetchEnrolledStudents(course.id));
          Promise.all(enrolledPromises).then(enrolledCounts => {
            const enrolledMap = {};
            enrolledCounts.forEach((count, index) => {
              enrolledMap[formattedData[index].id] = count;
            });
            setEnrolledStudents(enrolledMap);
          }).catch(error => {
            console.error('Error fetching enrolled students:', error);
          });

        } else {
          setCourseData([]);
        }
      }, (error) => {
        console.error('Error fetching data:', error);
      });
    };

    fetchData();
  }, []);

  const fetchAverageRating = async (courseId) => {
    const db = getDatabase();
    const reviewsRef = ref(db, `user/courses/${courseId}/reviews`);
    return new Promise((resolve, reject) => {
      onValue(reviewsRef, (snapshot) => {
        const reviewsData = snapshot.val();
        if (reviewsData) {
          const reviewsArray = Object.values(reviewsData);
          const totalRating = reviewsArray.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = totalRating / reviewsArray.length;
          resolve(avgRating.toFixed(1));
        } else {
          resolve(0);
        }
      }, (error) => {
        reject(error);
      });
    });
  };

  const fetchEnrolledStudents = async (courseId) => {
    const db = getDatabase();
    const courseRef = ref(db, `user/courses/${courseId}/enrolled_users`);
    return new Promise((resolve, reject) => {
      onValue(courseRef, (snapshot) => {
        const enrolledData = snapshot.val();
        if (enrolledData) {
          const count = Object.keys(enrolledData).length;
          resolve(count);
        } else {
          resolve(0); 
        }
      }, (error) => {
        reject(error);
      });
    });
  };

  const limitedCourses = limit ? courseData.slice(0, limit) : courseData;

  // Filter courses based on search query
  const filteredCourses = limitedCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleShowAllCourses = () => {
    navigate('/courses');
    console.log("Show all courses");
  };

  return (
    <section className="py-5">
      <Container>
        <h2 className="text-center mb-4">Our Popular Courses</h2>
        <div className="text-center mb-4">
          <FontAwesomeIcon icon={faBookOpen} className="book-icon" style={{ color: '#17bf9e' }} />
        </div>
        {showSearchBar ? (
          <Form className="mb-4">
            <Row className="align-items-center">
              <Col xs={12} md={6}>
                <FormControl
                  type="text"
                  placeholder="Search for courses"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </Col>
            </Row>
          </Form>
        ) : (
          <div className="text-end mb-4">
            <Button variant="outline" className="show-all-courses-btn" onClick={handleShowAllCourses}>
              Show All Courses
            </Button>
          </div>
        )}
        <Row xs="1" md="2" lg="3" className="g-4">
          {filteredCourses.map((item) => (
            <Col key={item.id}>
              <Link to={`/course/${item.id}`} className="text-decoration-none">
                <Card className="h-100 border-0 shadow-sm animate__animated animate__fadeIn">
                  <CardImg top width="100%" src={item.ImgUrl} alt={item.title} className="rounded-top" />
                  <CardBody>
                    <CardTitle tag="h4" className="mb-2">
                      {truncateTitle(item.title, 26)}
                    </CardTitle>
                    <CardText className="mb-2 m-lg-2">
                      {item.modules ? `${item.modules.length} Modules | ` : ''}
                      {enrolledStudents[item.id]} Students | {averageRatings[item.id]} Average Rating
                    </CardText>
                    <div className="d-flex justify-content-center">
                      <Button variant="primary">
                        <Link to={`/course/${item.id}`} className="text-decoration-none text-light">
                          Read More
                        </Link>
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

const truncateTitle = (title, maxLength) => {
  if (title.length <= maxLength) {
    return title;
  }
  const truncated = title.slice(0, maxLength - 3) + '...';
  return truncated;
};

export default Courses;
