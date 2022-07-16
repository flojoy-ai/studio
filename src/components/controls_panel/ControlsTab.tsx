import React, {useState} from 'react';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import {CONTROL_OUTPUTS, CONTROL_INPUTS} from './CONTROLS_MANIFEST';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ControlComponent from './controlComponent'
import clone from 'just-clone';
import localforage from 'localforage';

import './Controls.css';
import '../../App.css';
import { CtlManifestType, useFlowChartState } from '../../hooks/useFlowChartState';
import { saveAndRunFlowChartInServer } from '../../services/FlowChartServices';
import { FUNCTION_PARAMETERS } from '../flow_chart_panel/PARAMETERS_MANIFEST';

localforage.config({name: 'react-flow', storeName: 'flows'});


const ControlsTab = ({ results, theme }) => {
    const [modalIsOpen, setIsModalOpen] = useState(false);

    const {rfInstance, elements, updateCtrlInputDataForNode, removeCtrlInputDataForNode, ctrlsManifest, setCtrlsManifest} = useFlowChartState();
    const [debouncedTimerId, setDebouncedTimerId] = useState<NodeJS.Timeout | undefined>(undefined); 

    const modalStyles = {overlay: {zIndex: 99},content: {zIndex: 100}};
    const openModal = () => { setIsModalOpen(true); }
    const afterOpenModal = () => {}
    const closeModal = () => { setIsModalOpen(false); }

    const saveAndRunFlowChart = () => {
      // save and run the script with debouncing
      if(debouncedTimerId){
        clearTimeout(debouncedTimerId);
      }
      const timerId = setTimeout(() => {
        saveAndRunFlowChartInServer(rfInstance);
      }, 1000);

      setDebouncedTimerId(timerId);
    }
    
    async function cacheManifest(manifest: CtlManifestType[]) {
        setCtrlsManifest(manifest);
    }

    const addCtrl = (ctrlObj: Partial<CtlManifestType>)  => {
      const ctrl: CtlManifestType = {...ctrlObj, id: `ctrl-${uuidv4()}`} as CtlManifestType
      console.log('adding ctrl...', ctrl);
      console.log(ctrl.type, ctrl.type ==='input');
      setIsModalOpen(false);
      cacheManifest([...ctrlsManifest, ctrl]);
    }

    const rmCtrl = (e, ctrl: any = undefined) => {
      const ctrlId = e.target.id;
      console.warn('Removing', ctrlId, ctrl);
      const filteredOutputs = ctrlsManifest.filter(ctrl => ctrl.id !== ctrlId);
      cacheManifest(filteredOutputs);
      if(ctrl){
        removeCtrlInputDataForNode(ctrl.param.nodeId, ctrl.param.id);
        saveAndRunFlowChart();
      }
    }

    const updateCtrlValue = (val, ctrl) => {
      console.log('updateCtrlValue:', val, ctrl);
      let manClone = clone(ctrlsManifest);
      manClone.forEach((c, i) => {
        if (c.id  === ctrl.id) {
          manClone[i].val = val;
        }
      });
      cacheManifest(manClone);
      updateCtrlInputDataForNode(ctrl.param.nodeId, ctrl.param.id, {
        functionName: ctrl.param.functionName,
        param: ctrl.param.param,
        value: val,
      });
      saveAndRunFlowChart();
    }


    const attachParam2Ctrl = (param, ctrl) => {
      console.log('attachParam2Ctrl', param, ctrl);

      // grab the current value for this param if it already exists in the flowchart elements
      const inputNode = elements.find((e) => e.id === param.nodeId);
      const ctrls = inputNode?.data?.ctrls;
      const fnParams = FUNCTION_PARAMETERS[param?.functionName] || {};
      // debugger
      const fnParam = fnParams[param?.param];
      const defaultValue = fnParam?.default || 0;
      console.log('attachParam2Ctrl defaultValue:', defaultValue);
      const ctrlData = ctrls && ctrls[param?.id];
      console.log('attachParam2Ctrl ctrlData:', ctrlData);
      let currentInputValue = ctrlData ? ctrlData.value : defaultValue;

      let manClone = clone(ctrlsManifest);
      manClone.map((c, i) => {
        if (c.id  === ctrl.id) {
          manClone[i].param = param;
          manClone[i].val = currentInputValue;
        }
      });
      cacheManifest(manClone);
    }

    return (
      <div>
          <div className="save__controls">
              <a onClick={openModal}>🎚️ Add Control</a>
          </div>

          <div className='App-controls-header'>
            <div className="input-header">Inputs</div>
            <div className="output-header">Outputs</div>
          </div>

          <div className='App-controls-panel'>
            <div className='ctrl-inputs-sidebar'>
              {ctrlsManifest.filter(c => c.type === 'input').map((ctrl, i) =>
                <div key={ctrl.id} className='ctrl-input'>
                  <button onClick = {e => rmCtrl(e, ctrl)} id = {ctrl.id} className='ctrl-close-btn'>x</button>
                  <ControlComponent 
                    ctrlObj={ctrl} 
                    theme={theme} 
                    results={results}
                    updateCtrlValue={updateCtrlValue}
                    attachParam2Ctrl={attachParam2Ctrl}
                  />
                </div>
              )}
              <div className='ctrl-input' style={{overflow:'scroll', height:300}}>
                <pre>{JSON.stringify(ctrlsManifest, undefined, 2)}</pre>
              </div>
            </div>
            <div className='ctrl-outputs-container'>
              <div className='ctrl-outputs-canvas'>
              {ctrlsManifest.filter(c => c.type === 'output').map((ctrl, i) =>
                <div key={ctrl.id} className='ctrl-output'>
                  <button onClick = {e => rmCtrl(e)} id = {ctrl.id} className='ctrl-close-btn'>x</button>
                  <ControlComponent 
                    ctrlObj={ctrl}
                    results={results}
                    theme={theme} 
                    updateCtrlValue={updateCtrlValue}
                    attachParam2Ctrl={attachParam2Ctrl}
                  />                
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
            <Tab>Inputs</Tab>
            <Tab>Outputs</Tab>
          </TabList>

          <TabPanel key={0}>
            <div className='ctrl-picker-container'>
              {CONTROL_INPUTS.map((ctrl, ctrlIndex) =>
                <span key={ctrlIndex}>
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
                <span key={ctrlIndex}>
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
