import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore, useChatStore } from './store';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket = null;

export const useSocket = () => {
  const user = useAuthStore((state) => state.user);
  const addMessage = useChatStore((state) => state.addMessage);
  const addTypingUser = useChatStore((state) => state.addTypingUser);
  const removeTypingUser = useChatStore((state) => state.removeTypingUser);
  const addOnlineUser = useChatStore((state) => state.addOnlineUser);
  const removeOnlineUser = useChatStore((state) => state.removeOnlineUser);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    if (!socket) {
      socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });
    }

    socketRef.current = socket;

    // Setup event listeners
    socket.emit('setup', user._id);

    socket.on('connected', () => {
      console.log('Connected to socket server');
    });

    socket.on('message received', (message) => {
      addMessage(message);
    });

    socket.on('typing', (data) => {
      if (data.userId !== user._id) {
        addTypingUser(data.userId);
      }
    });

    socket.on('stop typing', (data) => {
      removeTypingUser(data.userId);
    });

    socket.on('user-online', (data) => {
      if (data.isOnline && data.userId !== user._id) {
        addOnlineUser(data.userId);
      }
    });

    socket.on('user-offline', (data) => {
      if (!data.isOnline && data.userId !== user._id) {
        removeOnlineUser(data.userId);
      }
    });

    return () => {
      // Don't disconnect on unmount to keep receiving messages
    };
  }, [user, addMessage, addTypingUser, removeTypingUser, addOnlineUser, removeOnlineUser]);

  return socketRef.current;
};

export const getSocket = () => socket;
