import { useState } from 'react'
import LoadingSpinnerGif from '../assets/loading-spinner.gif'
import { Chatbot } from 'supersimpledev'
import dayjs from 'dayjs'
import './ChatInput.css'


export function ChatInput({ chatMessages, setChatMessages }) {

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function saveInputText(event) {
    setInputText(event.target.value);
  }

  async function sendMessage() {
    if (isLoading || !inputText) return;

    setIsLoading(true);

    setInputText('');

    const currentTime = dayjs().format('h:mma');

    const newChatMessages = [
      ...chatMessages,
      {
        message: inputText,
        time: currentTime, 
        sender: 'user',
        id: crypto.randomUUID()
      }
    ];

    setChatMessages([
      ...newChatMessages,
      // This creates a temporary Loading... message.
      // Because we don't save this message in newChatMessages, it will be remove later, when we add the response.
      {
        message: <img src={LoadingSpinnerGif} className="loading-spinner-image" />,
        time: '', 
        sender: 'robot',
        id: crypto.randomUUID()
      }
    ]);

    const response = await Chatbot.getResponseAsync(inputText);

    setChatMessages([
      ...newChatMessages,
      {
        message: response,
        time: currentTime,
        sender: 'robot',
        id: crypto.randomUUID()
      }
    ]);

    setIsLoading(false);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      sendMessage();
    } else if (event.key === 'Escape') {
      setInputText('');
    }
  }

  function clearMessages() {
    setChatMessages([]) 
    localStorage.removeItem('messages');
  }


  return ( /* <input/> is shortcut for: <input></input> */
    <div className="chat-input-container">
      <input
        placeholder="Send a message to Chatbot"
        size="30"
        onChange={saveInputText}
        value={inputText}
        onKeyDown={handleKeyDown}
        className="chat-input"
      />
      <button
        onClick={sendMessage}
        className="send-btn"
      >Send</button>
      <button
        onClick={clearMessages}
        className="clear-btn"
      >Clear</button>
    </div>
  );
}