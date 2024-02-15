import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { mainActions } from '../../actions';
import { AppState } from '../../reducers';
import { 
    getMainUsername,
    getMainMessagesList,
} from '../../selectors/mainSelector';
import { MessagesList } from '../../types';
import styles from './styles.css';

export interface Props {
    username: string
    messages: MessagesList

    getMessagesList: Function
    sendMessage: Function
    changeUsername: Function
}

const mapStateToProps = (state: AppState) => ({
    messages: getMainMessagesList(state),
    username: getMainUsername(state),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    getMessagesList: () => dispatch(mainActions.mainMessagesListFetch()),
    sendMessage: (messageText: string, username: string) => dispatch(mainActions.mainSendMessage(messageText, username)),
    changeUsername: (newUsername: string) => dispatch(mainActions.mainChangeUsername(newUsername)),
});

const Home = (props: Props) => {
    const {
        username,
        messages,
        getMessagesList,
        sendMessage,
        changeUsername
    } = props;
    const [messageText, setmessageText] = React.useState('');
    const messagesListRef = React.useRef(null);

    React.useEffect(() => {
        getMessagesList();
    }, []);
    
    React.useEffect(() => {
        if (messagesListRef.current) {
          messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
        }
      }, [messages]);
    
    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        changeUsername(event.target.value);
    };
    const handleMessageSend = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (messageText) {
            sendMessage(messageText, username);
            setmessageText('');
        }
    };
    
    return (
        <div className={styles.root}>
            <ul className={styles.messagesList} ref={messagesListRef}>
                {
                    messages === null
                        ? <li className={styles.noMessage}>Загрузка...</li>
                        : null
                }
                {
                    messages !== null && !messages.length
                        ? <li className={styles.noMessage}>Нет сообщений</li>
                        : null
                }
                {
                    messages !== null && messages.length
                        ? messages.map(message =>
                            <li className={styles.messageItem}>
                                <div className={styles.messageText}>
                                    <div className={styles.messageSender}>
                                        {message.sender}
                                    </div>
                                    {message.text}
                                </div>
                                <span className={styles.messageTime}>
                                    {message.time}
                                </span>
                            </li>
                        )                        
                        : null
                }
            </ul>
            <form className={styles.newMessagePanel} onSubmit={handleMessageSend}>
                <div className={styles.usernameContainer}>
                    <label
                        className={styles.usernameLabel}
                        htmlFor="username"
                    >
                        Ваше имя:
                    </label>
                    <input
                        name="username"
                        value={username}
                        className={styles.usernameValue}
                        size={10}
                        onChange={handleUsernameChange}
                    />
                </div>
                <input
                    className={styles.messageInput}
                    value={messageText}
                    onChange={(event) => {
                        setmessageText(event.target.value);
                    }}
                    placeholder="Введите сообщение"
                    autoFocus
                />
                <button
                    
                    className={styles.messageSendButton}
                >
                    <img
                        className={styles.sendImage}
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAADe0lEQVR4nO3bTahVVRQH8J8v6z0ry6KIPknySTUoSKIIIwJHhTRIaVDpLGyUM6EEkz5oFjWLRtnMaiQ0eSF9YkWkFGQEFYXSJ0WKPS2ft8G6l32M+/x47+x9jp77hzu55+y9/nvdvdde/7X3ZYQRRhhhBDvxNTbi4oa5NIIv0Ot/DuBlTDbKqDDukxww+BzDFFZjQXPUyuFtMfD38Sr+lpzxFTbggsbYFcCN+AczWCFiwRP4QXLEX3gJ1zfEMTteFAP9QJr2Y2IZTEmOmMEOrGqAY1Yswa9ikGuGPL8Nr2BacsZuPIZFhThmxwYxsB9x/izvXIFN2Cc54he8gGsLcMyKc7BHDOqpk7x7HtZil+SII9iOuzJyzI57xWAO4bpTbLMC2/Cv5IzPsA7nZuCYHW+KQWw7zXZX4mn8Ljnip/53l9VJMDeWimB3DCvn0H5c/PpfSo44LBx6S00cs+M5aSqPzaOflSIuHJWc8aGIHwvnyTErLsR+QfjRGvq7QewUf0qO+FbsKJfW0H8WrJPW8UU19blY5A57JUccFDnGzTXZqA0L8LEg+WzNfY+JbHKHiDWtFWF3CmKHsSyTjeVCZxySZsU3Qo+0QoS9Lki9kdlOa0XY1WKd9pQRQa0UYZv7RPaIlLkUWiPCFuH7PoEtmChpXGSZW/Gz40XY1v6zIlhbMf6HqB+WzuzGsR6fV7gcEXHq9hIEHsanFeM9fCKm5OISBCq4W+iWapb5ER5SQITdJDK73yrGp0Xau0rZfbxRETYulsaUlND0xFnDJlyem8D/uDQqwpYJr1f38UGRZLWyu0ejImwhHhD7dpXAu7kND8GkCNYHKjzeY34Sd67oNWBzGLLxmNTBJTBbENyrfBCcUDAItmkbvErBbbDTidCaiqHOpcITOi6GBnJ4tw7K4WpB5J4C9lpXEBmUxLZnttPKktigKDqdkURri6LVsvgzNfc9rCw+o2Vl8fWC2D5xUlQHzpiDkerR2CM19Heio7FLaui/djwvSO4yv+l4Rh6OVo/H75hD+6KiJAfeEqRfO812RUVJLgyuyBwUAzoVnDVXZKqXpJ48ybtn5SWpx8VAvjO72DnRNblrCnDMhiVScePBIc9bIUpyYnBVdmflu9aJklwYXJY+ilu1VJTkRKevy9/v+PpeK0VJTnT+LzPv6PifpkYYYYQROon/AMqXkYAs2UHIAAAAAElFTkSuQmCC"
                    />
                </button>
            </form>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
