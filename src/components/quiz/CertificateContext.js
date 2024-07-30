import React from 'react';
import ReactDOM from 'react-dom';
import CertificateContainer from './CertificateContainer';

const App = () => {
  const name = "John Doe";
  const course = "React Development";

  return (
    <div>
      <CertificateContainer name={name} course={course} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
