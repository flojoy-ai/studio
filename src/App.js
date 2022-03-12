import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import FlowChart from './components/ReactFlow.tsx';
import ResultsTab from './components/ResultsTab.tsx';

import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './components/theme';
import { GlobalStyles } from './components/global';

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
        if(res.cnx === true){ 
          setServerStatus('🏁 node server online' );
          // set a timer that gets an update from the server very second
          this.heartbeat = setInterval(() => {
            pingBackendAPI('/heartbeat')
              .then(res => {
                setServerStatus(res.clock);
                if(Object.keys(res.io).length != 0) {
                  setProgramResults(res.io)
                }
              })
            }, 
          1000);
        } else {
          setServerStatus('🛑 node server offline - run `node server.js` in your terminal');
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
            <button 
              onClick={toggleTheme}
              style={{position: 'absolute',
                    right: 10,
                    fontSize: 18,
                    background: 'transparent',
                    border: 0,
                    cursor: 'pointer'
                  }}>
              {theme == 'light' ? '🌙' : '🌞'}
            </button>
        </header>
        <main>
          <Tabs>
            <TabList>
              <Tab>PROGRAM</Tab>
              <Tab>RESULTS</Tab>
            </TabList>

            <TabPanel>
              <FlowChart />
            </TabPanel>
            <TabPanel>
              <div style={{
                  height: '100vh',
                  padding: 10,
                  margin: '10px 200px'
                }}>
                  <ResultsTab programResults = {programResults} />
              </div>
            </TabPanel>
          </Tabs>
        </main>
      </>
    </ ThemeProvider>
  );
}

export default App;
