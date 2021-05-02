import React, { useState } from 'react';
import logo from './logo.png';
import Paper from '@material-ui/core/Paper';
import './App.css';
import Chat from './Chat';
import { JwtData, User } from './Types';
import Users from './Users';
import { Tab, Tabs } from '@material-ui/core';


function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [jwt, setJwt] = useState("");
  const [jwtData, setJwtData] = useState<JwtData>();
  const [links, setLinks] = useState<string[]>([]);
  const [tabIdx, setTabIdx] = useState<any>(0);

  var i = 1;
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="App-body">
        <Tabs 
          className="App-bodyx"
          orientation="vertical"
          variant="scrollable"
          onChange={(_,value) => setTabIdx(value)}
          value={tabIdx}
          >
            <Tab label="Chat" />
            <Tab label="Other"/>
            { links.includes('odd') && <Tab label="Odd"/>}
            { links.includes('even') && <Tab label="Even"/>}
        </Tabs>

        <TabPanel value={tabIdx} index={0}>
          <Paper className="User-body">
            <Users setUsers={setUsers} users={users} jwt={jwt}/>
          </Paper>
          <Paper className="Message-body">
            <Chat users={users} jwt={jwt} setJwt={setJwt} setJwtData={setJwtData} jwtData={jwtData} setLinks={setLinks}/> 
          </Paper>
        </TabPanel>
        <TabPanel value={tabIdx} index={i++}>
          <div> Hello</div>
        </TabPanel>
        { links.includes('odd') && <TabPanel value={tabIdx} index={i++}>
          <div> You are Odd</div>
        </TabPanel>}
        { links.includes('even') && <TabPanel value={tabIdx} index={i++}>
          <div> You are Not Odd</div>
        </TabPanel>}
      </div>
    </div>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}
const TabPanel = ({index, value, children, ...other}: TabPanelProps) => {

  if (value !== index) {
    return (<></>)
  }
  return (
    <div
      className="Tab-body"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
          {children}
    </div>
  );
}

export default App;
