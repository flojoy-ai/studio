import React, { useState, useEffect } from 'react';

import FlowChart from './components/ReactFlow.tsx';

import './App.css';

const App = () => {
  const [serverStatus, setServerStatus] = useState('Connecting to server...');

  const pingBackendAPI = async () => {
    console.log('pinging backend API...')
    const resp = await fetch('/ping');
    const body = await resp.json();

    if (resp.status !== 200) { throw Error(body.message); }

    return body;
  };

  useEffect(() => {
    console.log('component did mount');
 
    pingBackendAPI()
      .then(res => {
        if(res.serverConnected === true){ 
          setServerStatus('🏁 server online' );            
        } else {
          setServerStatus('server offline... try again in 3 seconds');
        }
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="App">
      <p className="App-status"><code>{serverStatus}</code></p>
      <header className="App-header">
        <b>
          <code>v-ctr.space</code>
        </b>
      </header>
      <main>
        <FlowChart />
      </main>
    </div>
  );
}

export default App;
