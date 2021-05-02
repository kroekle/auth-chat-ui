/* eslint-disable import/no-anonymous-default-export */
import React, {useEffect} from 'react';
import './Users.css';
import {GridList, GridListTile} from '@material-ui/core';
import {User} from './Types';
import StatusIcon from '@material-ui/icons/FiberManualRecordTwoTone';
import {getUsers} from './shared/services/rest.services';

const updateUsers = (jwt: string, setUsers: (users:User[]) => void) => {

  getUsers(jwt)
    .then(resp => setUsers(resp));
}

interface Props {
  users?: User[],
  jwt: string,
  setUsers: (users:User[]) => void, 
}  
export default ({users, setUsers, jwt}: Props) => {

  const ref = React.createRef<HTMLSpanElement>();

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
          users && users.map((user, i) => (
            <GridListTile key={i} cols={1} className="Name-text">
              <StatusIcon fontSize='small' className={getIconColor(user.active)}/>

              <span>{user.name}</span>
            </GridListTile>
          ))
        }
        <GridListTile key={-1} cols={1} className="Name-text">
          <span className="Name-text" ref={ref}></span>
        </GridListTile>
      </GridList>
    </div>
  );
}

