import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  token: localStorage.getItem('token') || null,
  isLoading: false,

  login: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

export const useChatStore = create((set, get) => ({
  chats: [],
  selectedChat: null,
  messages: [],
  isLoading: false,
  typingUsers: [],
  onlineUsers: [],

  setChats: (chats) => set({ chats }),

  setSelectedChat: (chat) => set({ selectedChat: chat }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) => {
    const messages = get().messages;
    set({ messages: [...messages, message] });
  },

  addTypingUser: (userId) => {
    const typingUsers = get().typingUsers;
    if (!typingUsers.includes(userId)) {
      set({ typingUsers: [...typingUsers, userId] });
    }
  },

  removeTypingUser: (userId) => {
    const typingUsers = get().typingUsers;
    set({ typingUsers: typingUsers.filter((id) => id !== userId) });
  },

  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),

  addOnlineUser: (userId) => {
    const onlineUsers = get().onlineUsers;
    if (!onlineUsers.includes(userId)) {
      set({ onlineUsers: [...onlineUsers, userId] });
    }
  },

  removeOnlineUser: (userId) => {
    const onlineUsers = get().onlineUsers;
    set({ onlineUsers: onlineUsers.filter((id) => id !== userId) });
  },

  setLoading: (isLoading) => set({ isLoading }),

  clearChat: () => set({ selectedChat: null, messages: [], typingUsers: [] }),
}));
