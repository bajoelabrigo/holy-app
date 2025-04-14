import { Send, Smile, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useSendMessage from "../../../hooks/useSendMessage";
import EmojiPicker from "emoji-picker-react";
import Attachments from "./attachments/Attachments";
import VoiceRecorder from "../voice/VoiceRecorder";
import useConversation from "../../../zustand/useConversation";
import { useSocketContext } from "../../../context/SocketContext";
import { useSelector } from "react-redux";

const MessageInput = () => {
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const { sendMessage } = useSendMessage();
  const [showEmojiPicker, setShowEmojiPicker] = useState();
  const emojiPickerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage({ message });
    setMessage("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTyping = () => {
    if (selectedConversation?._id) {
      socket.emit("typing", {
        conversationId: selectedConversation._id,
        senderName: user.name, // o como tengas tu usuario
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex  mx-4 relative">
      <button
        type="button"
        onClick={() => {
          setShowAttachments(false);
          setShowEmojiPicker(!showEmojiPicker);
        }}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-sky-500 focus:outline-none"
      >
        {showEmojiPicker ? <X size={24} /> : <Smile size={24} />}
      </button>

      {/*Attachments */}
      <Attachments
        showAttachments={showAttachments}
        setShowAttachments={setShowAttachments}
        setShowPicker={setShowPicker}
      />
      <VoiceRecorder
        showAudioRecorder={showAudioRecorder}
        setShowAudioRecorder={setShowAudioRecorder}
        setShowPicker={setShowPicker}
      />
      <input
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          handleTyping(); // ✅ emitir "typing"
        }}
        className="flex-grow p-3 pl-30 rounded-l-3xl border-2 border-sky-500 
        focus:outline-none focus:ring-2 focus:ring-gray-300"
        placeholder="Type a message..."
      />

      <button
        type="submit"
        className="bg-blue-500 text-white p-3 rounded-r-lg 
        hover:bg-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        <Send size={24} />
      </button>
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-20 left-4">
          <EmojiPicker
            onEmojiClick={(emojiObject) => {
              setMessage((prevMessage) => prevMessage + emojiObject.emoji);
            }}
          />
        </div>
      )}
    </form>
  );
};

export default MessageInput;
