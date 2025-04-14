import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "", // o un link por defecto
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
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      unique: true, // Para que cada grupo tenga una conversación única
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);
export default Group;
