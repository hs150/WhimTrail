import { useState, useEffect, useRef, useCallback } from 'react';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';
import '../../styles/chat.css';

export default function ChatSupport() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');

  // ✅ define fetchChats first, wrapped in useCallback
  const fetchChats = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/user/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setChats(Array.isArray(data) ? data : []);
      if (data.length > 0 && !selectedChat) {
        setSelectedChat(data[0]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  }, [token, selectedChat]);

  // ✅ now use it inside useEffect
  useEffect(() => {
    if (token) fetchChats();
  }, [token, fetchChats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  const createNewChat = async () => {
    if (!token) {
      alert('Please login to start a chat');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic: 'General' }),
      });
      const newChat = await response.json();
      setChats([newChat, ...chats]);
      setSelectedChat(newChat);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat || !token) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/chat/${selectedChat._id}/message`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message, sender: 'user' }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSelectedChat(data.chat);
        setMessage('');

        // Simulate AI response
        setTimeout(() => {
          const updatedChat = {
            ...data.chat,
            messages: [
              ...data.chat.messages,
              {
                _id: Date.now(),
                sender: 'ai',
                message:
                  'Thanks for your message! Our team will respond shortly.',
                timestamp: new Date(),
              },
            ],
          };
          setSelectedChat(updatedChat);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container" style={{ marginTop: '80px' }}>
      <div className="chat-sidebar">
        <button className="btn-new-chat" onClick={createNewChat}>
          + New Chat
        </button>

        <div className="chats-list">
          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`chat-item ${
                selectedChat?._id === chat._id ? 'active' : ''
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="chat-icon">
                <FaRobot />
              </div>
              <div className="chat-preview">
                <h4>{chat.topic}</h4>
                <p>
                  {chat.messages[chat.messages.length - 1]?.message?.substring(
                    0,
                    30
                  ) || 'No messages'}
                </p>
              </div>
              <span className={`status ${chat.status.toLowerCase()}`}>
                {chat.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <h2>
                {selectedChat.topic} - {selectedChat.status}
              </h2>
            </div>

            <div className="chat-messages">
              {selectedChat.messages.length > 0 ? (
                selectedChat.messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.sender}`}>
                    <div className="message-content">
                      <p>{msg.message}</p>
                      <small>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-chat">
                  <FaRobot size={48} style={{ opacity: 0.3 }} />
                  <p>Start a conversation</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading}>
                <FaPaperPlane /> {loading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat">
            <FaRobot size={64} style={{ opacity: 0.3 }} />
            <p>Select a chat or start a new conversation</p>
            <button onClick={createNewChat} className="btn-start-chat">
              Start Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}