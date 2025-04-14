// models/chat/groupModel.js
import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId, // igual al ID de la conversación
      ref: "Conversation",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Grupo",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);
export default Group;
