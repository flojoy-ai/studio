import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import FlowChart from './components/ReactFlow.tsx';
import ResultsTab from './components/ResultsTab.tsx';

import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './components/theme';
import { GlobalStyles } from './components/global';

import STATUS_CODES from './STATUS_CODES.json';

import './App.css';

const App = () => {
  const [serverStatus, setServerStatus] = useState('Connecting to server...');
  const [programResults, setProgramResults] = useState({status: '⛷️ No runs yet'});
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
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
                        setProgramResults(res);
                        setServerStatus(STATUS_CODES['RQ_RESULTS_RETURNED']);
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
            <h1>VEKTOR</h1>
            <button onClick={toggleTheme} className='App-theme-toggle'>
              {theme === 'light' ? '🌙' : '🌞'}
            </button>
        </header>
        <main>
          <Tabs>
            <TabList>
              <Tab >PROGRAM</Tab>
              <Tab >RUN REPORT</Tab>
            </TabList>

            <TabPanel>
              <FlowChart />
            </TabPanel>
            <TabPanel className='App-results-panel'>
              <div>
                  <ResultsTab 
                    results = {programResults} 
                    theme = {theme}
                  />
              </div>
            </TabPanel>
          </Tabs>
        </main>
      </>
    </ ThemeProvider>
  );
}

export default App;
