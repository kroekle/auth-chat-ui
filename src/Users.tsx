/* eslint-disable import/no-anonymous-default-export */
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import './Users.css';
import {GridList, GridListTile} from '@material-ui/core';
import {User} from './Types';
import StatusIcon from '@material-ui/icons/FiberManualRecordTwoTone';
import {getUsers} from './shared/services/rest.services';


interface Props {
  users?: User[],
  jwt: string,
  setUsers: (Dispatch<SetStateAction<User[]>>), 
}  
export default ({users, setUsers, jwt}: Props) => {
  
  const ref = React.createRef<HTMLSpanElement>();
  const [errMsg, setErrorMsg] = useState<string>();
  
  const updateUsers = (jwt: string, setUsers: (users:User[]) => void) => {
  
    getUsers(jwt)
      .then(resp => {setUsers(resp); setErrorMsg(undefined);})
      .catch((err:Error) => {setErrorMsg(err.message); setUsers([]);});
  }

  useEffect(() => {

    if (jwt) {
      updateUsers(jwt, setUsers);
      const timer = setInterval(() => updateUsers(jwt, setUsers), 5000);
      return () => clearInterval(timer);
    }

  }, [jwt, setUsers])

  useEffect(() => {

  }, [])

  useEffect(() => {
    if (users) {
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [users, ref])

  const getIconColor = (active: boolean) => {
    if (active) {
      return "green";
    }
    return "black";
  }

  return (
    <div className="Body">
      <GridList cols={1} cellHeight={25} className="Name-content">
        {
          !errMsg && users && users.length > 0 && users.map((user, i) => (
            <GridListTile key={i} cols={1} className="Name-text">
              <StatusIcon fontSize='small' className={getIconColor(user.active)}/>

              <span>{user.name}</span>
            </GridListTile>
          ))
        }
        {
          errMsg && <GridListTile key="1" cols={1} className="Name-text">
          <StatusIcon fontSize='small' className={getIconColor(false)}/>

          <span>{errMsg}</span>
        </GridListTile>
        }
        <GridListTile key={-1} cols={1} className="Name-text">
          <span className="Name-text" ref={ref}></span>
        </GridListTile>
      </GridList>
    </div>
  );
}

