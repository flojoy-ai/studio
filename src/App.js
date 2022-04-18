import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import FlowChart from './components/flow_chart_panel/ReactFlow.tsx';
import ResultsTab from './components/results_panel/ResultsTab.tsx';
import ControlsTab from './components/controls_panel/ControlsTab.tsx';

import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './components/theme';
import { GlobalStyles } from './components/global';

import STATUS_CODES from './STATUS_CODES.json';

import './App.css';

const App = () => {
  const [serverStatus, setServerStatus] = useState('Connecting to server...');
  const [programResults, setProgramResults] = useState({msg: STATUS_CODES.NO_RUNS_YET});
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  }

  const pingBackendAPI = async (endpoint) => {
    const resp = await fetch(endpoint);
    const body = await resp.json();

    if (resp.status !== 200) { throw Error(body.message); }

    return body;
  };

  useEffect(() => {
    console.log('component did mount');
 
    pingBackendAPI('/ping')
      .then(res => {
        if('msg' in res){ 
          setServerStatus(res.msg);
          // set a timer that gets an update from the server every second
          window.setInterval(() => {
            pingBackendAPI('/heartbeat')
              .then(res => {
                // console.log('heartbeat', res);
                if(res.msg === STATUS_CODES['RQ_RUN_COMPLETE']) {
                  // grab program result from redis
                  setServerStatus(STATUS_CODES['RQ_RUN_COMPLETE']);
                  console.log(STATUS_CODES['RQ_RUN_COMPLETE'])
                  pingBackendAPI('/io')
                    .then(res => {
                      console.log('io', res);
                      if(res.msg === STATUS_CODES['MISSING_RQ_RESULTS']) {
                        setServerStatus(res.msg);
                      }
                      else{                        
                        setServerStatus(STATUS_CODES['RQ_RESULTS_RETURNED']);
                        console.log('setting results state', res);
                        setProgramResults(res);

                        console.warn('new program results', programResults);
                      }
                    });                  
                }
                else if (res.msg !== undefined && res.msg !== ''){
                  // Program in process, awaiting a new job etc...
                  setServerStatus(res.msg);
                }
              })
            }, 
          1000);
        } else {
          setServerStatus(STATUS_CODES['SERVER_OFFLINE']);
        }
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <>
        <GlobalStyles />
        <p className="App-status"><code>{serverStatus}</code></p>
        <header className="App-header">
            <h1>FLOJOY</h1>
            <button onClick={toggleTheme} className='App-theme-toggle'>
              {theme === 'light' ? '🌙' : '🌞'}
            </button>
        </header>
        <main>
          <Tabs forceRenderTabPanel={true}>
            <TabList>
              <Tab >PYTHON SCRIPT</Tab>
              <Tab >CTRL PANEL</Tab>              
              <Tab style={{float: 'right'}}>LOGS</Tab>
            </TabList>

            <TabPanel key='tab-1'>
              <FlowChart 
                  results = {programResults} 
                  theme = {theme}
              />
            </TabPanel>

            <TabPanel key='tab-2'>
              <ControlsTab 
                results = {programResults} 
                theme = {theme}
              />
            </TabPanel> 

            <TabPanel 
              key='tab-3' 
              style={{backgroundColor: '#282c34'}}
            >
                <ResultsTab 
                  results = {programResults} 
                  theme = {theme}
                />
            </TabPanel>

          </Tabs>
        </main>
      </>
    </ ThemeProvider>
  );
}

export default App;
