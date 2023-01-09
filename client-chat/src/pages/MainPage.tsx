import React, { FormEventHandler, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const socketIO = io('http://localhost:8082');

const MainPage = () => {
  const [socketStatus, setSocketStatus] = useState<boolean>(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    setSocket(socketIO);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('connected!');
        setSocketStatus(true);
        socket.emit('new-user-joined');
      });

      // When new message received assign to messages state
      socket.on('new-message', (data) => {
        setMessages((prev) => [...prev, JSON.parse(data)]);
      });
    }
  }, [socket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputMessage = formData.get('input_message');

    if (inputMessage) {
      socket?.emit('send-message', JSON.stringify({ message: inputMessage }));
    }
  };

  return (
    <div className="flex flex-shrink flex-col px-10 py-5">
      <div className="text-lg">Status: </div>
      <div
        className={`text-3xl ${
          socketStatus ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {socketStatus ? 'Connected!' : 'Not Connected'}
      </div>
      <div className="mt-10 p-10 border-2 border-blue-100 w-[400px] h-[300px] overflow-x-hidden overflow-y-auto">
        {messages?.map((msg, index) => {
          return (
            <div
              key={index}
              className="border-b-2 border-black border-opacity-10 px-2 py-2 mt-2 text-sm"
            >
              {msg.message}
            </div>
          );
        })}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            className="border-2 border-blue-300 px-2 h-8"
            name="input_message"
          />
          <button className="mt-5 ml-5 bg-blue-500 px-3 py-1 text-md text-white w-24">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default MainPage;
