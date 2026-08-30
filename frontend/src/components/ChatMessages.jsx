import { useRef, useEffect } from 'react'
import { ChatMessage } from './ChatMessage';
import './ChatMessages.css'

function useAutoScroll(dependencies) {
  const containerRef = useRef(null);

  useEffect(() => {
    const containerElem = containerRef.current;

    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight; /* Scroll all the way to the bottom */
    }

  }, dependencies);

  return containerRef;
}

function ChatMessages({ chatMessages }) {
  const chatMessagesRef = useAutoScroll([chatMessages])

  return (
    <div
      className="chat-message-container"
      ref={chatMessagesRef}
    >
      {chatMessages.map((chatMessage) => {
        return (
          <ChatMessage
            message={chatMessage.message}
            time={chatMessage.time}
            sender={chatMessage.sender}
            key={chatMessage.id} // Keys help React track changes in the array
          />
        );
      })}
      
    </div>
  );
}

export default ChatMessages;