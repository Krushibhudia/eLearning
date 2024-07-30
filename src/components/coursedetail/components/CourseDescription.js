import React from 'react';
import DOMPurify from 'dompurify';

const CourseDescription = ({ title, description, modules, handleModuleChange, currentModuleIndex }) => {
  const createMarkup = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  return (
    <div>
      <h2>{title}</h2>
      <p dangerouslySetInnerHTML={createMarkup(description)}></p>
      <h3>Modules</h3>
      <ul className="list-group list-group-flush">
        {Array.isArray(modules) ? modules.map((module, index) => (
          <li key={index} className="list-group-item">
            <h5 onClick={() => handleModuleChange(index)} style={{ cursor: 'pointer' }}>
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

export default CourseDescription;
