import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';
import { getDatabase, ref, get, set } from 'firebase/database';
import { CSSTransition } from 'react-transition-group';
import { PDFDownloadLink } from '@react-pdf/renderer';
import CertificateTemplate from './certificate'; // Import certificate template
import './quiz.css';
import { useParams } from 'react-router-dom';
import { useAuth } from '../authprovider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheckCircle, faTimesCircle, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { db } from '../../firebase'; // Adjust the import based on your file structure
import { doc, updateDoc, arrayUnion,getDoc } from 'firebase/firestore';

const QuizPage = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [quizData, setQuizData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [showCertificate, setShowCertificate] = useState(false);
    const [userName] = useState(currentUser.displayName || "Unknown User");
    const [courseName, setCourseName] = useState("");
    const [timeLeft, setTimeLeft] = useState(null);
    const [showInstruction, setShowInstruction] = useState(true);
    const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
    const [quizId, setQuizId] = useState(null);
    const quizDuration = 20; 

    useEffect(() => {
        const fetchData = async () => {
            const db = getDatabase();
            const courseRef = ref(db, `user/courses/${id}`);

            try {
                const courseSnapshot = await get(courseRef);
                console.log("Course Snapshot:", courseSnapshot.val()); 
                
                if (courseSnapshot.exists()) {
                    const courseData = courseSnapshot.val();
                    const fetchedQuizId = Object.keys(courseData.quizzes)[0]; 
                    console.log("Quiz ID:", fetchedQuizId);
                    
                    const quizData = courseData.quizzes[fetchedQuizId];
                    console.log("Quiz Data:", quizData);

                    setQuizData(quizData);
                    setCourseName(quizData.courseName); 
                    setQuizId(fetchedQuizId);

                    const userQuizRef = ref(db, `users/${currentUser.uid}/completedQuizzes/${fetchedQuizId}`);
                    const userQuizSnapshot = await get(userQuizRef);
                    if (userQuizSnapshot.exists()) {
                        setHasCompletedQuiz(true);
                    }
                } else {
                    console.log(`No course found for ID ${id}`);
                    setQuizData(null);
                }
            } catch (error) {
                console.error('Error fetching quiz data:', error);
            }
        };

        fetchData();
    }, [id, currentUser.uid]);

    useEffect(() => {
        if (!showInstruction && quizData && !hasCompletedQuiz) {
            setTimeLeft(quizDuration * 60 * 1000);

            const interval = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 0) {
                        clearInterval(interval);
                        handleSubmitQuiz();
                        return 0;
                    }
                    return prevTime - 1000;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [showInstruction, quizData, hasCompletedQuiz]);

    const handleAnswerSelect = (questionId, optionId) => {
        setAnswers({
            ...answers,
            [questionId]: optionId
        });
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
    };

    const handleSubmitQuiz = async () => {
        const correct = quizData.questions.reduce((acc, question) => {
            const userAnswer = answers[question.id];
            if (userAnswer === question.correctAnswer) {
                return acc + 1;
            }
            return acc;
        }, 0);

        setCorrectAnswers(correct);
        setShowResults(true);

        const db = getDatabase();
        const userQuizRef = ref(db, `users/${currentUser.uid}/completedQuizzes/${quizId}`);
        try {
            await set(userQuizRef, {
                quizId,
                completed: true,
                correctAnswers: correct,
                totalQuestions: quizData.questions.length,
                courseTitle: courseName
            });

            await updateQuizCompletion(currentUser.uid, quizId, courseName);
        } catch (error) {
            console.error('Error updating quiz status:', error);
        }
    };

    const updateQuizCompletion = async (userId, quizId, courseTitle) => {
        try {
            const userDocRef = doc(db, 'Users', userId);
            const userDocSnapshot = await getDoc(userDocRef);
            const completedQuizzes = userDocSnapshot.data().completedQuizzes || [];
    
            const quizIndex = completedQuizzes.findIndex(quiz => quiz.quizId === quizId);
            if (quizIndex === -1) {
                // Update the user document with quiz completion data
                await updateDoc(userDocRef, {
                    completedQuizzes: arrayUnion({ quizId, completed: true, courseTitle, completionDate: new Date() }),
                });
            
            console.log('Quiz completion status updated successfully');
               } else {
            console.log('Quiz already completed by user');
        }
        } catch (error) {
            console.error('Error updating quiz completion status:', error);
        }
    };

    const generateCertificate = () => {
        setShowCertificate(true);
    };

    if (hasCompletedQuiz) {
        return (
            <Container className="py-5">
                <Card className="shadow-sm border-1 text-center">
                    <Card.Body>
                        <FontAwesomeIcon icon={faCheckCircle} size="5x" className="text-success mb-3" />
                        <h3>You have already completed this quiz. Thank you!</h3>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    if (!quizData) {
        return (
            <Container className="py-5">
                <Card className="shadow-sm border-1 text-center">
                    <Card.Body>
                        <FontAwesomeIcon icon={faTimesCircle} size="5x" className="text-danger mb-3" />
                        <h3>No quiz found for this ID.</h3>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const minutes = Math.floor(timeLeft / (60 * 1000));
    const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

    return (
        <Container className="py-5">
            <Card className="shadow-sm border-1">
                <Card.Body className='card-body-custom'>
                    {showInstruction ? (
                        <div className="text-left">
                            <h2>Quiz Instructions</h2>
                            <Alert variant="info">
                                <FontAwesomeIcon icon={faClock} className="me-2" />
                                <strong>Time limit:</strong> You have 20 minutes to complete the quiz from the moment you start it. If you do not finish in time, the quiz will be automatically submitted.
                            </Alert>
                            <Alert variant="info">
                                <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                <strong>Question Format:</strong> The quiz consists of multiple-choice questions.
                            </Alert>
                            <Alert variant="info">
                                <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                <strong>Scoring:</strong> Each correct answer is worth 1 point. There are no penalties for incorrect answers.
                            </Alert>
                            <Alert variant="info">
                                <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                Use the "Next" and "Previous" buttons to move between questions. You can revisit and change your answers before submitting the quiz.
                            </Alert>
                            <Alert variant="info">
                                <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                Click the "Submit" button when you have answered all questions.
                            </Alert>
                            <Alert variant="info">
                                <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                Your results will be displayed immediately after submission.
                            </Alert>
                            <Button onClick={() => setShowInstruction(false)} variant="primary">
                                <FontAwesomeIcon icon={faPlayCircle} className="me-2" />
                                Start Quiz
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-center mb-4">{courseName}</h3>
                            <CSSTransition
                                in={!showResults && !showCertificate}
                                timeout={300}
                                classNames="question"
                                unmountOnExit
                            >
                                <div>
                                    <Card.Title className="text-center">{currentQuestion.question}</Card.Title>
                                    {currentQuestion.image && (
                                        <div className="text-center mb-3">
                                            <img src={currentQuestion.image} alt="Question" className="img-fluid mb-2" />
                                        </div>
                                    )}
                                    <Form>
                                        {currentQuestion.options.map(option => (
                                            <Form.Check
                                                key={option.id}
                                                type="radio"
                                                id={option.id}
                                                label={option.text}
                                                name={`question${currentQuestion.id}`}
                                                value={option.id}
                                                checked={answers[currentQuestion.id] === option.id}
                                                onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                                                className="mb-2"
                                            />
                                        ))}
                                    </Form>
                                    <div className="d-flex justify-content-center mt-3">
                                        <div className="d-flex justify-content-between" style={{ width: '300px' }}>
                                            {currentQuestionIndex > 0 && (
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={handlePreviousQuestion}
                                                    style={{
                                                        backgroundColor: '#17bf9e',
                                                        borderColor: '#17bf9e',
                                                        color: '#fff'
                                                    }}
                                                >
                                                    Previous
                                                </Button>
                                            )}
                                            {currentQuestionIndex < quizData.questions.length - 1 && (
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={handleNextQuestion}
                                                    style={{
                                                        backgroundColor: '#17bf9e',
                                                        borderColor: '#17bf9e',
                                                        color: '#fff'
                                                    }}
                                                >
                                                    Next
                                                </Button>
                                            )}
                                            {currentQuestionIndex === quizData.questions.length - 1 && (
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={handleSubmitQuiz}
                                                    style={{
                                                        backgroundColor: '#17bf9e',
                                                        borderColor: '#17bf9e',
                                                        color: '#fff'
                                                    }}
                                                >
                                                    Submit
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    {timeLeft !== null && (
                                        <div className="text-center mt-3">
                                            <h5>Time Left: {minutes} : {seconds < 10 ? `0${seconds}` : seconds}</h5>
                                        </div>
                                    )}
                                </div>
                            </CSSTransition>
                            <CSSTransition
                                in={showResults}
                                timeout={300}
                                classNames="result"
                                unmountOnExit
                            >
                                <div className="text-center">
                                    <h2>Quiz Results</h2>
                                    <Alert variant={correctAnswers === quizData.questions.length ? 'success' : 'danger'}>
                                        <Alert.Heading>
                                            {correctAnswers === quizData.questions.length ? 'Congratulations!' : 'Tried well!'}
                                        </Alert.Heading>
                                        <p>
                                            You {correctAnswers === quizData.questions.length ? 'successfully' : 'successfully'} completed the quiz.
                                        </p>
                                        <p>
                                            {correctAnswers} out of {quizData.questions.length} questions answered correctly.
                                        </p>
                                        <Button onClick={generateCertificate} variant="primary" className="mt-3">
                                            Generate Certificate
                                        </Button>
                                    </Alert>
                                </div>
                            </CSSTransition>
                            <CSSTransition
                                in={showCertificate}
                                timeout={300}
                                classNames="certificate"
                                unmountOnExit
                            >
                                <div className="text-center">
                                    <p>Please download your Certificate.</p>
                                    <PDFDownloadLink document={<CertificateTemplate userName={userName} courseName={courseName} />} fileName="certificate.pdf">
                                        {({ blob, url, loading, error }) => (loading ? 'Loading certificate...' : 'Download Certificate')}
                                    </PDFDownloadLink>
                                </div>
                            </CSSTransition>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default QuizPage;
