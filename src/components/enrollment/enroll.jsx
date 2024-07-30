import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getDatabase, ref, update, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from "../../firebase";
import './enroll.css';

const EnrollmentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [course, setCourse] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [courseData, setCourseData] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);

                const fetchUserData = async () => {
                    try {
                        const docRef = doc(db, "Users", user.uid);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            const userData = docSnap.data();
                            setName(userData.fullname);
                            setEmail(userData.email);
                        } else {
                            console.log("No such document!");
                        }
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                    }
                };
                fetchUserData();
            } else {
                setUserId(null);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const fetchCourse = () => {
            const db = getDatabase();
            const courseRef = ref(db, `user/courses/${id}`);
            onValue(courseRef, (snapshot) => {
                const data = snapshot.val();
                setCourseData(data);
            }, (error) => {
                console.error('Error fetching course:', error);
            });
        };

        fetchCourse();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !course) {
            alert('Please fill out all required fields.');
            return;
        }

        const emailPattern = /^\S+@\S+\.\S+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        try {
            const database = getDatabase();
            const courseRef = ref(database, `user/courses/${id}/enrolled_users`);

            await update(courseRef, {
                [userId]: true
            });

            const userDocRef = doc(db, "Users", userId);
            await updateDoc(userDocRef, {
                enrolledCourses: arrayUnion({ courseId: id, title: courseData.title })
            });

            setSubmitted(true);
            setTimeout(() => {
                navigate(`/course/${id}`);
            }, 2000);
        } catch (error) {
            console.error('Error enrolling user:', error);
            alert(`Error enrolling user: ${error.message}`);
        }
    };

    return (
        <Container className="mt-5 mb-5">
<Card className={`enrollment-card ${submitted ? 'fade-out' : 'fade-in'}`} style={{ padding: '20px' }}>
<Card.Header className="text-center">
                    <h2>Course Enrollment</h2>
                </Card.Header>
                <Card.Body>
                    {submitted ? (
                        <Alert variant="success">
                            Enrollment successful! Thank you, {name}.
                        </Alert>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter your name" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                            </Form.Group>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </Form.Group>
                            {courseData && (
                                <Form.Group controlId="formCourse">
                                    <Form.Label>Course</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        value={course} 
                                        onChange={(e) => setCourse(e.target.value)} 
                                        required 
                                    >
                                        <option value="">Select a course</option>
                                        <option value={courseData.title}>{courseData.title}</option>
                                    </Form.Control>
                                </Form.Group>
                            )}
                            <div className="text-center">
                                <Button variant="primary" type="submit" className="mt-3">
                                    Enroll
                                </Button>
                            </div>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EnrollmentForm;
