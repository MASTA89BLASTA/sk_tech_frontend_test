export type Message = {
    // id: number,
    time: string,
    sender: string,
    text: string
};

// export type MessageWithoutId = Omit<Message, 'id'>;
export type MessagesList = Array<Message>;