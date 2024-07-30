import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function completeQuiz(userId, quizId, courseId, quizTitle, completionDate, userData) {
  try {
    const courseRef = doc(db, 'Courses', courseId);
    const courseSnap = await getDoc(courseRef);

    if (courseSnap.exists()) {
      const courseData = courseSnap.data();
      const courseTitle = courseData.title || 'Unknown Course';

      const userRef = doc(db, 'Users', userId);

      await updateDoc(userRef, {
        completedQuizzes: [
          ...userData.completedQuizzes,
          {
            quizId,
            courseId,
            quizTitle,
            courseTitle,
            completed: true,
            completionDate,
          },
        ],
      });

      console.log('Quiz marked as completed successfully');
    } else {
      console.error('Course not found');
    }
  } catch (error) {
    console.error('Error completing quiz:', error);
  }
}
<div className="mt-4">
  <h5 className="mb-3">Completed Quizzes:</h5>
  {completedQuizzes.length > 0 ? (
    <ul className="list-group">
      {completedQuizzes.map((quiz, index) => (
        <li key={index} className="list-group-item">
          <div><strong>Course Title:</strong> {quiz.courseTitle}</div>
          <div><strong>Quiz Title:</strong> {quiz.quizTitle}</div>
          <div><strong>Status:</strong> {quiz.completed ? 'Completed' : 'Not Completed'}</div>
          <div><strong>Date:</strong> {quiz.completionDate?.toDate().toLocaleDateString() || 'N/A'}</div>
        </li>
      ))}
    </ul>
  ) : (
    <p>No completed quizzes.</p>
  )}
</div>
