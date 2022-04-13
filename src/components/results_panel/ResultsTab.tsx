import React, { memo } from 'react';
import Plot from 'react-plotly.js';

import './Results.css';

const ResultsTab = ({ results, theme }) => {

  let nodeResults = ('io' in results) 
    ? JSON.parse(results.io).reverse().slice(0,5) 
    : [];

  let plotFeatureColor = (theme === 'light' ? '#282c34' : '#fff');
  let plotBackgroundColor  = (theme === 'light' ? '#fff' : '#282c34');

  let dfltLayout = {
    paper_bgcolor: 'rgba(0,0,0,0)', 
    plot_bgcolor: plotBackgroundColor,
    autosize: true, 
    font: {color: plotFeatureColor},
    margin: {t: 40, r: 20, b: 40, l: 10},
    xaxis: {zeroline: false, color: plotFeatureColor},
    yaxis: {zeroline: false, color: plotFeatureColor}
  };

  return (
    <div className='App-results-panel'>
      <h1>Job results</h1>
      {nodeResults.map((nd, k) => (
        <details key={k} open={ k===0 ? true : false }>
          <summary>{nd.cmd}</summary>
          {('data' in nd.result && 'layout' in nd.result) &&
            <Plot
              data = {nd.result.data} 
              layout = {Object.assign({}, nd.result.layout, dfltLayout)}
              useResizeHandler />}
          {('x0' in nd.result && 'x0' in nd.result) &&
            <Plot
              data = {[{'x': nd.result['x0'], 'y': nd.result['y0'] }]} 
              layout = {Object.assign({}, {title: nd.cmd}, dfltLayout)}
              useResizeHandler />}
        </details>
      ))}
    </div>
  );
};

export default memo(ResultsTab);