import React, {useState} from 'react';
import {FlowExportObject} from 'react-flow-renderer';
import localforage from 'localforage';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';

import './Controls.css';
import '../../App.css';

const ControlsTab = ({ results, theme }) => {
    const [modalIsOpen, setIsModalOpen] = useState(false);
    const [ctrlCanvas, setCtrlCanvas] = useState([]);

    const modalStyles = {
        overlay: {zIndex: 99},
        content: {zIndex: 100}
      };
    
    const openModal = () => { setIsModalOpen(true); }
    const afterOpenModal = () => {}
    const closeModal = () => { setIsModalOpen(false); }

    const addCtrl = ctrlId => {
      const ctrl = {
        type: ctrlId,
        id: `ctrl-${uuidv4()}`,
      }
      setCtrlCanvas([...ctrlCanvas, ctrl]);
      setIsModalOpen(false);
    }

    const rmCtrl = e => {
      const ctrlId = e.target.id;
      console.warn('Removing', ctrlId);
      let filteredCtrls = ctrlCanvas.filter(ctrl => ctrl.id !== ctrlId);     
      setCtrlCanvas(filteredCtrls);
    }

    return (
      <div>
          <div className="save__controls">
              <a onClick={openModal}>🎚️ Add Control</a>
          </div>

          <div className='App-controls-panel'>

            {ctrlCanvas.map(ctrl =>
              <div key={ctrl.id} className='ctrl-item'>
                <button
                  onClick = {e => rmCtrl(e)}
                  id = {ctrl.id}
                  className='ctrl-close-btn'>
                    x
                </button>
                <details className='ctrl-meta'>           
                  {`Type: ${ctrl.type}`}
                  <br></br>
                  {`ID: ${ctrl.id}`}
                </details>  

              </div>
            )}            

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

          <button onClick={() => addCtrl('PLOT')}>
            Plot
          </button>

        </Modal>
      </div>
    );
};

export default ControlsTab;
