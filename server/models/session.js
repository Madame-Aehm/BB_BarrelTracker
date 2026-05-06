import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "auth" },
    sessionId: { type: String, required: true, unique: true, index: true },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true }
);

schema.index({ userId: 1, sessionId: 1 });

export default mongoose.model("session", schema);
