
import React, { useState } from 'react';

interface JoinRoomPageProps {
  onJoin: (name: string, pin: string) => void;
}

const JoinRoomPage: React.FC<JoinRoomPageProps> = ({ onJoin }) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length === 0) {
      setError('Please enter your name.');
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 digits.');
      return;
    }
    setError('');
    onJoin(name, pin);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
    }
  };

  return (
    <div className="w-full max-w-sm p-8 bg-gray-800 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-teal-400 mb-6">Join a Room</h2>
      <form onSubmit={handleJoin} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            maxLength={20}
          />
        </div>
        <div>
          <label htmlFor="pin" className="block text-sm font-medium text-gray-300 mb-2">
            4-Digit PIN
          </label>
          <input
            id="pin"
            type="text"
            inputMode="numeric"
            value={pin}
            onChange={handlePinChange}
            placeholder="1234"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Enter Chat
        </button>
      </form>
    </div>
  );
};

export default JoinRoomPage;
