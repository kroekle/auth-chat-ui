// import { ChatServiceClient } from '../../gen/chat_grpc_web_pb';

import { Register } from "../../Types";

import { Person } from "../../Types";

import { Message } from "../../Types";

class Stream {
  on(kind: string, fun: any):void {}
  cancel() {}
}

class ChatServiceClient {
  getActivePeople(arg0: any, arg1: {}, arg2: (_err: any, res: any) => void) {
  }
  registerAndStream(reg: Register, arg1: {}): Stream {return new Stream()};
  changeStatus(person: Person, arg1: {}, arg2: () => void): void {};
  sendMessage(message: Message, arg1: {}, arg2: () => void): void {};

}

const localDev = 'http://localhost:9095';

// if you would want to run the services on a different host, use something like the following
// const normalUrl = `https://${window.location.hostname.replace('chat', 'chat-rpc')}:443`;
const normalUrl = `http://${window.location.hostname}:80`;

const fullUrl = window.location.host.includes('localhost')?localDev:normalUrl;
// const chat:ChatServiceClient = new ChatServiceClient(fullUrl, null, null);
const chat:ChatServiceClient = new ChatServiceClient();


export class GrpcClients {

  static chat = ():ChatServiceClient => {
    return chat;
  }
}
