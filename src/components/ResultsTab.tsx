import React from 'react';
import Plot from 'react-plotly.js';

import './Results.css';

const ResultsTab = ({ results }) => {

  let nodeResults = ('io' in results) ? JSON.parse(results.io).reverse() : [];

  return (
    <div className='Results'>
      <p>{results.status}</p>
      {nodeResults.map((nd, k) => (
        <details key={k}>
          <summary>{nd.cmd}</summary>
          {('data' in nd.result && 'layout' in nd.result) &&
            <Plot data = {nd.result.data} layout = {nd.result.layout}/>}
          {('x0' in nd.result && 'x0' in nd.result) &&
            <Plot data = {[{'x': nd.result['x0'], 'y': nd.result['y0'] }]}/>}
        </details>
      ))}
    </div>
  );
};

export default ResultsTab;