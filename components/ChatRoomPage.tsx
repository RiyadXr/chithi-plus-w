
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, Message } from '../types';

interface ChatRoomPageProps {
  user: User;
  pin: string;
  onLeave: () => void;
}

const ChatRoomPage: React.FC<ChatRoomPageProps> = ({ user, pin, onLeave }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const storageKey = `chithi-room-${pin}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = useCallback(() => {
    try {
      const storedMessages = localStorage.getItem(storageKey);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  }, [storageKey]);

  useEffect(() => {
    loadMessages();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === storageKey) {
        loadMessages();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [storageKey, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: `${Date.now()}-${user.name}`,
      text: newMessage,
      sender: user.name,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[95vh] w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      <header className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-teal-400">Room: {pin}</h2>
          <p className="text-sm text-gray-400">Logged in as: {user.name}</p>
        </div>
        <button
          onClick={onLeave}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          Leave
        </button>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isCurrentUser = msg.sender === user.name;
            return (
              <div
                key={msg.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex flex-col max-w-xs md:max-w-md">
                   <span className={`text-xs text-gray-400 mb-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                      {msg.sender}
                    </span>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isCurrentUser
                        ? 'bg-teal-600 rounded-br-none'
                        : 'bg-gray-700 rounded-bl-none'
                    }`}
                  >
                    <p className="text-white">{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-gray-900 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold p-3 rounded-full transition duration-300 flex items-center justify-center"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
             </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatRoomPage;
