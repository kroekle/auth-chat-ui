export interface User {
    sub: number,
    name: string,
    roles: string[],
    active: boolean,
    blocking?: boolean,
    blocked?: boolean,
}

export interface JwtData {
  name: string,
  roles: string[],
  sub: number,
  active: boolean,
}

export interface Message {
    message: string,
    from: number,
    to?: number[],
}

export class Empty {

}

export class Active {
  static ACTIVE(ACTIVE: any) {
    throw new Error('Method not implemented.');
  }
  static OFF_LINE(OFF_LINE: any) {
    throw new Error('Method not implemented.');
  }
  static IGNORING_YOU(IGNORING_YOU: any) {
    throw new Error('Method not implemented.');
  }

}

export class Person {
  getActive(): Active {
    throw new Error('Method not implemented.');
  }
  getName(): import("react").ReactNode {
    throw new Error('Method not implemented.');
  }
  setName(myName: string) {
    throw new Error('Method not implemented.');
  }
  setActive(ACTIVE: any) {
    throw new Error('Method not implemented.');
  }

}

export class Register {
  setPerson(person: Person) {
    throw new Error('Method not implemented.');
  }

}


export class People {
  getPersonList(): Array<Person> {
    throw new Error('Method not implemented.');
  }

}

// export class Message {
//   setSender(sender: Person) {
//     throw new Error('Method not implemented.');
//   }
//   setText(text: string) {
//     throw new Error('Method not implemented.');
//   }
//   getSender():Person {
//     throw new Error('Method not implemented.');
//   }
//   getText(): import("react").ReactNode {
//     throw new Error('Method not implemented.');
//   }

// }

