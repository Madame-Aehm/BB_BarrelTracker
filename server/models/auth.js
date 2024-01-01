import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  pin: { type: String }
});

export default mongoose.model("auth", schema, "auth");