import React from 'react';
import DOMPurify from 'dompurify';

const ModuleNavigation = ({ currentModule, currentModuleIndex, handleModuleChange, modules }) => {
  const createMarkup = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  return (
    <div className="row mt-4">
      <div className="col-md-12 animate__animated animate__fadeInUp">
        <div className="bg-light p-4 rounded shadow">
          <h2>{currentModule ? currentModule.title : 'No Module Selected'}</h2>
          {currentModule && (
            <div>
              <div dangerouslySetInnerHTML={createMarkup(currentModule.description)}></div>

              <div className="d-flex justify-content-between gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() => handleModuleChange(currentModuleIndex - 1)}
                  disabled={currentModuleIndex === 0}
                >
                  Previous Module
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleModuleChange(currentModuleIndex + 1)}
                  disabled={currentModuleIndex === modules.length - 1}
                >
                  Next Module
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleNavigation;
