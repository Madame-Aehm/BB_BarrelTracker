import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  pin: { type: String, required: true },
  recovery: {
    type: Object,
    code: { type: String, required: () => this.expires !== null },
    expires: { type: Date, required: () => this.code !== null }
  },
  failedAttempts: {
    count: { type: Number, default: 0 },
    lastAttempt: { type: Date, default: null },
    lockedUntil: { type: Date, default: null }
  }
});

export default mongoose.model("auth", schema, "auth");