import React from 'react';
import { motion } from 'framer-motion';
import "./loading.css";
<loading></loading>
const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const loadingCircleVariants = {
  start: {
    y: '0%',
  },
  end: {
    y: '100%',
  },
};

const loadingCircleTransition = {
  duration: 0.5,
  repeat: Infinity,
  repeatType: 'reverse',
  ease: 'easeInOut',
};

const Loading = () => {
  return (
    <div className="loading-container">
      <motion.div
        className="loading-circle"
        variants={loadingContainerVariants}
        initial="start"
        animate="end"
      >
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="loading-circle"
            variants={loadingCircleVariants}
            transition={loadingCircleTransition}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Loading;
