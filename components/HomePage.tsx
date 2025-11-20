
import React from 'react';

interface HomePageProps {
  onStartAnonymousChat: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartAnonymousChat }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-2xl">
      <h1 className="text-5xl font-bold text-teal-400 mb-2">Chithi+</h1>
      <p className="text-gray-400 mb-8">Simple. Anonymous. Instant.</p>
      <div className="w-full flex flex-col space-y-4">
        <button
          onClick={onStartAnonymousChat}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Chat Anonymously
        </button>
        <div className="relative w-full">
          <button
            disabled
            className="w-full bg-gray-600 text-gray-400 font-bold py-3 px-4 rounded-lg cursor-not-allowed shadow-md"
          >
            Login
          </button>
          <span className="absolute top-1/2 right-4 -translate-y-1/2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
