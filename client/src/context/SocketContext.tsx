import React, { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  setUsername: (username: string) => void;
  setRoomCode: (roomCode: string) => void;
  roomCode: string;
  username: string;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

const serverURL = 'http://localhost:3000';

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [roomCode, setRoomCode] = useState<string>(() => localStorage.getItem('roomCode') || '');
  const [username, setUsername] = useState<string>(() => localStorage.getItem('username') || '');
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(serverURL);

    newSocket.on('connect', () => {
      console.log("Connected to server. id:", newSocket.id);
      socketRef.current = newSocket;
      setSocket(newSocket); // Set the socket only after connection
    });
    
    // Cleanup function to disconnect the socket on component unmount
    return () => {
      if (socketRef.current) {
        console.log("Disconnecting socket");
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null); // Reset the socket state on disconnect
      }
    };
  }, []);

  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    }
  }, [username]);

  return (
    <SocketContext.Provider value={{ socket, setRoomCode, setUsername, roomCode, username }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}