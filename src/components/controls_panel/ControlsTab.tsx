import React, {useState} from 'react';
import {FlowExportObject} from 'react-flow-renderer';
import localforage from 'localforage';
import Modal from 'react-modal';

import './Controls.css';
import '../../App.css';

const ControlsTab = ({ results, theme }) => {
    const [modalIsOpen, setIsOpen] = useState(false);

    const modalStyles = {
        overlay: {zIndex: 99},
        content: {zIndex: 100}
      };
    
    const openModal = () => { setIsOpen(true); }
    const afterOpenModal = () => {}
    const closeModal = () => { setIsOpen(false); }

    const addCtrl = async (ctrlId) => {

      const flow: FlowExportObject | null = await localforage.getItem('vortx-flow');

        if(flow) {

          const flowElements = flow.elements;

          switch(ctrlId) {
            case 'PLOT':
              console.log(ctrlId);
              console.log(flowElements);
              break;
          }
        }
      else{
        alert('');
      }
    }

    return (
      <div>
          <div className="save__controls">
              <a>⏯ Run Script</a>
              <a>🚮 Remove Control</a>
              <a onClick={openModal}>➕ Add Control</a>
          </div>

          <div className='App-controls-panel'>

          </div>
              
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

          <button
            onClick={() => addCtrl('PLOT')}
          >
            Plot
          </button>

        </Modal>
      </div>
    );
};

export default ControlsTab;
