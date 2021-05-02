/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useState} from 'react';
import './Jwt.css';
import { uniqueNamesGenerator, Config, starWars, adjectives } from 'unique-names-generator';
import { Chip, Dialog, DialogContent, DialogContentText, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import JWT from 'jsonwebtoken';
import { setUser } from './shared/services/rest.services';

const customConfig: Config = {
  dictionaries: [adjectives, starWars],
  separator: ' ',
  length: 2,
};

interface Props {
  setJwt: (jwt:string) => void,
  sub: number,
}

export default ({...other}: Props) => {

  const [name, setName] = useState(uniqueNamesGenerator(customConfig));
  const [roles, setRoles] = useState(["viewer", "admin"]);
  const [open, setOpen] = useState(false);

  return (
    <>
    <JwtDialog 
      name={name} 
      setName={setName}
      roles={roles} 
      setRoles={setRoles}
      open={open} 
      onClose={()=>setOpen(false)} 
      {...other}
      />
    <div className="jwt-header" onClick={()=>setOpen(!open)}>

      <div className="title-text">{roles.toString()}</div>
      <div className="title-text">{name}</div>
    </div>
    </>
  );
}

interface DialogProps {
  name: string,
  roles: string[],
  open: boolean,
  sub: number,
  setJwt: (jwt:string) => void,
  onClose(): void,
  setName: (name:string) => void,
  setRoles: (roles:string[]) => void,
}
const JwtDialog = ({name, setName, roles, setRoles, open, onClose, setJwt, sub, ...other}: DialogProps) => {

  const [secret, setSecret] = useState("password");
  const [localJwt, setLocalJwt] = useState("");

  useEffect(() => {
    var data = {
      "sub": sub,
      "name": name,
      "roles": roles,
      "active": true,
    }
    var jwt = JWT.sign(data,secret);
    setLocalJwt(jwt);
    setJwt(jwt);
    setUser(jwt, data);

  }, [name, roles, secret, sub, setJwt])

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      {...other}
      fullWidth={true}
      maxWidth="md"
      >
      <DialogTitle>Set Jwt claims for subject: {sub}</DialogTitle>
      <DialogContent>
          <DialogContentText>
            Update the claims below to see the effect on the JWT/application
          </DialogContentText>
        <div className="jwt-layout">
          <TextField
            value={name}
            onChange={(event) => setName(event.target.value)}
            label="Name"
          />
          <FormControl >
            <InputLabel id="roles-label">Roles</InputLabel>
            <Select
              labelId="roles-label"
              id="roles-select"
              multiple
              value={roles}
              onChange={(event) => setRoles(event.target.value as string[])}
              input={<Input id="roles-select" />}
              renderValue={(selected) => (
                <div >
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </div>
              )}
            >
              <MenuItem key="1" value="admin">Admin</MenuItem>
              <MenuItem key="2" value="viewer">Viewer</MenuItem>
              <MenuItem key="3" value="blocker">Blocker</MenuItem>
              <MenuItem key="4" value="chatter">Chatter</MenuItem>
              <MenuItem key="5" value="junk">Junk</MenuItem>
            </Select>
          </FormControl>
          <FormControl >
            <InputLabel id="secret-label">JWT Secret</InputLabel>
            <Select
              labelId="secret-label"
              value={secret}
              onChange={(event) => setSecret(event.target.value as string)}
            >
              <MenuItem key="a" value="password">Valid Secret</MenuItem>
              <MenuItem key="b" value="oldpassword">Old But Still Good</MenuItem>
              <MenuItem key="c" value="nocando">Never valid</MenuItem>
            </Select>
          </FormControl>
          <TextField
            multiline
            disabled
            value={localJwt}
            rows={4}
            label="Current JWT"/>

        </div>
      </DialogContent>
    </Dialog>

  );
} 
