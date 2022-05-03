import React, { memo } from 'react';
import Plot from 'react-plotly.js';
import styledPlotLayout from './../defaultPlotLayout';

import './Results.css';

const ResultsTab = ({ results, theme }) => {

  const nodeResults = ('io' in results) 
    ? JSON.parse(results.io).reverse()
    : [];

  const styledLayout = styledPlotLayout(theme);

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
                  ? Object.assign({}, nd.result.layout, styledLayout)
                  : Object.assign({}, {title: `${nd.cmd}`}, styledLayout)}
                useResizeHandler />
          : `⚠️ The server returned null for the ${nd.cmd} node`}
        </details>
      ))}
    </div>
  );
};

export default memo(ResultsTab);