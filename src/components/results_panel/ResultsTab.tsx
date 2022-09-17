import React, { memo, useEffect, useMemo, useState } from 'react';
import ReactFlow, { ConnectionLineType, EdgeTypesType, NodeTypesType, OnLoadFunc, OnLoadParams, ReactFlowProvider } from 'react-flow-renderer';
// import Plot from 'react-plotly.js';
import { useWindowSize } from 'react-use';
import { useFlowChartState } from '../../hooks/useFlowChartState';
import CustomEdge from '../flow_chart_panel/CustomEdge';
// import styledPlotLayout from './../defaultPlotLayout';
import CustomResultNode from './CustomResultNode';
import { nodePosition } from './NODE_POSITION';

import './Results.css';

const edgeTypes: EdgeTypesType = { default: CustomEdge as any };
const nodeTypes: NodeTypesType = { default: CustomResultNode as any };

const ResultsTab = ({ results, theme }) => {
  const {width:windowWidth}= useWindowSize()
  const {rfInstance}= useFlowChartState()
  const [resultElements, setResultElements] = useState<any[]>([])
  const nodeResults = useMemo(()=> ('io' in results) 
    ? JSON.parse(results.io).reverse()
    : [],[results])

  // const styledLayout = styledPlotLayout(theme);
  const ReactFlowProviderAny: any = ReactFlowProvider;
  const onLoad: OnLoadFunc = (rfIns: OnLoadParams) => {
    rfIns.fitView();
    const flowSize = 1271;
    const xPosition =windowWidth > flowSize ? (windowWidth - flowSize) / 2 : 0;
    rfIns.setTransform({
      x: xPosition,
      y: 52,
      zoom: 0.7
    })
    // setResultElements(rfIns.toObject())
  };
useEffect(()=>{
  if(nodeResults && nodeResults.length > 0 && rfInstance){
    setResultElements(
      rfInstance?.elements.map(elem=> ({
        ...elem,
        position: nodePosition[elem?.data?.func],
        data:{
          ...elem.data,
          ...(!('source' in elem) && { resultData: nodeResults?.find(result=> result.id === elem.id)?.result})
        }
       
      }))
    )
  }
},[nodeResults])
  return (
    <ReactFlowProviderAny>
    <div style={{ height: `99vh` }}>
      <ReactFlow
        elements={resultElements}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.Step}
        onLoad={onLoad}
      ></ReactFlow>
    </div>
    </ReactFlowProviderAny>
    // <div className='App-results-panel'>
    //   <p>
    //     {nodeResults.length === 0 ? 'No run results yet.' : ''}
    //   </p>     
    //   {nodeResults.map((nd, k) => (
    //     <details key={k} open={ k===0 ? true : false }>
    //       <summary>{nd.cmd}</summary>
    //       {nd.result !== null ?
    //           <Plot
    //             data = {'data' in nd.result 
    //               ? nd.result.data 
    //               : [{'x': nd.result['x0'], 'y': nd.result['y0'] }]}
    //             layout = {'layout' in nd.result 
    //               ? Object.assign({}, nd.result.layout, styledLayout)
    //               : Object.assign({}, {title: `${nd.cmd}`}, styledLayout)}
    //             useResizeHandler />
    //       : `⚠️ The server returned null for the ${nd.cmd} node`}
    //     </details>
    //   ))}
    // </div>
  );
};

export default memo(ResultsTab);