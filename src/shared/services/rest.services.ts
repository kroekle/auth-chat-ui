import { ErrResponse, Message, User } from "../../Types"

export const register = async (): Promise<string> => {
    const res = await fetch('/users/register', {method: 'POST'});
    const res_1 = await res.json();
    return (res_1 as {subject:string}).subject;
}

export const getUsers = async (jwt: string): Promise<User[]> => {
    const res = await fetch('/users', 
    {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${jwt}`
            },
    });

    if (!res.ok) {
        const errMsg: ErrResponse = await res.json();
        throw new Error(errMsg.msg);
    }
    return res.json();
}

export const setUser = async (jwt: string, user: User): Promise<void> => {
    await fetch(`/users/${user.sub}`, 
    {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${jwt}`
            },
        body: JSON.stringify(user),
    });
    return;
}

export const sendMessage = async (jwt: string, message: Message): Promise<void> => {
    const res = await fetch(`/messages`, 
    {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${jwt}`
            },
    });
    if (!res.ok) {
        const errMsg: ErrResponse = await res.json();
        throw new Error(errMsg.msg);
    }
    return Promise.resolve();
}

export const getMessages = async (jwt: string, sub: string, setLinks: (links: string[]) => void): Promise<Message[]> => {
    const res = await fetch(`/messages?sub=${sub}`, 
    {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${jwt}`
            },
    });

    res.headers.has("links") && setLinks(res.headers.get("links")!.split("|"))

    if (!res.ok) {
        const errMsg: ErrResponse = await res.json();
        throw new Error(errMsg.msg);
    }
    return res.json()
}

export const getDecisions = async (): Promise<any[]> => {
    const res = await fetch(`/decisions`);

    if (!res.ok) {
        const errMsg: ErrResponse = await res.json();
        throw new Error(errMsg.msg);
    }
    return res.json();
}
