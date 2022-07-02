import React, {Component, memo, useCallback, Dispatch, FC, useState, useEffect } from 'react';
import { useZoomPanHelper, OnLoadParams, Elements, FlowExportObject } from 'react-flow-renderer';
import localforage from 'localforage';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';

import 'react-tabs/style/react-tabs.css';
import {COMMANDS, SECTIONS} from './COMMANDS_MANIFEST.js';

import { lightTheme, darkTheme } from './../theme';
import { saveFlowChartToLocalStorage, saveFlowChartInServer } from '../../services/FlowChartServices';

localforage.config({
  name: 'react-flow',
  storeName: 'flows',
});

const flowKey = 'flow-joy';

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
  theme: String;
};

const Controls: FC<ControlsProps> = ({ rfInstance, setElements, clickedElement, onElementsRemove, theme }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { transform } = useZoomPanHelper();

 

  useEffect(() => {
    console.log('ControlBar component did mount');
  });

  const onSave = async () => {
    if (rfInstance) {
      saveFlowChartToLocalStorage(rfInstance);
      saveFlowChartInServer(rfInstance);
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

    saveFlowChartToLocalStorage(rfInstance);
  }, [setElements, transform, rfInstance]);

  const onAdd = useCallback((FUNCTION, TYPE) => {
    if (FUNCTION === 'CONSTANT'){
      let constant = prompt("Please enter a numerical constant", '2.0');
      if (constant == null) {
        constant = '2.0';
      }
      FUNCTION = constant;
    }
    const newNode = {
      id: `${FUNCTION}-${uuidv4()}`,
      data: { label: FUNCTION, type: TYPE},
      position: getNodePosition(),
    };
    setElements((els) => els.concat(newNode));
    closeModal();

    saveFlowChartToLocalStorage(rfInstance);
  }, [setElements, rfInstance]);

  const onClickElementDelete = () => {
    console.warn('onClickElementDelete', clickedElement);
    if (rfInstance && clickedElement) {
      console.warn('ELEM TO REMOVE', clickedElement);
      onElementsRemove([clickedElement] as any)
      saveFlowChartToLocalStorage(rfInstance);
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
  ];

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: state.selectProps.theme === 'dark' 
        ? darkTheme.background 
        : lightTheme.background,
      color: state.selectProps.theme === 'dark' 
        ? darkTheme.text 
        : lightTheme.text,        
    }),

    control: (provided, state) => ({
      ...provided,
      backgroundColor: state.selectProps.theme === 'dark' 
        ? darkTheme.background 
        : lightTheme.background,
      color: state.selectProps.theme === 'dark' 
        ? darkTheme.text 
        : lightTheme.text,
    }),

    option: (styles, { selectProps, isFocused, isSelected }) => {
      return {
        ...styles,
        cursor: 'pointer',
        backgroundColor: isSelected
        ? selectProps.theme === 'dark' ? 'black' : '#eee'
        : isFocused
        ? selectProps.theme === 'dark' ? 'black' : '#eee'
        : undefined,
        ':active': {
          ...styles[':active'],
          backgroundColor: theme === 'dark' ? 'black' : '#eee',
          }
      }
    },    
  
    singleValue: (provided, state) => {
      const color = state.selectProps.theme === 'dark' 
        ? darkTheme.text 
        : lightTheme.text;
  
      return { ...provided, color };
    }    
  }

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
        styles={customStyles}
        theme={theme as any}
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