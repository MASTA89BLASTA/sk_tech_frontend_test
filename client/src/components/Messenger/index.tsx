import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { mainActions } from "../../actions";
import { AppState } from "../../reducers";
import {
  getMainUsername,
  getMainMessagesList,
} from "../../selectors/mainSelector";
import { MessagesList } from "../../types";
// import styles from "./styles.css";
import { styled } from "@mui/system";
import { List, ListItem, Typography, TextField, Button } from "@mui/material";
import moment from "moment";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

const RootContainer = styled("div")({
  minWidth: "320px",
  maxWidth: "900px",
  maxHeight: "100vh",
  height: "100vh",
  margin: "auto",
  display: "flex",
  flexDirection: "column",
});



const MessagesListStyled = styled(List)({
  width: "100%",
  height: "100%",
  // padding: "14px",
  overflow: "auto",
  margin: "0px",
  boxSizing: "border-box",
  background: "#f7fafc",
  "& .MuiListItem-root": {
    position: "relative",
    margin: "-6px 0",
  },

});

const MessageItem = styled(ListItem)({
  listStyleType: "none",
  position: "relative",
  width: "100%",
  margin: "10px 0",
});

const MessageText = styled("div")({
  background: "#e1e8f0",
  padding: "8px",
  paddingRight: "32px",
  borderRadius: "4px",
  width: "100%",
  wordBreak: "break-all",
});

const MessageSender = styled("div")({
  fontSize: "12px",
  fontWeight: 600,
  color: "#4974ad",
});

const MessageTime = styled("span")({
  position: "absolute",
  right: "19px",
  bottom: "12px",
  fontSize: "12px",
  color: "#7b98ba",
});

const NoMessage = styled(ListItem)({
  width: "100%",
  listStyleType: "none",
  color: "gray",
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  lineHeight: "100px",
});

const NewMessagePanel = styled("form")({
  width: "100%",
  display: "flex",
  background: "#bfcdde",
  minHeight: "50px",
});

const UsernameContainer = styled("div")({
  padding: "0 8px",
  borderRight: "1px solid gray",
});

const UsernameLabel = styled("label")({
  fontSize: "12px",
  color: "gray",
});

const UsernameValue = styled("input")({
  border: "none",
  background: "none",
  width: "fit-content",
});

const MessageInput = styled("input")({
  width: "100%",
  border: "none",
  background: "none",
  padding: "10px",
  outline: "none",
});

const MessageSendButton = styled(Button)({
  background: "none",
  border: "none",
});

const SendImage = styled("img")({
  width: "20px",
  height: "20px",
});

export interface Props {
  username: string;
  messages: MessagesList;

  getMessagesList: Function;
  sendMessage: Function;
  changeUsername: Function;
}

const mapStateToProps = (state: AppState) => ({
  messages: getMainMessagesList(state),
  username: getMainUsername(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getMessagesList: () => dispatch(mainActions.mainMessagesListFetch()),
  sendMessage: (messageText: string, username: string) =>
    dispatch(mainActions.mainSendMessage(messageText, username)),
  changeUsername: (newUsername: string) =>
    dispatch(mainActions.mainChangeUsername(newUsername)),
});

const Home = (props: Props) => {
  const { username, messages, getMessagesList, sendMessage, changeUsername } =
    props;
  const [messageText, setmessageText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const messagesListRef = React.useRef(null);

  React.useEffect(() => {
    getMessagesList();
  }, []);

  React.useEffect(() => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
    }
  }, [messages]);

  React.useEffect(() => {
    socket.on("newMessage", newMessage => {
      sendMessage(newMessage.text, newMessage.sender);
    });

    socket.on("updateUsername", newUsername => {
      changeUsername(newUsername);
    });

    return () => {
      socket.off("newMessage");
      socket.off("updateUsername");
    };
  }, [sendMessage, changeUsername]);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.target.value;
    changeUsername(newUsername);
    socket.emit("changeUsername", newUsername);
  };
  const handleMessageSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (messageText) {
      try {
        const currentTime = moment().format("HH:mm");
        socket.emit("newMessage", {
          text: messageText,
          sender: username,
          time: currentTime,
        });
        setmessageText("");
        setError(null);
      } catch (error) {
        console.error("Error sending message:", error);
        setError("Failed to send message");
      }
    }
  };

  return (
    <RootContainer>
      <MessagesListStyled ref={messagesListRef}>
        {messages === null ? <NoMessage>Загрузка...</NoMessage> : null}
        {messages !== null && !messages.length ? (
          <NoMessage>Нет сообщений</NoMessage>
        ) : null}
        {messages !== null && messages.length
          ? messages.map(message => (
              <MessageItem key={message.id}>
                <MessageText>
                  <MessageSender>{message.sender}</MessageSender>
                  {message.text}
                </MessageText>
                <MessageTime>{message.time}</MessageTime>
              </MessageItem>
            ))
          : null}
      </MessagesListStyled>
      {error && <div>{error}</div>}
      <NewMessagePanel onSubmit={handleMessageSend}>
        <UsernameContainer>
          <UsernameLabel htmlFor="username">Ваше имя:</UsernameLabel>
          <UsernameValue
            name="username"
            value={username}
            size={10}
            onChange={handleUsernameChange}
          />
        </UsernameContainer>
        <MessageInput
          value={messageText}
          onChange={event => {
            setmessageText(event.target.value);
          }}
          placeholder="Введите сообщение"
          autoFocus
        />
        <MessageSendButton type="submit">
          <SendImage src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAADe0lEQVR4nO3bTahVVRQH8J8v6z0ry6KIPknySTUoSKIIIwJHhTRIaVDpLGyUM6EEkz5oFjWLRtnMaiQ0eSF9YkWkFGQEFYXSJ0WKPS2ft8G6l32M+/x47+x9jp77hzu55+y9/nvdvdde/7X3ZYQRRhhhBDvxNTbi4oa5NIIv0Ot/DuBlTDbKqDDukxww+BzDFFZjQXPUyuFtMfD38Sr+lpzxFTbggsbYFcCN+AczWCFiwRP4QXLEX3gJ1zfEMTteFAP9QJr2Y2IZTEmOmMEOrGqAY1Yswa9ikGuGPL8Nr2BacsZuPIZFhThmxwYxsB9x/izvXIFN2Cc54he8gGsLcMyKc7BHDOqpk7x7HtZil+SII9iOuzJyzI57xWAO4bpTbLMC2/Cv5IzPsA7nZuCYHW+KQWw7zXZX4mn8Ljnip/53l9VJMDeWimB3DCvn0H5c/PpfSo44LBx6S00cs+M5aSqPzaOflSIuHJWc8aGIHwvnyTErLsR+QfjRGvq7QewUf0qO+FbsKJfW0H8WrJPW8UU19blY5A57JUccFDnGzTXZqA0L8LEg+WzNfY+JbHKHiDWtFWF3CmKHsSyTjeVCZxySZsU3Qo+0QoS9Lki9kdlOa0XY1WKd9pQRQa0UYZv7RPaIlLkUWiPCFuH7PoEtmChpXGSZW/Gz40XY1v6zIlhbMf6HqB+WzuzGsR6fV7gcEXHq9hIEHsanFeM9fCKm5OISBCq4W+iWapb5ER5SQITdJDK73yrGp0Xau0rZfbxRETYulsaUlND0xFnDJlyem8D/uDQqwpYJr1f38UGRZLWyu0ejImwhHhD7dpXAu7kND8GkCNYHKjzeY34Sd67oNWBzGLLxmNTBJTBbENyrfBCcUDAItmkbvErBbbDTidCaiqHOpcITOi6GBnJ4tw7K4WpB5J4C9lpXEBmUxLZnttPKktigKDqdkURri6LVsvgzNfc9rCw+o2Vl8fWC2D5xUlQHzpiDkerR2CM19Heio7FLaui/djwvSO4yv+l4Rh6OVo/H75hD+6KiJAfeEqRfO812RUVJLgyuyBwUAzoVnDVXZKqXpJ48ybtn5SWpx8VAvjO72DnRNblrCnDMhiVScePBIc9bIUpyYnBVdmflu9aJklwYXJY+ilu1VJTkRKevy9/v+PpeK0VJTnT+LzPv6PifpkYYYYQROon/AMqXkYAs2UHIAAAAAElFTkSuQmCC" />
        </MessageSendButton>
      </NewMessagePanel>
    </RootContainer>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
