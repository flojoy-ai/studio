import React, { memo, useCallback, Dispatch, FC, useState } from 'react';
import { useZoomPanHelper, OnLoadParams, Elements, FlowExportObject} from 'react-flow-renderer';
import localforage from 'localforage';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
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

  const onAdd = useCallback((FUNCTION) => {
    if (FUNCTION === 'CONSTANT'){
      let constant = prompt("Please enter a numerical constant", '2.0');
      if (constant == null) {
        constant = '2.0';
      }
      FUNCTION = constant;
    }
    const newNode = {
      id: `${FUNCTION}-${getNodeId()}`,
      data: { label: FUNCTION },
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

  return (
    <div className="save__controls">

      <a onClick={onSave}>⏯ Run Script</a>
      <a onClick={onRestore}>⏮ Restore Run</a>
      <a onClick={onClickElementDelete}>🚮 Delete Node</a>
      <a onClick={openModal}>🧰 Python Function</a> 
           
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={modalStyles}
        ariaHideApp={false}
        contentLabel="Choose a Python function"
      >
        <button 
          onClick={closeModal}
          style={{'position': 'absolute', 'right': '10px'}}
        >
            x close
        </button>
        <Tabs>
          <TabList>
            <Tab>Acquire & Control</Tab>
            <Tab>Process & Transform</Tab>
            <Tab>Save & Visualize</Tab>
          </TabList>

          {SECTIONS.map((sections, tabIndex) =>
            <TabPanel key={tabIndex}>
            {sections.map((section, sectionIndex) =>
              <div key={sectionIndex}>
                <p key={section.name}>{section.name}</p>
                {COMMANDS[tabIndex].map((cmd, cmdIndex) =>
                  <span key={cmdIndex}>
                  {(section.key === cmd.type)
                    ? <button onClick={() => onAdd(cmd.key)} key={cmd.name}>{cmd.name}</button>
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