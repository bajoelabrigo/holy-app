import { create } from "zustand";

export const useConversation = create((set) => ({
  // Conversación seleccionada
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),

  // Mensajes por conversación (aislados por ID)
  messagesByConversation: {},

  // Reemplaza todos los mensajes de una conversación
  setMessagesForConversation: (conversationId, messages) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: messages,
      },
    })),

  // Agrega un mensaje nuevo a la conversación correspondiente
  addMessageToConversation: (conversationId, newMessage) =>
    set((state) => {
      const existingMessages =
        state.messagesByConversation[conversationId] || [];

      // ✅ Verifica si el mensaje ya existe por _id
      const alreadyExists = existingMessages.some(
        (msg) => msg._id === newMessage._id
      );

      if (alreadyExists) return {}; // no actualices el estado si ya está

      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: [...existingMessages, newMessage],
        },
      };
    }),

  // Archivos adjuntos
  files: [],
  setFiles: (filesOrUpdater) =>
    set((state) => ({
      files:
        typeof filesOrUpdater === "function"
          ? filesOrUpdater(state.files)
          : filesOrUpdater,
    })),

  removeFile: (indexToRemove) =>
    set((state) => ({
      files: state.files.filter((_, index) => index !== indexToRemove),
    })),

  // Limpiar estado
  resetConversation: () =>
    set({
      selectedConversation: null,
      messagesByConversation: {},
      files: [],
    }),

  //Efecto typing
  typingStatus: {},

  setTyping: (conversationId, userName) =>
    set((state) => {
      console.log("🧠 Zustand setTyping:", conversationId, "→", userName);
      return {
        typingStatus: {
          ...state.typingStatus,
          [conversationId]: userName,
        },
      };
    }),

  clearTyping: (conversationId) =>
    set((state) => {
      const updated = { ...state.typingStatus };
      delete updated[conversationId];
      return { typingStatus: updated };
    }),
}));

export default useConversation;
