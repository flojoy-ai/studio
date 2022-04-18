import React, {useState} from 'react';
import {FlowExportObject} from 'react-flow-renderer';
import localforage from 'localforage';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';

import './Controls.css';
import '../../App.css';

const ControlsTab = ({ results, theme }) => {
    const [modalIsOpen, setIsModalOpen] = useState(false);
    const [ctrlCanvasInputs, setCtrlCanvasInputs] = useState([]);
    const [ctrlCanvasOutputs, setCtrlCanvasOutputs] = useState([]);
    const [inputsHeader, setInputsHeader] = useState('Inputs');
    const [outputsHeader, setOutputsHeader] = useState('Outputs');

    const modalStyles = {overlay: {zIndex: 99},content: {zIndex: 100}};
    const openModal = () => { setIsModalOpen(true); }
    const afterOpenModal = () => {}
    const closeModal = () => { setIsModalOpen(false); }

    const addCtrl = ctrlObj => {
      const ctrl = {
        name: ctrlObj.name,
        type: ctrlObj.type,
        id: `ctrl-${uuidv4()}`,
      }
      if(ctrl.type === 'output'){
        setCtrlCanvasOutputs([...ctrlCanvasOutputs, ctrl]);
      }
      else if(ctrl.type === 'input'){
        setCtrlCanvasInputs([...ctrlCanvasInputs, ctrl]);
      }
      setIsModalOpen(false);
    }

    const rmCtrl = e => {
      const ctrlId = e.target.id;
      console.warn('Removing', ctrlId);
      const filteredOutputs = ctrlCanvasOutputs.filter(ctrl => ctrl.id !== ctrlId);
      const filteredInputs = ctrlCanvasInputs.filter(ctrl => ctrl.id !== ctrlId);
      setCtrlCanvasOutputs(filteredOutputs);
      setCtrlCanvasInputs(filteredInputs);   
    }

    return (
      <div>
          <div className="save__controls">
              <a onClick={openModal}>🎚️ Add Control</a>
          </div>

          <div className='App-controls-header'>
            <div className="input-header">
              {inputsHeader}
            </div>
            <div className="output-header">
              {outputsHeader}
            </div>
          </div>

          <div className='App-controls-panel'>
            <div className='ctrl-inputs-sidebar'>
              {ctrlCanvasInputs.map(inputCtrl =>
                <div key={inputCtrl.id} className='ctrl-input'>
                  <button
                    onClick = {e => rmCtrl(e)}
                    id = {inputCtrl.id}
                    className='ctrl-close-btn'>
                      x
                  </button>
                  <details className='ctrl-meta'>           
                    {`Name: ${inputCtrl.name}`}
                    <br></br>
                    {`ID: ${inputCtrl.id}`}
                  </details>  
                </div>
              )}              
            </div>
            <div className='ctrl-outputs-container'>
              <div className='ctrl-outputs-canvas'>
                {ctrlCanvasOutputs.map(outputCtrl =>
                  <div key={outputCtrl.id} className='ctrl-output'>
                    <button
                      onClick = {e => rmCtrl(e)}
                      id = {outputCtrl.id}
                      className='ctrl-close-btn'>
                        x
                    </button>
                    <details className='ctrl-meta'>           
                      {`Name: ${outputCtrl.name}`}
                      <br></br>
                      {`ID: ${outputCtrl.id}`}
                    </details>  
                  </div>
                )}            
              </div>
            </div>
          </div>
              
          <Modal
              isOpen={modalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModal}
              style={modalStyles}
              ariaHideApp={false}
              contentLabel="Choose a Python function"
          >
          <button onClick={closeModal} className='ctrl-close-btn'>x</button>

          <button onClick={() => addCtrl({
            type: 'output',
            name: 'PLOT',            
          })}>
            Plot
          </button>

          <button onClick={() => addCtrl({
            type: 'input',
            name: 'NUMERIC INPUT',            
          })}>
            Numeric Input
          </button>          

        </Modal>
      </div>
    );
};

export default ControlsTab;
