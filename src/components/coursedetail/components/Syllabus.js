import React, { useState } from 'react';
import DOMPurify from 'dompurify';

const Syllabus = ({ modules }) => {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(null);

  const createMarkup = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  const handleModuleClick = (index) => {
    setCurrentModuleIndex(index);
  };

  return (
    <div>
      <h2>Syllabus</h2>
      <hr />
      <ul className="list-group list-group-flush">
        {Array.isArray(modules) ? modules.map((module, index) => (
          <li key={index} className="list-group-item">
            <h5 onClick={() => handleModuleClick(index)} style={{ cursor: 'pointer' }}>
              {module.title}
            </h5>
            {currentModuleIndex === index && (
              <p dangerouslySetInnerHTML={createMarkup(module.content)}></p>
            )}
          </li>
        )) : <p>No modules available.</p>}
      </ul>
    </div>
  );
};

export default Syllabus;
