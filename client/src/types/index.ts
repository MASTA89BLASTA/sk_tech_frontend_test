export type Message = {
    id: number,
    time: string,
    sender: string,
    text: string
};

export type MessagesList = Array<Message>;