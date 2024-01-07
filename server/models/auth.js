import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  pin: { type: String, required: true },
  recovery: {
    type: Object,
    code: { type: String, required: () => this.expires !== null },
    expires: { type: Date, required: () => this.code !== null }
   }
});

export default mongoose.model("auth", schema, "auth");