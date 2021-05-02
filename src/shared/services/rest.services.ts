import { Message, User } from "../../Types"

export const getUser = async (jwt: string, sub: number): Promise<User> => {
    const res = await fetch('/users', 
    {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${jwt}`
            },
    });
    return res.json();
}

export const register = async (): Promise<number> => {
    const res = await fetch('/users/register', {method: 'POST'});
    const res_1 = await res.json();
    return (res_1 as {subject:number}).subject;
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
    await fetch(`/messages`, 
    {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${jwt}`
            },
    });
    return;
}

export const getMessages = async (jwt: string, tempSub: number, setLinks: (links: string[]) => void): Promise<Message[]> => {
    const res = await fetch(`/messages?sub=${tempSub}`, 
    {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${jwt}`
            },
    });

    res.headers.has("links") && setLinks(res.headers.get("links")!.split("|"))

    return res.json()
}
