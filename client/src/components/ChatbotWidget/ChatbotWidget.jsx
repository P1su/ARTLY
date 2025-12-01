import { useState, useEffect, useRef } from 'react';
import { instance, userInstance } from '../../apis/instance.js';
import styles from './ChatbotWidget.module.css';
import { BsChatFill } from 'react-icons/bs'; // 아이콘 변경 가능 (예: BsChatDotsFill)
import { IoClose, IoSend } from 'react-icons/io5'; // IoCloseSharp -> IoClose, IcMessage 대체용 IoSend 권장
import IcMessage from '../../assets/svg/IcMessage.jsx'; // 기존 아이콘 사용 시 유지
import { useUser } from '../../store/UserProvider.jsx';

export default function ChatbotWidget() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 0,
      sender: 'bot',
      text: '안녕하세요! 아뜰리의 챗봇 Artlas입니다 :)\n무엇을 도와드릴까요?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const currentChat = useRef(null);
  const curInstance = user ? userInstance : instance;

  const getNextId = () => messages[messages.length - 1].id + 1;

  useEffect(() => {
    currentChat.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  }, [messages, isOpen]);

  const handleToggleChat = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const textQuery = async (text) => {
    const userMessage = {
      id: getNextId(),
      sender: 'user',
      text: text,
    };
    setMessages((prev) => [...prev, userMessage]);

    const gptReply = {
      id: getNextId() + 1,
      sender: 'bot',
      text: 'An error occured. Please report this to the service team.',
    };

    try {
      setIsLoading(true);
      const gptResponse = await curInstance.post('/api/chats', { text });
      gptReply.text = gptResponse.data;
    } catch (error) {
      console.error('Error occurred while querying GPT:', error);
    } finally {
      setIsLoading(false);
    }
    setMessages((prev) => [...prev, gptReply]);
  };

  const parseBold = (text) => {
    const parts = text.split(/(\*\*[^\*]+\*\*)/g);
    return parts.map((part) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        return <b key={content}>{content}</b>;
      }
      return part;
    });
  };

  const keyPressHanlder = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    const text = inputValue.trim();
    if (!text) return;

    textQuery(text);
    setInputValue('');
  };

  const handleInputFocus = (e) => {
    setTimeout(() => {
      e.target.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }, 300);
  };

  return (
    <>
      <div className={styles.chatbotContainer}>
        <button className={styles.chatbotButton} onClick={handleToggleChat}>
          <BsChatFill size={20} />
        </button>
      </div>

      {isOpen && (
        <>
          <div className={styles.chatbotOverlay} onClick={handleToggleChat} />
          <div className={styles.popupContainer}>
            <div className={styles.headerContainer}>
              <h3 className={styles.headerTitle}>Artly AI</h3>
              <button className={styles.closeButton} onClick={handleToggleChat}>
                <IoClose size={20} />
              </button>
            </div>

            <div className={styles.chatContainer}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.sender === 'bot'
                      ? styles.botMessageContainer
                      : styles.userMessageContainer
                  }
                  ref={currentChat}
                >
                  {msg.sender === 'bot' ? (
                    <>
                      <div className={styles.botProfile}>A</div>
                      <div className={styles.botContent}>
                        <p className={styles.botName}>Artlas</p>
                        <div className={styles.botBubble}>
                          {parseBold(msg.text)}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className={styles.userBubble}>{msg.text}</div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className={styles.botMessageContainer} ref={currentChat}>
                  <div className={styles.botProfile}>A</div>
                  <div className={styles.botContent}>
                    <p className={styles.botName}>Artlas</p>
                    <div className={styles.botBubble}>
                      답변을 생각 중입니다...
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                type='text'
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={keyPressHanlder}
                onFocus={handleInputFocus}
                placeholder='궁금한 내용을 입력하세요...'
              />
              <button className={styles.sendButton} onClick={handleSendMessage}>
                <IoSend size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
