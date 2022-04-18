import React, {useState} from 'react';
import {FlowExportObject} from 'react-flow-renderer';
import localforage from 'localforage';

const ControlComponent = ({ ctrlObj, rmCtrl }) => {
    return (
        <div key={ctrlObj.id} className='ctrl-input'>
        <button
          onClick = {e => rmCtrl(e)}
          id = {ctrlObj.id}
          className='ctrl-close-btn'>
            x
        </button>
        <details className='ctrl-meta'>           
          {`Name: ${ctrlObj.name}`}
          <br></br>
          {`ID: ${ctrlObj.id}`}
        </details>  
      </div>
    );
};

export default ControlComponent;
