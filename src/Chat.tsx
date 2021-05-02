/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect, forwardRef } from 'react';

import './Chat.css';
import { Message, User} from './Types';
import Jwt from './Jwt';
import { register, getMessages } from './shared/services/rest.services';
import Entry from './Entry';
import { useCookies } from 'react-cookie';

const getAllMessages = (jwt: string, sub: number, setMessages: (messages:Message[]) => void, setLinks: (links: string[]) => void) => {
  getMessages(jwt, sub, setLinks)
    .then(res => setMessages(res));
}

interface Props {
  jwt: string,
  setJwt: (jwt: string) => void,
  users: User[],
  setLinks: (links: string[]) => void
}
export default ({users, jwt, setLinks, ...other}:Props) => {

  const [messages, setMessages] = useState<Message[]>([]);
  const ref = React.createRef<HTMLDivElement>();
  const [sub, setSub] = useState<number>();
  const [cookies, setCookie] = useCookies(['subject']);

  useEffect(() => {

    if (jwt && sub) {
      getAllMessages(jwt, sub, setMessages, setLinks);
      const timer = setInterval(() => getAllMessages(jwt, sub, setMessages, setLinks), 1000);
      return () => clearInterval(timer);
    }
  }, [jwt, sub, setLinks])

  useEffect(() => {
    if (cookies.subject) {
      console.log(`existing subject: ${cookies.subject}`);
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
    <div className="Body">
      {sub && <Entry {...other} tempSub={sub} jwt={jwt} users={users} className="chat-entry"/>}
      <div className="chat-messages"> 
          {
            sub && messages && messages.map((msg, i) => (
              <MessageBox ref={ref} key={i} message={msg} subject={sub}/>
            ))
          }
      </div>
      <div className="chat-jwt">
        {sub && <Jwt sub={sub} {...other}/>}
      </div>
    </div>
  );
}

interface MessageProps {
  message: Message,
  subject: number,
}
const MessageBox = forwardRef<HTMLDivElement, MessageProps>(({message, subject}:MessageProps, ref) => {

  const getClasses = ():string => {
    var classes = "message-box ";

    //TODO: need to figure this out later
    // console.log(`from: '${message.from}' subject: '${subject}'`)
    if (message.from + "" === subject + "") {
      // console.log(`owner`)
      classes += "message-owner "
    } else {
      // console.log(`not owner`)
      classes += "message-other "
    }

    if (!message.to || message.to.length === 0) {
      classes += "message-all "
    }

    return classes;
  }

  return (
    <>
      <div className="getflexing">
        { message.from + ""=== subject + "" && <div></div>}
        <div className={getClasses()}>
          <div>To: {message.to && message.to.length !== 0?message.to:'All'}</div>
          <div ref={ref}>{message.message}</div>
        </div>
      </div>
    </>
  );
});
