import { create } from "zustand";

export const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),

  messages: [],
  setMessages: (messagesOrUpdater) =>
    set((state) => ({
      messages:
        typeof messagesOrUpdater === "function"
          ? messagesOrUpdater(state.messages)
          : messagesOrUpdater,
    })),

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
}));

export default useConversation;
