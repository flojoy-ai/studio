import React, {Component, memo, useCallback, Dispatch, FC, useState } from 'react';
import { useZoomPanHelper, OnLoadParams, Elements, FlowExportObject} from 'react-flow-renderer';
import localforage from 'localforage';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select from 'react-select'

import 'react-tabs/style/react-tabs.css';
import {COMMANDS, SECTIONS} from './COMMANDS_MANIFEST.js';

localforage.config({
  name: 'react-flow',
  storeName: 'flows',
});

const flowKey = 'vortx-flow';

const getNodeId = () => `userGeneratedNode_${+new Date()}`;

const getNodePosition = () => { 
  return {
    x: 50 + Math.random() * 20, 
    y: 50 + Math.random() + Math.random() * 20} 
};

type ControlsProps = {
  rfInstance?: OnLoadParams;
  setElements: Dispatch<React.SetStateAction<Elements<any>>>;
  clickedElement: Dispatch<React.SetStateAction<Elements<any>>>;
  onElementsRemove: Dispatch<React.SetStateAction<Elements<any>>>;
};

const Controls: FC<ControlsProps> = ({ rfInstance, setElements, clickedElement, onElementsRemove }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { transform } = useZoomPanHelper();

  const onSave = async () => {
    if (rfInstance) {
      const flowObj = rfInstance.toObject();
      localforage.setItem(flowKey, flowObj);

      const fc = flowObj;
      const fcStr = JSON.stringify(flowObj);


      fetch('/wfc', {
        method: 'POST',
        body: JSON.stringify({fc: fcStr}),
        headers: {'Content-type': 'application/json; charset=UTF-8'}
      })
      .then(resp => resp.json())
      .then(json => console.log(json));  
    }
  };

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow: FlowExportObject | null = await localforage.getItem(flowKey);

      if (flow) {
        const [x = 0, y = 0] = flow.position;
        setElements(flow.elements || []);
        transform({ x, y, zoom: flow.zoom || 0 });
      }
    };

    restoreFlow();
  }, [setElements, transform]);

  const onAdd = useCallback((FUNCTION, TYPE) => {
    if (FUNCTION === 'CONSTANT'){
      let constant = prompt("Please enter a numerical constant", '2.0');
      if (constant == null) {
        constant = '2.0';
      }
      FUNCTION = constant;
    }
    const newNode = {
      id: `${FUNCTION}-${getNodeId()}`,
      data: { label: FUNCTION, type: TYPE},
      position: getNodePosition(),
    };
    setElements((els) => els.concat(newNode));
    closeModal();
  }, [setElements]);

  const onClickElementDelete = () => {
    console.warn('onClickElementDelete', clickedElement);
    if (rfInstance && clickedElement) {
      console.warn('ELEM TO REMOVE', clickedElement);
      onElementsRemove([clickedElement])
    }
  }

  const modalStyles = {
    overlay: {zIndex: 99},
    content: {zIndex: 100}
  };

  const openModal = () => { setIsOpen(true); }
  const afterOpenModal = () => {}
  const closeModal = () => { setIsOpen(false); }

  const handleChange = selectedOption => {
    console.warn(selectedOption);
    if( selectedOption.value === 'delete' ){
      onClickElementDelete() 
    }
    else if( selectedOption.value === 'undo' ){
      onRestore();
    }
  };

  const options = [    
    { value: 'delete', label: '🗑️ Delete' },
    { value: 'undo', label: '😅 Undo' },
  ]

  return (
    <div className="save__controls">

      <a onClick={openModal}>🛠️ Add Python Function</a> 

      <a onClick={onSave}>🏃 Run Script</a>

      <Select 
        defaultValue = {{ value: 'edit', label: '🚧 Edit' }}
        value = {{ value: 'edit', label: '🚧 Edit' }}
        className = 'App-select'
        isSearchable = {false}
        onChange = {handleChange}
        options = {options} 
      />
           
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={modalStyles}
        ariaHideApp={false}
        contentLabel="Choose a Python function"
      >
        <button onClick={closeModal} className='close-modal'>x</button>
        <Tabs>
          <TabList>
            <Tab>Simulation</Tab>
            <Tab>Sample data</Tab>
            <Tab>ETL</Tab>
            <Tab>AI</Tab>
            <Tab>DAQ</Tab>
            <Tab>Visualization</Tab>
          </TabList>

          {SECTIONS.map((sections, tabIndex) =>
            <TabPanel key={tabIndex}>
            {sections.map((section, sectionIndex) =>
              <div key={sectionIndex}>
                <p key={section.name}>{section.name}</p>
                {COMMANDS.map((cmd, cmdIndex) =>
                  <span key={cmdIndex}>
                  {(section.key === cmd.type)
                    ? <button 
                        onClick={() => onAdd(cmd.key, cmd.type)} 
                        key={cmd.name}>
                        {cmd.name}
                      </button>
                    : null
                  }  
                  </span>              
                )}
              </div>
            )}
            </TabPanel>
          )}          

        </Tabs>
      </Modal>
    </div>
  );
};

export default memo(Controls);