import { useState, useEffect, useRef } from 'react';
import { userInstance } from '../../apis/instance.js';
import styles from './ChatbotWidget.module.css';
import chatbotIcon from './mock/chatbot.png';
import chatbotProfile from './mock/chatbotProfile.png';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 0,
      sender: 'bot',
      text: '안녕하세요! 아뜰리의 챗봇 Artlas입니다 :) 무엇을 도와드릴까요?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false); // state for loading gpt response
  const currentChat = useRef(null);

  const getNextId = () => messages[messages.length - 1].id + 1;

  useEffect(() => {
    currentChat.current !== null &&
      currentChat.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
  }, [currentChat.current, messages]);
  // load user chat history from server on component mount
  /*
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await userInstance.get('/api/chats/me');

        console.log('채팅 내역 불러오기 응답:', res.data);
        // 200 - set messages with the response data
        setMessages(
          Array.isArray(res.data)
            ? res.data.map((msg) => ({
                id: msg.id,
                sender: msg.role === 'assistant' ? 'bot' : 'user',
                text: msg.content,
              }))
            : [],
        );
      } catch (err) {
        setMessages([
          {
            id: 0,
            sender: 'bot',
            text:
              err.response && err.response.status === 404
                ? '안녕하세요! 아뜰리의 챗봇 Artlas입니다 :) 무엇을 도와드릴까요?' // 404 - no chat history, set default
                : '채팅 내역을 불러오지 못했습니다. 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          },
        ]);
      }
    };

    fetchChats();
  }, []);*/

  const handleToggleChat = () => {
    setIsOpen((prev) => !prev);
    if (isOpen) {
      document.body.style.overflow = 'unset';
    } else {
      document.body.style.overflow = 'hidden';
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to handle text query to GPT
  const textQuery = async (text) => {
    const userMessage = {
      id: getNextId(),
      sender: 'user',
      text: text,
    };
    // display user message immediately
    setMessages((prev) => [...prev, userMessage]);
    console.log('messages:\n', messages);

    const textQueryVariables = { text };
    const gptReply = {
      id: getNextId(),
      sender: 'bot',
      text: 'An error occured. Please report this to the service team.',
    };

    try {
      setIsLoading(true); // Set loading state to true before sending request
      const gptResponse = await userInstance.post(
        '/api/chats',
        textQueryVariables,
      );
      let msgText = gptResponse.data;

      console.log('GPT Response:\n', gptResponse.data);
      gptReply.text = msgText;
    } catch (error) {
      console.error('Error occurred while querying GPT:', error);
    } finally {
      setIsLoading(false); // Set loading state to false after request is complete
    }

    // display bot reply after receiving response
    setMessages((prev) => [...prev, gptReply]);

    console.log('Updated messages:\n', messages);
  };

  // Function to parse bold text of GPT response
  const parseBold = (text) => {
    const parts = text.split(/(\*\*[^\*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <b key={idx}>{part.slice(2, -2)}</b>;
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
    if (!text) return alert('텍스트를 입력해주세요!');

    textQuery(text);
    setInputValue('');
  };

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.iconWrapper} onClick={handleToggleChat}>
        <img src={chatbotIcon} alt='챗봇 아이콘' />
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
                    <img
                      src={chatbotProfile}
                      alt='챗봇 프로필'
                      className={styles.botProfile}
                    />
                    <div className={styles.botContent}>
                      <p className={styles.botName}>Artly</p>
                      <div className={styles.botBubble}>
                        <p>{parseBold(msg.text)}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.userMessageContainer}>
                    <div className={styles.userBubble}>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className={styles.botMessageContainer} ref={currentChat}>
                <img
                  src={chatbotProfile}
                  alt='챗봇 프로필'
                  className={styles.botProfile}
                />
                <div className={styles.botContent}>
                  <p className={styles.botName}>Artly</p>
                  <div className={styles.botBubble}>
                    <p>챗봇이 답변을 생성하고 있어요. 잠시만 기다려주세요</p>
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
              placeholder='챗봇에게 물어보세요.'
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
