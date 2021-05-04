export interface User {
    sub: string,
    name: string,
    roles: string[],
    active: boolean,
}

export interface JwtData {
  name: string,
  roles: string[],
  sub: string,
  active: boolean,
}

export interface ErrResponse {
  msg: string,
}

export interface Message {
    message: string,
    from: string,
    to?: string[],
}