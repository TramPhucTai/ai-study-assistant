import RobotProfileImage from '../assets/robot.png'
import UserProfileImage from '../assets/profile-1.jpg'
import './ChatMessage.css'

export function ChatMessage({ message, sender, time }) {

  return (
    <div className={
      sender === 'user'
        ? 'chat-message-user'
        : 'chat-message-robot'
    }>
      {sender === 'robot' && (
        <img src={RobotProfileImage}className="chat-message-profile" />
      )}
      <div className="chat-message-text">
        <div>
          {message} {/* Message of user or bot */}
        </div>
        <div className="time-text">
          {time}
        </div>
      </div>
      
      {sender === 'user' && (
        <img src={UserProfileImage} className="chat-message-profile" />
      )}
    </div>
  );
}