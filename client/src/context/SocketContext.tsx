import React, { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  createRoom: (username: string) => void;
  joinRoom: (username: string, code: string) => void;
  leaveRoom: () => void;
  roomCode: string;
  username: string;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

const serverURL = 'http://localhost:3000';

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [roomCode, setRoomCode] = useState<string>('');
  const [username] = useState<string>('player' + Math.floor(Math.random() * 10000).toString());
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

  const createRoom = (username: string) => {
    if (roomCode) {
      leaveRoom();
    }
    socketRef.current?.emit('requestCreateRoom', username);
  };

  const joinRoom = (username: string, code: string) => {
    if (code.length !== 4) {
      console.log("Invalid room code");
      return;
    } else if (code === roomCode) {
      console.log("Already in room");
      return;
    }
    socketRef.current?.emit('requestJoinRoom', username, code);
  };

  const leaveRoom = () => {
    if (roomCode) {
      socketRef.current?.emit('leaveRoom', roomCode);
      setRoomCode('');
      console.log('Left room.');
    } else {
      console.log("Not currently in a room.");
    }
  };

  return (
    <SocketContext.Provider value={{ socket, createRoom, joinRoom, leaveRoom, roomCode, username }}>
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