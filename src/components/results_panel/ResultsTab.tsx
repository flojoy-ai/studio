import React, { memo } from 'react';
import Plot from 'react-plotly.js';

import './Results.css';

const ResultsTab = ({ results, theme }) => {

  const nodeResults = ('io' in results) 
    ? JSON.parse(results.io).reverse()
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
      <p>
        {nodeResults.length === 0 ? 'No run results yet.' : ''}
      </p>     
      {nodeResults.map((nd, k) => (
        <details key={k} open={ k===0 ? true : false }>
          <summary>{nd.cmd}</summary>
          {nd.result !== null ?
              <Plot
                data = {'data' in nd.result 
                  ? nd.result.data 
                  : [{'x': nd.result['x0'], 'y': nd.result['y0'] }]}
                layout = {'layout' in nd.result 
                  ? Object.assign({}, nd.result.layout, dfltLayout)
                  : Object.assign({}, {title: `${nd.cmd}`}, dfltLayout)}
                useResizeHandler />
          : `⚠️ The server returned null for the ${nd.cmd} node`}
        </details>
      ))}
    </div>
  );
};

export default memo(ResultsTab);