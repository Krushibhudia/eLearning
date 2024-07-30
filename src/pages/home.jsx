import React, { Fragment, useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Element } from 'react-scroll';
import Courses from '../components/coursessection/courses';
import Feature from '../components/feature/feature';
import Herosection from '../components/herosection/herosection';
import Instruction from '../components/instruction/instruction';
import Instructor from '../components/instructor/instructor';
import AboutUs from './about/about';



const Home = () => {
  const [topRatedCourses, setTopRatedCourses] = useState([]);

  useEffect(() => {
    const fetchTopRatedCourses = async () => {
      try {
        const db = getDatabase();
        const coursesRef = ref(db, 'user/courses');

        onValue(coursesRef, (snapshot) => {
          const data = snapshot.val();
          console.log('Fetched courses data:', data); 

          if (data) {
            const coursesArray = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            }));
            console.log('Courses array:', coursesArray); 

            const sortedCourses = coursesArray.sort((a, b) => b.rating - a.rating);
            console.log('Sorted courses:', sortedCourses); 

            // Limit to top 3 courses
            const top3Courses = sortedCourses.slice(0, 3);
            console.log('Top 3 courses:', top3Courses); 

            setTopRatedCourses(top3Courses);
          }
        });
      } catch (error) {
        console.error('Error fetching top-rated courses:', error);
      }
    };

    fetchTopRatedCourses();
  }, []);

  return (
    <Fragment>
      <Element name="home">
        <Herosection />
      </Element>
      <Element name="about" >
        <AboutUs />
      </Element>
      <Element name="courses">
        <Courses courses={topRatedCourses} limit={3} showSearchBar={false} />
      </Element>
      <Element name="features">
        <Feature />
      </Element>
      <Element name="instructors">
        <Instructor />
      </Element>
      <Element name="instructions">
        <Instruction />
      </Element>
    </Fragment>
  );
};

export default Home;
