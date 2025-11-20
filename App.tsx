
import React, { useState, useCallback } from 'react';
import HomePage from './components/HomePage';
import JoinRoomPage from './components/JoinRoomPage';
import ChatRoomPage from './components/ChatRoomPage';
import { Page, User } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [user, setUser] = useState<User | null>(null);
  const [roomPin, setRoomPin] = useState<string>('');

  const handleStartAnonymousChat = useCallback(() => {
    setCurrentPage(Page.Join);
  }, []);

  const handleJoinRoom = useCallback((name: string, pin: string) => {
    setUser({ name });
    setRoomPin(pin);
    setCurrentPage(Page.Chat);
  }, []);

  const handleLeaveRoom = useCallback(() => {
    setUser(null);
    setRoomPin('');
    setCurrentPage(Page.Home);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage onStartAnonymousChat={handleStartAnonymousChat} />;
      case Page.Join:
        return <JoinRoomPage onJoin={handleJoinRoom} />;
      case Page.Chat:
        if (user && roomPin) {
          return <ChatRoomPage user={user} pin={roomPin} onLeave={handleLeaveRoom} />;
        }
        // Fallback to home if state is invalid
        handleLeaveRoom();
        return <HomePage onStartAnonymousChat={handleStartAnonymousChat} />;
      default:
        return <HomePage onStartAnonymousChat={handleStartAnonymousChat} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-4">
      {renderPage()}
    </div>
  );
};

export default App;
