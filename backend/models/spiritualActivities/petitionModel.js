import mongoose from "mongoose";

const petitionSchema = new mongoose.Schema(
  {
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    petitionText: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Petition = mongoose.model("Petition", petitionSchema);

export default Petition;
