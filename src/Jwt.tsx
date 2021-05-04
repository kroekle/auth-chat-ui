/* eslint-disable import/no-anonymous-default-export */
import React, { Dispatch, SetStateAction, useEffect, useState} from 'react';
import './Jwt.css';
import { uniqueNamesGenerator, Config, starWars, adjectives } from 'unique-names-generator';
import { Chip, Dialog, DialogContent, DialogContentText, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { setUser } from './shared/services/rest.services';
import { JwtData } from './Types';

var JWT = require('jsonwebtoken');
const customConfig: Config = {
  dictionaries: [adjectives, starWars],
  separator: ' ',
  length: 2,
};

interface Props {
  setJwt: (jwt:string) => void,
  jwt: string,
  sub: string,
  jwtData: JwtData | undefined,
  setJwtData: (Dispatch<SetStateAction<JwtData|undefined>>),
}
export default ({jwt, jwtData, ...other}: Props) => {

  const [open, setOpen] = useState(false);

  return (
    <>
    <JwtDialog 
      jwt={jwt}
      jwtData={jwtData}
      open={open} 
      onClose={()=>setOpen(false)} 
      {...other}
      />
    <div className="jwt-header" onClick={()=>setOpen(!open)}>

      <div className="title-text">{jwtData && jwtData.roles && jwtData.roles.toString()}</div>
      <div className="title-text">{jwtData && jwtData.name}</div>
    </div>
    </>
  );
}

interface DialogProps {
  open: boolean,
  sub: string,
  jwt: string,
  jwtData: JwtData | undefined,
  setJwt: (jwt:string) => void,
  setJwtData: (Dispatch<SetStateAction<JwtData | undefined>>),
  onClose(): void,
}
const JwtDialog = ({open, jwt, jwtData, onClose, setJwt, setJwtData, sub, ...other}: DialogProps) => {

  const [secret, setSecret] = useState("password");
  const [localJwt, setLocalJwt] = useState("");
  const [name, setName] = useState<string>();

  useEffect(() => {
    if (!jwtData) {
      setJwtData({
        name: uniqueNamesGenerator(customConfig),
        roles: ["viewer"],
        active: true,
        sub: sub,
      });
    }
  },[jwtData, sub, setJwtData]);

  useEffect(() => {
    if (jwtData) {
      setName(jwtData.name);
    }
  }, [jwtData]);

  useEffect(() => {
    if (jwtData) {
      var jwt = JWT.sign(jwtData,secret);
      setLocalJwt(jwt);
      setJwt(jwt);
      setUser(jwt, jwtData);
    }

  }, [jwtData, secret, setJwt])

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
          {jwtData && <TextField
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => setJwtData(d => { return {...d!, name: name!}})}
            label="Name"
          />}
          { jwtData && <FormControl >
            <InputLabel id="roles-label">Roles</InputLabel>
            <Select
              labelId="roles-label"
              id="roles-select"
              multiple
              value={jwtData.roles}
              onChange={(event) => setJwtData((d) => {return {...d!, roles: event.target.value as string[]};})}
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
              <MenuItem key="3" value="chatter">Chatter</MenuItem>
              <MenuItem key="4" value="filtered">Filtered</MenuItem>
            </Select>
          </FormControl>}
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
