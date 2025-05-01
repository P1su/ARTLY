import { useState } from 'react';
import styles from './ChatbotWidget.module.css';
import chatbotIcon from '../../../assets/images/chatbot.png';
import chatbotProfile from '../../../assets/images/chatbotProfile.png';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '안녕하세요! 아뜰리입니다 :) 무엇을 도와드릴까요?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        { sender: 'user', text: inputValue },
        {
          sender: 'bot',
          text: '아뜰리에 대해 설명드리겠습니다. 잠시만 기다려 주세요.',
        },
      ]);
      setInputValue('');
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.iconWrapper} onClick={handleToggleChat}>
        <img src={chatbotIcon} alt="챗봇 아이콘" />
      </div>

      {isOpen && (
        <div className={styles.popupContainer}>
          <div className={styles.headerContainer}>
            <h3>ARTLY BOT</h3>
            <button className={styles.closeButton} onClick={handleToggleChat}>
              X
            </button>
          </div>

          <div className={styles.chatContainer}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.sender === 'bot'
                    ? styles.botMessageContainer
                    : styles.userMessageContainer
                }
              >
                {msg.sender === 'bot' ? (
                  <>
                    <img
                      src={chatbotProfile}
                      alt="챗봇 프로필"
                      className={styles.botProfile}
                    />
                    <div className={styles.botContent}>
                      <p className={styles.botName}>Artly</p>
                      <div className={styles.botBubble}>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.userBubble}>
                    <p>{msg.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.inputContainer}>
            <input
              className={styles.input}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="챗봇에게 물어보세요."
            />
            <button className={styles.sendButton} onClick={handleSendMessage}>
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
