import React from 'react';

const ResultsTab = ({ programResults }) => {
  return (
    <div>
      <p>{programResults.status}</p>
    </div>
  );
};

export default ResultsTab;