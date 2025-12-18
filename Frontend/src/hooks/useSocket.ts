import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}


interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  myUserId: string | null;
  messages: Message[];
  registerUser: (userId: string) => void;
  sendMessage: (receiverId: string, text: string) => void;
  connectionError: string | null;
}

export function useSocket(serverUrl: string = 'http://localhost:4000'): UseSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to Socket.io server
    const socketInstance = io(`${serverUrl}/private-chat`, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    // Connection events
    socketInstance.on('connect', () => {
      console.log('Connected to chat server');
      setIsConnected(true);
      setConnectionError(null);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    // Registration events
    socketInstance.on('registrationSuccess', (data: { userId: string }) => {
      console.log('Registration successful:', data.userId);
      setMyUserId(data.userId);
    });

    // Message events
    socketInstance.on('privateMessage', (message: { senderId: string; text: string; messageId?: string }) => {
      console.log('Received private message:', message);
      const newMessage: Message = {
        id: message.messageId || Date.now().toString(),
        senderId: message.senderId,
        receiverId: myUserId || 'unknown',
        text: message.text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, newMessage]);
    });

    socketInstance.on('messageSent', (status: { messageId: string; to: string }) => {
      console.log('Message sent:', status);
    });

    socketInstance.on('messageFailed', (data: { message: string; receiverId: string }) => {
      console.error('Message failed:', data);
      setConnectionError(`Failed to send: ${data.message}`);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [serverUrl]);

  const registerUser = useCallback((userId: string) => {
    if (socketRef.current) {
      console.log('Registering user:', userId);
      socketRef.current.emit('registerUser', { userId });
    }
  }, []);

  const sendMessage = useCallback((receiverId: string, text: string) => {
    if (socketRef.current && myUserId) {
      const messageData = {
        text,
        receiverId,
        senderId: myUserId,
      };
      console.log('Sending message:', messageData);
      socketRef.current.emit('sendPrivateMessage', messageData);
      
      // Add to local messages (optimistic update)
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: myUserId,
        receiverId,
        text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, newMessage]);
    }
  }, [myUserId]);

  return {
    socket,
    isConnected,
    myUserId,
    messages,
    registerUser,
    sendMessage,
    connectionError,
  };
}
