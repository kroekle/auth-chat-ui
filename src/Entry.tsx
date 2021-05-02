/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useState} from 'react';
import './Entry.css';
import { sendMessage } from './shared/services/rest.services';
import { User } from './Types';
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete"
import "@webscopeio/react-textarea-autocomplete/style.css";
import { IconButton } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

interface Named {
  name: string,
}

interface Junk {
  entity: User,
}

interface Props {
  jwt: string,
  users: User[],
  className: string,
  tempSub: number,
}
export default ({users, className, tempSub, jwt, ...other}: Props) => {

  const [message, setMessage] = useState<string>();
  const [list, setList] = useState<Named[]>();
  const Item = (user:Junk) => <div>{user.entity.name}</div>
  // const [ref, setRef] = useState<ReactTextareaAutocomplete<User, React.TextareaHTMLAttributes<HTMLTextAreaElement>>|null>()


  const sendTheMessage = () => {
    if (message) {
      sendMessage(jwt, {message:message, from: tempSub});
      // ref!.s
    }
  }

  useEffect(() => {
    setList(users.map(u => {return {"name":`@${u.name}`}}));
  }, [users])

  return (
    <>
      <div className={`${className} entry-body`}>
        {list && <ReactTextareaAutocomplete<User>
          className="message-textarea"
          loadingComponent={() => <span>Loading</span>}
          trigger={{
            "@": {
              dataProvider: token => {
                return users.filter(u => u.name.startsWith(token));
              },
              component: Item,
              allowWhitespace: true,
              output: (user, trigger) => `${trigger}${user.name}`
            }
          }}
          
          onChange={(e) => setMessage(e.target.value)}
          // ref={refx => setRef(refx)}
        />}
        <IconButton onClick={()=>sendTheMessage()}>
          <SendIcon/>
        </IconButton>
      </div>
    </>
  );
}
