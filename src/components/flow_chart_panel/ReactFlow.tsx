import React, { useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  removeElements,
  addEdge,
  Elements,
  EdgeTypesType,
  Connection,
  ConnectionLineType,
  Edge,
  OnLoadParams,
} from 'react-flow-renderer';

import CustomEdge from './CustomEdge.tsx';
import CustomNode from './CustomNode.tsx';
import Controls from './ControlBar.tsx';

import Modal from 'react-modal';

import {NOISY_SINE} from './RECIPES.js'
import STATUS_CODES from './../../STATUS_CODES.json';
import PYTHON_FUNCTIONS from './pythonFunctions.json';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco,  srcery} from 'react-syntax-highlighter/dist/esm/styles/hljs';

const initialElements: Elements = NOISY_SINE.elements;

const edgeTypes: EdgeTypesType = {default: CustomEdge};
const nodeTypes: NodeTypesType = {default: CustomNode};


const FlowChart = ({ results, theme }) => {
  
  const [rfInstance, setRfInstance] = useState<OnLoadParams>();
  const [elements, setElements] = useState<Elements>(initialElements);
  const [clickedElement, setClickedElement] = useState(null);

  const [modalIsOpen, setIsModalOpen] = useState(false);

  const modalStyles = {
      overlay: {zIndex: 99},
      content: {zIndex: 100}
    };
  
  const openModal = () => { setIsModalOpen(true); }
  const afterOpenModal = () => {}
  const closeModal = () => { setIsModalOpen(false); }


  const onClickElement = (evt, elem) => {
    console.log('evt & element from click event', evt, elem);
    setClickedElement(elem);
    openModal();
  }

  const plotNodeResult = () => {

    const nid = clickedElement.id;

    return(
      <label>hello</label>
    );
  }
  
  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));

  const nodeLabel = clickedElement === null ? undefined : clickedElement.data.label;
  const nodeType = clickedElement === null ? undefined : clickedElement.data.type;

  const pythonString = (nodeLabel === undefined || nodeType === undefined)
    ? '...'
    : PYTHON_FUNCTIONS[nodeType][nodeLabel+'.py'];

  return (
    <ReactFlowProvider>
      <Controls 
        rfInstance={rfInstance} 
        setElements={setElements} 
        clickedElement={clickedElement}
        onElementsRemove={onElementsRemove}
      >
      </Controls>  
      <div style={{ height: `100vh` }}>
        <ReactFlow           
          elements={elements} 
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          onElementsRemove={onElementsRemove} 
          onConnect={onConnect} 
          onLoad={setRfInstance}
          onElementClick={(evt, elem) => onClickElement(evt, elem)}  
        >
        </ReactFlow>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={modalStyles}
        ariaHideApp={false}
        contentLabel=''
      >               
        <button onClick={closeModal} className='ctrl-close-btn'>x</button>

        <h1>{nodeLabel}</h1>

        <h4>
          Node type: <code>{nodeType}</code>
        </h4>

        {results.status === STATUS_CODES.NO_RUNS_YET
          ? <p><code>{nodeLabel}</code> not run yet - click <i>Run Script</i>.</p>
          : (<div>
              <p>hello</p>
            </div>)
        }

        <h3>Python code</h3>
        <SyntaxHighlighter language="python" style={theme === 'dark' ? srcery : docco}>
          {pythonString}
        </SyntaxHighlighter>

        <h3>Node data</h3>
        <SyntaxHighlighter language="json" style={theme === 'dark' ? srcery : docco}>
          {`${JSON.stringify(clickedElement, undefined, 4)}`}
          </SyntaxHighlighter>
      </Modal>      
    </ReactFlowProvider>
  );
};

export default FlowChart;