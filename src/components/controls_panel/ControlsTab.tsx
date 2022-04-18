import React, {useState} from 'react';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import {CONTROL_OUTPUTS, CONTROL_INPUTS} from './CONTROLS_MANIFEST';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ControlComponent from './controlComponent'

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
      const ctrl = {...ctrlObj, id: `ctrl-${uuidv4()}`}
    
      ctrl.type === 'output'
        ? setCtrlCanvasOutputs([...ctrlCanvasOutputs, ctrl])
        : setCtrlCanvasInputs([...ctrlCanvasInputs, ctrl]);

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
                <ControlComponent 
                  ctrlObj={inputCtrl}>
                </ControlComponent>
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
          <Tabs>
          <TabList>
            <Tab>Input controls</Tab>
            <Tab>Output controls</Tab>
          </TabList>

          <TabPanel key={0}>
            <div className='ctrl-picker-container'>
              {CONTROL_INPUTS.map((ctrl, ctrlIndex) =>
                <span>
                  <button onClick={() => addCtrl({
                    type: ctrl.type,
                    name: ctrl.name    
                  })}>
                    {ctrl.name}
                  </button>
                </span>
              )}
            </div>
          </TabPanel>      

          <TabPanel key={1}>
            <div className='ctrl-picker-container'>
              {CONTROL_OUTPUTS.map((ctrl, ctrlIndex) =>
                <span>
                  <button onClick={() => addCtrl({
                    type: ctrl.type,
                    name: ctrl.name             
                  })}>
                    {ctrl.name}
                  </button>
                </span>
              )}
            </div>
          </TabPanel>              

        </Tabs>        

        </Modal>
      </div>
    );
};

export default ControlsTab;
