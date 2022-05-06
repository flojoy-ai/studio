import React, {useState} from 'react';
import Plot from 'react-plotly.js';
import Select from 'react-select'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import localforage from 'localforage';

import styledPlotLayout from './../defaultPlotLayout';
import customDropdownStyles from './customDropdownStyles.tsx';

import {FUNCTION_PARAMETERS} from './../flow_chart_panel/PARAMETERS_MANIFEST'

localforage.config({name: 'react-flow', storeName: 'flows'});

const flowKey = 'flow-joy';

const ControlComponent = ({ ctrlObj, theme, results, updateCtrlValue, attachParam2Ctrl }) => {
    const [flowChartObject, setFlowChartObject] = useState({});

    const styledLayout = styledPlotLayout(theme);

    if(Object.keys(flowChartObject).length === 0) {
      localforage.getItem(flowKey)
          .then(val => {
            // console.log('Retrieved flow chart from local storage', val);           
            setFlowChartObject(val);})
          .catch(err => {console.warn(err);});
    }

    let options = [];

    if (ctrlObj.type === 'input') {
      Object.keys(FUNCTION_PARAMETERS).map(functionName => {
          let params = FUNCTION_PARAMETERS[functionName];
          const sep = ' ▶ ';

          Object.keys(params).map(param => {
              options.push({
                  label: functionName + sep + param.toUpperCase(),
                  value: functionName + '_' + param      
              });
          })
      });
    } else if (ctrlObj.type === 'output') {
      // console.log('output', flowChartObject);
      if(flowChartObject.elements !== undefined) {
        flowChartObject.elements.map(node => {
          if ('source' in node === false) { // Object is a node, not an edge
            let label = 'Visualize node: ' + node.data.label + ' (#' + node.id.slice(-5) + ')';
            options.push({label: label, value: node.id});
          }
        });
      }
    }

    console.warn('RESULTS', results);

    let plotData = [{x: [1,2,3], y:[1,2,3]}];
    let nd = {};

    if (ctrlObj.name == 'PLOT' ) {
      // figure out what we're visualizing
      let nodeIdToPlot = ctrlObj.param;
      if (nodeIdToPlot !== null) {        
        if ('io' in results) {
          const runResults = JSON.parse(results.io);
          const filteredResult = runResults.filter(node => (node.id === nodeIdToPlot))[0];
          nd = filteredResult == undefined ? {} : filteredResult;
          if(Object.keys(nd).length > 0) {
            plotData = 'data' in nd.result 
              ? nd.result.data 
              : [{'x': nd.result['x0'], 'y': nd.result['y0'] }];
          }
        }
      }
    }

    console.log('NNNN DEEEE', nd);

    return (
        <div>
            <Select 
                className = 'select-node'
                isSearchable = {true}
                onChange = {val => {attachParam2Ctrl(val.value, ctrlObj)}}
                options = {options}
                styles={customDropdownStyles}
                theme={theme}
            />

            {ctrlObj.name == 'Plot' && (
                <div>
                    <Plot
                        data = {plotData}
                        layout = {styledLayout}
                        autosize = {true}
                        style = {{width: '100%', height: '100%'}}
                    />                    
                </div>
            )}

            {ctrlObj.name == 'Numeric Input' && (
                <div style={{margin: '30px 0'}}>
                    <input 
                        type='number'
                        placeholder='Enter a number'
                        className='ctrl-numeric-input'
                        onChange = {e => {updateCtrlValue(e.target.value, ctrlObj)}}
                    />
                </div>
            )}

            {ctrlObj.name == 'Slider' && (
                <div style={{margin: '40px 10px'}}>
                  <Slider 
                    onChange = {val => {updateCtrlValue(val, ctrlObj)}}
                  />
                  <label>{ctrlObj.val ? ctrlObj.val : null}</label>
                </div>
            )}              

            <details className='ctrl-meta'>           
            {`Name: ${ctrlObj.name}`}
            <br></br>
            {`ID: ${ctrlObj.id}`}
            </details>  
        </div>
    );
};

export default ControlComponent;
