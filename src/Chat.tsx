/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect, forwardRef, Dispatch, SetStateAction } from 'react';

import './Chat.css';
import { Message, User, JwtData, ErrResponse} from './Types';
import Jwt from './Jwt';
import { register, getMessages } from './shared/services/rest.services';
import Entry from './Entry';
import { useCookies } from 'react-cookie';


interface Props {
  jwt: string,
  setJwt: (jwt: string) => void,
  jwtData: JwtData | undefined,
  setJwtData: (Dispatch<SetStateAction<JwtData|undefined>>),
  users: User[],
  setLinks: (links: string[]) => void
}
export default ({users, jwt, setLinks, ...other}:Props) => {
  
  const [messages, setMessages] = useState<Message[]>([]);
  const ref = React.createRef<HTMLDivElement>();
  const [sub, setSub] = useState<number>();
  const [cookies, setCookie] = useCookies(['subject']);
  const [errMsg, setErrMsg] = useState<string>();

  const getAllMessages = (jwt: string, sub: number, setMessages: (messages:Message[]) => void, setLinks: (links: string[]) => void) => {
    getMessages(jwt, sub, setLinks)
      .then(res => {setMessages(res); setErrMsg(undefined);})
      .catch((err:Error) => {setErrMsg(err.message); setMessages([]);});
  }

  useEffect(() => {
    if (jwt && sub) {
      getAllMessages(jwt, sub, setMessages, setLinks);
      const timer = setInterval(() => getAllMessages(jwt, sub, setMessages, setLinks), 1000);
      return () => clearInterval(timer);
    }
  }, [jwt, sub, setLinks])

  useEffect(() => {
    if (cookies.subject) {
      setSub(cookies.subject as number)
    } else {
      console.log(`registering`);
      register().then(sub => {
        setSub(sub);
        setCookie("subject", sub, {path: '/',});
        console.log(`setting subject to: ${sub}`)
      });
    }
  }, [cookies, setCookie])

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  return (
    <div className="chat-body">
      {sub && <Entry {...other} tempSub={sub} jwt={jwt} users={users} className="chat-entry"/>}
      <div className="chat-messages"> 
          {
            sub && !errMsg && messages && messages.map((msg, i) => (
              <MessageBox users={users} ref={ref} key={i} message={msg} subject={sub}/>
            ))
          }
          {
            sub && errMsg && <MessageBox users={users} ref={ref} key="1" message={{from: -1, message: errMsg}} subject={sub}/>
          }
      </div>
      <div className="chat-jwt">
        {sub && <Jwt jwt={jwt} sub={sub} {...other}/>}
      </div>
    </div>
  );
}

interface MessageProps {
  message: Message,
  subject: number,
  users: User[],
}
const MessageBox = forwardRef<HTMLDivElement, MessageProps>(({message, users, subject}:MessageProps, ref) => {


  const isOwner = ():boolean => {
    if (message.from === subject) {
      return true;
    }
    return false;
  }

  const getClasses = ():string => {
    var classes = "message-box ";

    if (isOwner()) {
      classes += "message-owner "
    } else {
      classes += "message-other "
    }

    if (!message.to || message.to.length === 0) {
      classes += "message-all "
    }

    return classes;
  }

  const getName = (sub: number):string => {
    var name = "[Unknown]";
    users && users.length && users.forEach(u => {if (u.sub === sub) name = u.name})
    return name;
  }

  const getToNames = ():string => {

    if (!isOwner()) {
      return `From: ${getName(message.from)}` 
    }

    if (!message.to || message.to.length === 0) {
      return "To: All";
    }

    var to = "To: ";
    message.to.forEach(t => to += `${getName(t)}, `);

    return to.substr(0, to.length-2);
  }

  return (
    <>
      <div className="getflexing">
        { message.from + ""=== subject + "" && <div></div>}
        <div className={getClasses()}>
          <div>{getToNames()}</div>
          <div ref={ref}>{message.message}</div>
        </div>
      </div>
    </>
  );
});
