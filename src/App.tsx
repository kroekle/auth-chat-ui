import React, { useState } from 'react';
import logo from './logo.png';
import Paper from '@material-ui/core/Paper';
import './App.css';
import Chat from './Chat';
import { User } from './Types';
import Users from './Users';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [jwt, setJwt] = useState("");
  const [links, setLinks] = useState<string[]>([])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="App-body">
        <Paper className="User-body">
          <Users setUsers={setUsers} users={users} jwt={jwt}/>
        </Paper>
        <Paper className="Message-body">
          <Chat users={users} jwt={jwt} setJwt={setJwt} setLinks={setLinks}/> 
        </Paper>
      </div>
    </div>
  );
}

export default App;
